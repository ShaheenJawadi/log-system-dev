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
    class Meta:
        model = Trip
        fields = '__all__'

    def get_first_log_day(self, obj):
        first_log_day = obj.log_days.order_by('date').first()
        return first_log_day.id if first_log_day else None


class TripListSerializer(TripSerializer):
    class Meta:
        model = Trip
        exclude = ['polyline']


class RouteStopSerializer(serializers.ModelSerializer):
    location_details = LocationSerializer(source='location', read_only=True)

    class Meta:
        model = RouteStop
        fields = '__all__'
