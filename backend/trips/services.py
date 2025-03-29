import requests
from datetime import datetime, timedelta
import polyline
from driver_logs.models import LogEntry, LogDay
from trips.models import Location, RouteStop
from django.utils import timezone
import pytz


def _encode_polyline(coordinates):
    points = [[coord[1], coord[0]] for coord in coordinates]
    return polyline.encode(points)


class RouteService:
    OSRM_BASE_URL = "http://router.project-osrm.org/route/v1/driving/"
    OVERPASS_API_URL = "https://overpass-api.de/api/interpreter"
    AVERAGE_SPEED_MPH = 55  # Avg speed
    MAX_DRIVING_HOURS = 11  # Max consecutive driving hours
    MAX_DUTY_HOURS = 14  # Max on-duty hours
    MAX_CYCLE_HOURS = 70  # 70-hour/8-day rule
    FUEL_INTERVAL = 1000  # Miles between fuel stops
    REST_PERIOD_HOURS = 10  # Required rest period
    GAS_STATION_SEARCH_RADIUS = 10000  # 10km radius to search for gas stations

    def __init__(self, trip):
        self.trip = trip
        self.current_datetime = trip.trip_date
        self.remaining_cycle_hours = 70 - trip.current_cycle_hours
        self.average_driving_speed = trip.average_speed
        self.total_distance = 0

    def plan_route(self):
        waypoints = [
            (self.trip.current_location.longitude, self.trip.current_location.latitude),
            (self.trip.pickup_location.longitude, self.trip.pickup_location.latitude),
            (self.trip.dropoff_location.longitude, self.trip.dropoff_location.latitude)
        ]
        route_data = self._get_osrm_route(waypoints)
        encoded_polyline = _encode_polyline(route_data['geometry']['coordinates'])
        self.trip.polyline = encoded_polyline
        self.trip.save()

        self.total_distance = route_data['distance'] * 0.000621371

        self._calculate_stops(route_data)
        self._generate_log_entries()

        return self.trip

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
        if timezone.is_naive(current_time):
            current_time = timezone.make_aware(current_time, pytz.UTC)

        self.remaining_cycle_hours = self.MAX_CYCLE_HOURS - self.trip.current_cycle_hours
        driving_hours_since_rest = 0
        on_duty_hours_since_rest = 0
        duty_start_time = None
        miles_since_fuel = 0
        stops = []
        last_stop_type = None

        def add_stop(stop_type, location, start_time, end_time):
            nonlocal last_stop_type, driving_hours_since_rest, on_duty_hours_since_rest, duty_start_time
            if last_stop_type == stop_type and stop_type in ['pickup', 'dropoff']:
                return
            duration_hours = (end_time - start_time).total_seconds() / 3600
            if stop_type in ['driving', 'fuel', 'pickup', 'dropoff']:
                if duty_start_time is None:
                    duty_start_time = start_time
                if (duty_start_time and (
                        current_time - duty_start_time).total_seconds() / 3600 + duration_hours > self.MAX_DUTY_HOURS) or \
                        (
                                stop_type == 'driving' and driving_hours_since_rest + duration_hours > self.MAX_DRIVING_HOURS) or \
                        (self.remaining_cycle_hours - duration_hours < 0):
                    rest_end_time = start_time + timedelta(hours=self.REST_PERIOD_HOURS)
                    stops.append(self._add_stop('rest', location, start_time, rest_end_time))
                    driving_hours_since_rest = 0
                    on_duty_hours_since_rest = 0
                    duty_start_time = None
                    return
                if stop_type == 'driving':
                    driving_hours_since_rest += duration_hours
                on_duty_hours_since_rest += duration_hours
                self.remaining_cycle_hours -= duration_hours
            elif stop_type in ['rest', 'reset']:
                driving_hours_since_rest = 0
                on_duty_hours_since_rest = 0
                duty_start_time = None
                if stop_type == 'reset':
                    self.remaining_cycle_hours = self.MAX_CYCLE_HOURS
            stops.append(self._add_stop(stop_type, location, start_time, end_time))
            last_stop_type = stop_type

        def process_route(start_location, end_location, distance, stop_type):
            nonlocal current_time, driving_hours_since_rest, on_duty_hours_since_rest, duty_start_time, miles_since_fuel
            remaining_distance = distance
            current_position = 0

            while remaining_distance > 0:
                if self.remaining_cycle_hours <= 0:
                    reset_end_time = current_time + timedelta(hours=34)
                    add_stop('reset', start_location, current_time, reset_end_time)
                    current_time = reset_end_time
                    continue

                hours_to_drive_limit = self.MAX_DRIVING_HOURS - driving_hours_since_rest
                hours_to_duty_limit = self.MAX_DUTY_HOURS - on_duty_hours_since_rest if duty_start_time else self.MAX_DUTY_HOURS
                hours_to_cycle_limit = self.remaining_cycle_hours
                miles_to_fuel = self.FUEL_INTERVAL - miles_since_fuel

                hours_to_next_stop = min(hours_to_drive_limit, hours_to_duty_limit, hours_to_cycle_limit)
                if hours_to_next_stop <= 0:
                    rest_end_time = current_time + timedelta(hours=self.REST_PERIOD_HOURS)
                    add_stop('rest', start_location, current_time, rest_end_time)
                    current_time = rest_end_time
                    continue

                miles_to_next_stop = hours_to_next_stop * self.AVERAGE_SPEED_MPH

                if miles_to_fuel <= miles_to_next_stop and miles_to_fuel < remaining_distance:
                    distance_covered = miles_to_fuel
                    stop_reason = 'fuel'
                elif miles_to_next_stop < remaining_distance:
                    distance_covered = miles_to_next_stop
                    stop_reason = 'rest'
                else:
                    distance_covered = remaining_distance
                    stop_reason = 'destination'

                drive_time = distance_covered / self.AVERAGE_SPEED_MPH
                drive_end_time = current_time + timedelta(hours=drive_time)
                add_stop('driving', start_location, current_time, drive_end_time)
                current_time = drive_end_time
                current_position += distance_covered / distance
                miles_since_fuel += distance_covered
                remaining_distance -= distance_covered

                if stop_reason == 'fuel':
                    fuel_location = self._find_gas_station(
                        start_location.latitude + (end_location.latitude - start_location.latitude) * current_position,
                        start_location.longitude + (
                                end_location.longitude - start_location.longitude) * current_position
                    ) or self._create_fuel_location(start_location, end_location, current_position)
                    fuel_end_time = current_time + timedelta(hours=0.5)
                    add_stop('fuel', fuel_location, current_time, fuel_end_time)
                    current_time = fuel_end_time
                    miles_since_fuel = 0
                elif stop_reason == 'rest':
                    rest_location = self._create_rest_location_at_position(start_location, end_location,
                                                                           current_position)
                    rest_end_time = current_time + timedelta(hours=self.REST_PERIOD_HOURS)
                    add_stop('rest', rest_location, current_time, rest_end_time)
                    current_time = rest_end_time

            add_stop(stop_type, end_location, current_time, current_time + timedelta(hours=1))
            current_time += timedelta(hours=1)

        process_route(self.trip.current_location, self.trip.pickup_location, pickup_distance, 'pickup')
        process_route(self.trip.pickup_location, self.trip.dropoff_location, dropoff_distance, 'dropoff')

        return stops

    def _find_gas_station(self, lat, lon):

        try:

            overpass_query = f"""
            [out:json];
            node["amenity"="fuel"](around:{self.GAS_STATION_SEARCH_RADIUS},{lat},{lon});
            out body;
            """

            response = requests.post(self.OVERPASS_API_URL, data={'data': overpass_query})

            if response.status_code != 200:
                return None

            data = response.json()

            if not data['elements'] or len(data['elements']) == 0:
                return None

            gas_station = data['elements'][0]

            name = gas_station.get('tags', {}).get('name', 'Gas Station')

            address_parts = []
            tags = gas_station.get('tags', {})

            if 'addr:housenumber' in tags:
                address_parts.append(tags['addr:housenumber'])
            if 'addr:street' in tags:
                address_parts.append(tags['addr:street'])
            if 'addr:city' in tags:
                address_parts.append(tags['addr:city'])
            if 'addr:state' in tags:
                address_parts.append(tags['addr:state'])
            if 'addr:postcode' in tags:
                address_parts.append(tags['addr:postcode'])

            address = ", ".join(address_parts) if address_parts else f"Gas station near coordinates"
            full_address = f"{name}, {address}" if name and address else name or address or "Gas station"

            location = Location.objects.create(
                latitude=gas_station['lat'],
                longitude=gas_station['lon'],
                address=full_address
            )

            return location
        except Exception as e:

            return None

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

        trip_start_time = self.current_datetime
        if timezone.is_naive(trip_start_time):
            trip_start_time = timezone.make_aware(trip_start_time, pytz.UTC)

        current_date = trip_start_time.date()
        current_log_day = LogDay.objects.create(trip=self.trip, date=current_date)
        previous_end_time = trip_start_time
 
        if trip_start_time.hour * 60 + trip_start_time.minute > 0:
            LogEntry.objects.create(
                log_day=current_log_day,
                type='off',
                start=0,
                end=trip_start_time.hour * 60 + trip_start_time.minute,
                remark="Off duty before trip start"
            )

        for stop in stops:
            arrival_time = stop.arrival_time
            departure_time = stop.departure_time
            if timezone.is_naive(arrival_time):
                arrival_time = timezone.make_aware(arrival_time, pytz.UTC)
            if timezone.is_naive(departure_time):
                departure_time = timezone.make_aware(departure_time, pytz.UTC)

            stop_date = arrival_time.date()

            if stop_date != current_date:
                last_minutes = previous_end_time.hour * 60 + previous_end_time.minute
                if last_minutes < 1440:
                    LogEntry.objects.create(
                        log_day=current_log_day,
                        type='off',
                        start=last_minutes,
                        end=1440,
                        remark="Off duty"
                    )
                current_date = stop_date
                current_log_day = LogDay.objects.create(trip=self.trip, date=current_date)
                previous_end_time = datetime.combine(current_date, datetime.min.time(), tzinfo=pytz.UTC)

     
            start_minutes = arrival_time.hour * 60 + arrival_time.minute
            end_minutes = departure_time.hour * 60 + departure_time.minute
            if departure_time.date() > arrival_time.date():
                LogEntry.objects.create(
                    log_day=current_log_day,
                    type=self._get_entry_type(stop.stop_type),
                    start=start_minutes,
                    end=1440,
                    remark=self._get_remark(stop)
                )
                current_date = departure_time.date()
                current_log_day = LogDay.objects.create(trip=self.trip, date=current_date)
                LogEntry.objects.create(
                    log_day=current_log_day,
                    type=self._get_entry_type(stop.stop_type),
                    start=0,
                    end=end_minutes,
                    remark=f"{self._get_remark(stop)} (continued)"
                )
            else:
                LogEntry.objects.create(
                    log_day=current_log_day,
                    type=self._get_entry_type(stop.stop_type),
                    start=start_minutes,
                    end=end_minutes,
                    remark=self._get_remark(stop)
                )

            previous_end_time = departure_time

        last_minutes = previous_end_time.hour * 60 + previous_end_time.minute
        if last_minutes < 1440:
            LogEntry.objects.create(
                log_day=current_log_day,
                type='off',
                start=last_minutes,
                end=1440,
                remark="Off duty"
            )

    def _get_entry_type(self, stop_type):
        if stop_type == 'rest':
            return 'sb' 
        elif stop_type in ['pickup', 'dropoff', 'fuel']:
            return 'on'  
        elif stop_type == 'reset':
            return 'off' 
        else:
            return 'driving'  

    def _get_remark(self, stop):
        if stop.stop_type == 'pickup':
            return f"Loading at {stop.location.address}"
        elif stop.stop_type == 'dropoff':
            return f"Unloading at {stop.location.address}"
        elif stop.stop_type == 'fuel':
            return f"Fueling at {stop.location.address}"
        elif stop.stop_type == 'rest':
            return "Rest period"
        elif stop.stop_type == 'reset':
            return "34-hour reset"
        else:
            return f"Activity at {stop.location.address}"
