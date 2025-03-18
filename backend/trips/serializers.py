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

    class Meta:
        model = Trip
        fields = '__all__'




class RouteStopSerializer(serializers.ModelSerializer):
    location_details = LocationSerializer(source='location', read_only=True)

    class Meta:
        model = RouteStop
        fields = '__all__'
