import requests
from datetime import datetime, timedelta

import polyline

from driver_logs.models import LogEntry, LogDay
from trips.models import Location, RouteStop


class RouteService:
    OSRM_BASE_URL = "http://router.project-osrm.org/route/v1/driving/"
    AVERAGE_SPEED_MPH = 55  # Avg speed
    MAX_DRIVING_HOURS = 11  # Max consecutive driving hours
    MAX_DUTY_HOURS = 14  # Max on-duty hours
    MAX_CYCLE_HOURS = 70  # 70-hour/8-day rule
    FUEL_INTERVAL = 1000  # Miles between fuel stops

    def __init__(self, trip):
        self.trip = trip
        self.current_datetime = datetime.now()
        self.remaining_cycle_hours = 70 - trip.current_cycle_hours

    def plan_route(self):


        waypoints = [
            (self.trip.current_location.longitude, self.trip.current_location.latitude),
            (self.trip.pickup_location.longitude, self.trip.pickup_location.latitude),
            (self.trip.dropoff_location.longitude, self.trip.dropoff_location.latitude)
        ]

        route_data = self._get_osrm_route(waypoints)
        encoded_polyline = self._encode_polyline(route_data['geometry']['coordinates'])
        self.trip.polyline = encoded_polyline
        self.trip.save()
        self._calculate_stops(route_data)
        self._generate_log_entries()

        return self.trip

    def _encode_polyline(self, coordinates):
        points = [[coord[1], coord[0]] for coord in coordinates]
        return polyline.encode(points)

    def _get_osrm_route(self, waypoints):
        waypoints_str = ";".join([f"{lon},{lat}" for lon, lat in waypoints])
        url = f"{self.OSRM_BASE_URL}{waypoints_str}?overview=full&geometries=geojson&steps=true"
        print(url)

        response = requests.get(url)
        data = response.json()

        if data['code'] != 'Ok':
            raise Exception(f"OSRM API error: {data['message']}")

        return data['routes'][0]


    def _calculate_stops(self, route_data):
        total_distance_miles = route_data['distance'] * 0.000621371
        total_duration_hours = route_data['duration'] / 3600

        self._add_stop('pickup', self.trip.pickup_location,
                       self.current_datetime, self.current_datetime + timedelta(hours=1))

        current_time = self.current_datetime + timedelta(hours=1)  # After 1 hour at pickup
        remaining_distance = total_distance_miles

        pickup_distance = self._calculate_distance(
            (self.trip.current_location.longitude, self.trip.current_location.latitude),
            (self.trip.pickup_location.longitude, self.trip.pickup_location.latitude)
        )

        driving_hours_since_break = pickup_distance / self.AVERAGE_SPEED_MPH
        on_duty_hours_since_break = driving_hours_since_break + 1

        if driving_hours_since_break >= self.MAX_DRIVING_HOURS or on_duty_hours_since_break >= self.MAX_DUTY_HOURS:

            rest_location = self._create_rest_location(self.trip.pickup_location)
            self._add_stop('rest', rest_location, current_time, current_time + timedelta(hours=10))
            current_time += timedelta(hours=10)
            driving_hours_since_break = 0
            on_duty_hours_since_break = 0

        remaining_distance -= pickup_distance
        miles_since_fuel = pickup_distance

        while remaining_distance > 0:
            hours_to_driving_limit = self.MAX_DRIVING_HOURS - driving_hours_since_break
            hours_to_duty_limit = self.MAX_DUTY_HOURS - on_duty_hours_since_break
            hours_to_cycle_limit = self.remaining_cycle_hours

            hours_to_next_limit = min(hours_to_driving_limit, hours_to_duty_limit, hours_to_cycle_limit)
            miles_to_next_limit = hours_to_next_limit * self.AVERAGE_SPEED_MPH

            miles_to_fuel = self.FUEL_INTERVAL - miles_since_fuel

            if miles_to_fuel < miles_to_next_limit:
                distance_covered = miles_to_fuel
                fuel_time = distance_covered / self.AVERAGE_SPEED_MPH

                current_time += timedelta(hours=fuel_time)
                driving_hours_since_break += fuel_time
                on_duty_hours_since_break += fuel_time + 0.5
                self.remaining_cycle_hours -= fuel_time + 0.5

                fuel_location = self._create_fuel_location(current_time)
                self._add_stop('fuel', fuel_location, current_time, current_time + timedelta(hours=0.5))

                current_time += timedelta(hours=0.5)
                miles_since_fuel = 0
                remaining_distance -= distance_covered

            elif miles_to_next_limit < remaining_distance:
                distance_covered = miles_to_next_limit
                drive_time = distance_covered / self.AVERAGE_SPEED_MPH

                current_time += timedelta(hours=drive_time)
                self.remaining_cycle_hours -= drive_time

                rest_location = self._create_rest_location(self.trip.pickup_location)
                self._add_stop('rest', rest_location, current_time, current_time + timedelta(hours=10))

                current_time += timedelta(hours=10)
                driving_hours_since_break = 0
                on_duty_hours_since_break = 0
                miles_since_fuel += distance_covered
                remaining_distance -= distance_covered

            else:
                drive_time = remaining_distance / self.AVERAGE_SPEED_MPH
                current_time += timedelta(hours=drive_time)
                self.remaining_cycle_hours -= drive_time

                self._add_stop('dropoff', self.trip.dropoff_location,
                               current_time, current_time + timedelta(hours=1))

                current_time += timedelta(hours=1)
                self.remaining_cycle_hours -= 1
                remaining_distance = 0

    def _calculate_distance(self, point1, point2):
        waypoints_str = f"{point1[0]},{point1[1]};{point2[0]},{point2[1]}"
        url = f"{self.OSRM_BASE_URL}{waypoints_str}?overview=false"

        response = requests.get(url)
        data = response.json()

        if data['code'] != 'Ok':
            raise Exception(f"OSRM API error: {data['message']}")

        return data['routes'][0]['distance'] * 0.000621371  #  meters to miles

    def _create_rest_location(self, reference_location):

        location = Location.objects.create(
            latitude=reference_location.latitude + 0.01,  # Slight offset
            longitude=reference_location.longitude + 0.01,
            address=f"Rest area near {reference_location.address}"
        )
        return location

    def _create_fuel_location(self, reference_time):
        location = Location.objects.create(
            latitude=(self.trip.pickup_location.latitude + self.trip.dropoff_location.latitude) / 2,
            longitude=(self.trip.pickup_location.longitude + self.trip.dropoff_location.longitude) / 2,
            address=f"Fuel station along route"
        )
        return location

    def _add_stop(self, stop_type, location, arrival_time, departure_time):
        RouteStop.objects.create(
            trip=self.trip,
            stop_type=stop_type,
            location=location,
            arrival_time=arrival_time,
            departure_time=departure_time
        )




    def _generate_log_entries(self):
        stops = self.trip.stops.all().order_by('arrival_time')
        current_date = stops[0].arrival_time.date()
        current_log_day = LogDay.objects.create(trip=self.trip, date=current_date)
        previous_entry_end = 0  # Midnight

        for i, stop in enumerate(stops):
            stop_date = stop.arrival_time.date()

            if stop_date != current_date:
                if previous_entry_end < 24 * 60:
                    LogEntry.objects.create(
                        log_day=current_log_day,
                        type='off',
                        start=previous_entry_end,
                        end=24 * 60,
                        remark="Off duty"
                    )

                current_date = stop_date
                current_log_day = LogDay.objects.create(trip=self.trip, date=current_date)
                previous_entry_end = 0

            start_minutes = (stop.arrival_time.hour * 60) + stop.arrival_time.minute

            if start_minutes > previous_entry_end:
                LogEntry.objects.create(
                    log_day=current_log_day,
                    type='driving',
                    start=previous_entry_end,
                    end=start_minutes,
                    remark=f"Driving to {stop.location.address}"
                )

            if stop.stop_type == 'rest':
                end_minutes = ((stop.departure_time.hour * 60) + stop.departure_time.minute)

                if end_minutes <= start_minutes:
                    LogEntry.objects.create(
                        log_day=current_log_day,
                        type='sb',
                        start=start_minutes,
                        end=24 * 60,
                        remark="Rest period"
                    )

                    next_date = current_date + timedelta(days=1)
                    next_log_day = LogDay.objects.create(trip=self.trip, date=next_date)

                    LogEntry.objects.create(
                        log_day=next_log_day,
                        type='sb',
                        start=0,
                        end=end_minutes,
                        remark="Rest period (continued)"
                    )

                    current_date = next_date
                    current_log_day = next_log_day
                    previous_entry_end = end_minutes
                else:
                    LogEntry.objects.create(
                        log_day=current_log_day,
                        type='sb',
                        start=start_minutes,
                        end=end_minutes,
                        remark="Rest period"
                    )
                    previous_entry_end = end_minutes

            elif stop.stop_type in ['pickup', 'dropoff', 'fuel']:
                end_minutes = ((stop.departure_time.hour * 60) + stop.departure_time.minute)
                activity = {
                    'pickup': 'Loading',
                    'dropoff': 'Unloading',
                    'fuel': 'Fueling'
                }[stop.stop_type]

                LogEntry.objects.create(
                    log_day=current_log_day,
                    type='on',
                    start=start_minutes,
                    end=end_minutes,
                    remark=f"{activity} at {stop.location.address}"
                )
                previous_entry_end = end_minutes

        if previous_entry_end < 24 * 60:
            LogEntry.objects.create(
                log_day=current_log_day,
                type='off',
                start=previous_entry_end,
                end=24 * 60,
                remark="Off duty"
            )
