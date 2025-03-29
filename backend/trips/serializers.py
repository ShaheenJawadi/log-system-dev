from rest_framework import serializers
from trips.models import Location, Trip, RouteStop


class LocationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Location
        fields = '__all__'


class TripSerializer(serializers.ModelSerializer):
    current_location_details = LocationSerializer(source='current_location', read_only=True)
    pickup_location_details = LocationSerializer(source='pickup_location', read_only=True)
    dropoff_location_details = LocationSerializer(source='dropoff_location', read_only=True)
    first_log_day = serializers.SerializerMethodField()
    log_days_count = serializers.SerializerMethodField()
    trip_date = serializers.DateTimeField(format="%m-%d-%Y")
    fuel_count = serializers.SerializerMethodField()
    rest_count = serializers.SerializerMethodField()

    class Meta:
        model = Trip
        fields = '__all__'

    def get_first_log_day(self, obj):
        first_log_day = obj.log_days.order_by('date').first()
        return first_log_day.id if first_log_day else None

    def get_fuel_count(self, obj):
        return obj.stops.filter(stop_type='fuel').count()

    def get_rest_count(self, obj):
        return obj.stops.filter(stop_type__in=['rest', 'reset']).count()

    def get_log_days_count(self, obj):
        return obj.log_days.count()


class TripListSerializer(TripSerializer):
    class Meta:
        model = Trip
        exclude = ['polyline']


class RouteStopSerializer(serializers.ModelSerializer):
    location_details = LocationSerializer(source='location', read_only=True)

    class Meta:
        model = RouteStop
        fields = '__all__'
