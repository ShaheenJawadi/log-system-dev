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
    REST_PERIOD_HOURS = 10  # Required rest period

    def __init__(self, trip):
        self.trip = trip
        self.current_datetime = datetime.now()
        self.remaining_cycle_hours = 70 - trip.current_cycle_hours
        self.total_distance = 0

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
        self.total_distance = route_data['distance'] * 0.000621371  # meters to miles

        self._calculate_stops(route_data)
        self._generate_log_entries()

        return self.trip

    def _encode_polyline(self, coordinates):
        points = [[coord[1], coord[0]] for coord in coordinates]
        return polyline.encode(points)

    def _get_osrm_route(self, waypoints):
        waypoints_str = ";".join([f"{lon},{lat}" for lon, lat in waypoints])
        url = f"{self.OSRM_BASE_URL}{waypoints_str}?overview=full&geometries=geojson&steps=true"

        response = requests.get(url)
        data = response.json()

        if data['code'] != 'Ok':
            raise Exception(f"OSRM API error: {data['message']}")

        return data['routes'][0]

    def _calculate_stops(self, route_data):
        total_distance_miles = route_data['distance'] * 0.000621371

        pickup_distance = self._calculate_distance(
            (self.trip.current_location.longitude, self.trip.current_location.latitude),
            (self.trip.pickup_location.longitude, self.trip.pickup_location.latitude)
        )

        dropoff_distance = self._calculate_distance(
            (self.trip.pickup_location.longitude, self.trip.pickup_location.latitude),
            (self.trip.dropoff_location.longitude, self.trip.dropoff_location.latitude)
        )

        current_time = self.current_datetime
        driving_hours_since_break = 0
        on_duty_hours_since_break = 0
        miles_since_fuel = 0

        remaining_distance = pickup_distance
        current_position = 0

        while remaining_distance > 0:

            hours_to_driving_limit = self.MAX_DRIVING_HOURS - driving_hours_since_break
            hours_to_duty_limit = self.MAX_DUTY_HOURS - on_duty_hours_since_break
            hours_to_cycle_limit = self.remaining_cycle_hours

            hours_to_next_limit = min(hours_to_driving_limit, hours_to_duty_limit, hours_to_cycle_limit)
            miles_to_next_limit = hours_to_next_limit * self.AVERAGE_SPEED_MPH

            miles_to_fuel = self.FUEL_INTERVAL - miles_since_fuel

            if miles_to_fuel <= miles_to_next_limit and miles_to_fuel < remaining_distance:

                distance_covered = miles_to_fuel
                drive_time = distance_covered / self.AVERAGE_SPEED_MPH

                current_time += timedelta(hours=drive_time)
                driving_hours_since_break += drive_time
                on_duty_hours_since_break += drive_time
                self.remaining_cycle_hours -= drive_time

                current_position += distance_covered / pickup_distance

                fuel_location = self._create_fuel_location(
                    self.trip.current_location,
                    self.trip.pickup_location,
                    current_position
                )

                self._add_stop('fuel', fuel_location, current_time, current_time + timedelta(hours=0.5))

                current_time += timedelta(hours=0.5)
                on_duty_hours_since_break += 0.5
                self.remaining_cycle_hours -= 0.5

                miles_since_fuel = 0
                remaining_distance -= distance_covered

            elif miles_to_next_limit < remaining_distance:

                distance_covered = miles_to_next_limit
                drive_time = distance_covered / self.AVERAGE_SPEED_MPH

                current_time += timedelta(hours=drive_time)
                driving_hours_since_break += drive_time
                on_duty_hours_since_break += drive_time
                self.remaining_cycle_hours -= drive_time

                current_position += distance_covered / pickup_distance
                miles_since_fuel += distance_covered

                rest_location = self._create_rest_location_at_position(
                    self.trip.current_location,
                    self.trip.pickup_location,
                    current_position
                )

                self._add_stop('rest', rest_location, current_time,
                               current_time + timedelta(hours=self.REST_PERIOD_HOURS))

                current_time += timedelta(hours=self.REST_PERIOD_HOURS)
                driving_hours_since_break = 0
                on_duty_hours_since_break = 0

                remaining_distance -= distance_covered

            else:

                drive_time = remaining_distance / self.AVERAGE_SPEED_MPH

                current_time += timedelta(hours=drive_time)
                driving_hours_since_break += drive_time
                on_duty_hours_since_break += drive_time
                self.remaining_cycle_hours -= drive_time
                miles_since_fuel += remaining_distance

                self._add_stop('pickup', self.trip.pickup_location,
                               current_time, current_time + timedelta(hours=1))

                current_time += timedelta(hours=1)
                on_duty_hours_since_break += 1
                self.remaining_cycle_hours -= 1

                remaining_distance = 0

        if driving_hours_since_break >= self.MAX_DRIVING_HOURS * 0.9 or on_duty_hours_since_break >= self.MAX_DUTY_HOURS * 0.9:
            rest_location = self._create_rest_location(self.trip.pickup_location)
            self._add_stop('rest', rest_location, current_time, current_time + timedelta(hours=self.REST_PERIOD_HOURS))
            current_time += timedelta(hours=self.REST_PERIOD_HOURS)
            driving_hours_since_break = 0
            on_duty_hours_since_break = 0

        remaining_distance = dropoff_distance
        position = 0

        while remaining_distance > 0:

            hours_to_driving_limit = self.MAX_DRIVING_HOURS - driving_hours_since_break
            hours_to_duty_limit = self.MAX_DUTY_HOURS - on_duty_hours_since_break
            hours_to_cycle_limit = self.remaining_cycle_hours

            hours_to_next_limit = min(hours_to_driving_limit, hours_to_duty_limit, hours_to_cycle_limit)
            miles_to_next_limit = hours_to_next_limit * self.AVERAGE_SPEED_MPH

            miles_to_fuel = self.FUEL_INTERVAL - miles_since_fuel

            if miles_to_fuel <= miles_to_next_limit and miles_to_fuel < remaining_distance:

                distance_covered = miles_to_fuel
                drive_time = distance_covered / self.AVERAGE_SPEED_MPH

                current_time += timedelta(hours=drive_time)
                driving_hours_since_break += drive_time
                on_duty_hours_since_break += drive_time
                self.remaining_cycle_hours -= drive_time

                position += distance_covered / dropoff_distance

                fuel_location = self._create_fuel_location(
                    self.trip.pickup_location,
                    self.trip.dropoff_location,
                    position
                )

                self._add_stop('fuel', fuel_location, current_time, current_time + timedelta(hours=0.5))

                current_time += timedelta(hours=0.5)
                on_duty_hours_since_break += 0.5
                self.remaining_cycle_hours -= 0.5

                miles_since_fuel = 0
                remaining_distance -= distance_covered

            elif miles_to_next_limit < remaining_distance:

                distance_covered = miles_to_next_limit
                drive_time = distance_covered / self.AVERAGE_SPEED_MPH

                current_time += timedelta(hours=drive_time)
                driving_hours_since_break += drive_time
                on_duty_hours_since_break += drive_time
                self.remaining_cycle_hours -= drive_time

                position += distance_covered / dropoff_distance
                miles_since_fuel += distance_covered

                rest_location = self._create_rest_location_at_position(
                    self.trip.pickup_location,
                    self.trip.dropoff_location,
                    position
                )

                self._add_stop('rest', rest_location, current_time,
                               current_time + timedelta(hours=self.REST_PERIOD_HOURS))

                current_time += timedelta(hours=self.REST_PERIOD_HOURS)
                driving_hours_since_break = 0
                on_duty_hours_since_break = 0

                remaining_distance -= distance_covered

            else:

                drive_time = remaining_distance / self.AVERAGE_SPEED_MPH

                current_time += timedelta(hours=drive_time)
                driving_hours_since_break += drive_time
                on_duty_hours_since_break += drive_time
                self.remaining_cycle_hours -= drive_time

                self._add_stop('dropoff', self.trip.dropoff_location,
                               current_time, current_time + timedelta(hours=1))

                current_time += timedelta(hours=1)
                on_duty_hours_since_break += 1
                self.remaining_cycle_hours -= 1

                remaining_distance = 0

    def _calculate_distance(self, point1, point2):
        waypoints_str = f"{point1[0]},{point1[1]};{point2[0]},{point2[1]}"
        url = f"{self.OSRM_BASE_URL}{waypoints_str}?overview=false"

        response = requests.get(url)
        data = response.json()

        if data['code'] != 'Ok':
            raise Exception(f"OSRM API error: {data['message']}")

        return data['routes'][0]['distance'] * 0.000621371

    def _create_rest_location(self, reference_location):

        location = Location.objects.create(
            latitude=reference_location.latitude + 0.01,
            longitude=reference_location.longitude + 0.01,
            address=f"Rest area near {reference_location.address}"
        )
        return location

    def _create_rest_location_at_position(self, start_location, end_location, position):

        latitude = start_location.latitude + (end_location.latitude - start_location.latitude) * position
        longitude = start_location.longitude + (end_location.longitude - start_location.longitude) * position

        location = Location.objects.create(
            latitude=latitude,
            longitude=longitude,
            address=f"Rest area along route"
        )
        return location

    def _create_fuel_location(self, start_location, end_location, position):
        latitude = start_location.latitude + (end_location.latitude - start_location.latitude) * position
        longitude = start_location.longitude + (end_location.longitude - start_location.longitude) * position

        location = Location.objects.create(
            latitude=latitude,
            longitude=longitude,
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

        if not stops:
            return

        current_date = stops[0].arrival_time.date()
        current_log_day = LogDay.objects.create(trip=self.trip, date=current_date)
        previous_entry_end = 0

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

                if i > 0:
                    remark = f"Driving to {stop.location.address}"
                else:
                    remark = f"Driving to {stop.location.address}"

                LogEntry.objects.create(
                    log_day=current_log_day,
                    type='driving',
                    start=previous_entry_end,
                    end=start_minutes,
                    remark=remark
                )

            end_minutes = (stop.departure_time.hour * 60) + stop.departure_time.minute

            if end_minutes <= start_minutes and stop.departure_time.date() > stop.arrival_time.date():

                if stop.stop_type == 'rest':

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
                else:

                    LogEntry.objects.create(
                        log_day=current_log_day,
                        type=self._get_entry_type(stop.stop_type),
                        start=start_minutes,
                        end=24 * 60,
                        remark=self._get_remark(stop)
                    )

                    next_date = current_date + timedelta(days=1)
                    next_log_day = LogDay.objects.create(trip=self.trip, date=next_date)

                    LogEntry.objects.create(
                        log_day=next_log_day,
                        type=self._get_entry_type(stop.stop_type),
                        start=0,
                        end=end_minutes,
                        remark=f"{self._get_remark(stop)} (continued)"
                    )

                    current_date = next_date
                    current_log_day = next_log_day

                previous_entry_end = end_minutes
            else:

                LogEntry.objects.create(
                    log_day=current_log_day,
                    type=self._get_entry_type(stop.stop_type),
                    start=start_minutes,
                    end=end_minutes,
                    remark=self._get_remark(stop)
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

    def _get_entry_type(self, stop_type):
        if stop_type == 'rest':
            return 'sb'
        elif stop_type in ['pickup', 'dropoff', 'fuel']:
            return 'on'
        else:
            return 'driving'

    def _get_remark(self, stop):
        if stop.stop_type == 'pickup':
            return f"Pickup at {stop.location.address}"
        elif stop.stop_type == 'dropoff':
            return f"Dropoff at {stop.location.address}"
        elif stop.stop_type == 'fuel':
            return f"Fueling at {stop.location.address}"
        elif stop.stop_type == 'rest':
            return "Rest period"
        else:
            return f"Activity at {stop.location.address}"
