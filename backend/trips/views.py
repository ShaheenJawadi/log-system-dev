# views.py
from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.decorators import action
from .models import Trip, Location
from .serializers import (TripSerializer)


class TripViewSet(viewsets.ModelViewSet):
    queryset = Trip.objects.all()
    serializer_class = TripSerializer

    @action(detail=False, methods=['post'])
    def plan(self, request):

        current_location_data = request.data.get('current_location')
        pickup_location_data = request.data.get('pickup_location')
        dropoff_location_data = request.data.get('dropoff_location')


        current_location = Location.objects.create(
            address=current_location_data.get('address'),
            latitude=current_location_data.get('latitude'),
            longitude=current_location_data.get('longitude')
        )

        pickup_location = Location.objects.create(
            address=pickup_location_data.get('address'),
            latitude=pickup_location_data.get('latitude'),
            longitude=pickup_location_data.get('longitude')
        )

        dropoff_location = Location.objects.create(
            address=dropoff_location_data.get('address'),
            latitude=dropoff_location_data.get('latitude'),
            longitude=dropoff_location_data.get('longitude')
        )


        trip = Trip.objects.create(
            current_location=current_location,
            pickup_location=pickup_location,
            dropoff_location=dropoff_location,
            current_cycle_hours=request.data.get('current_cycle_hours'),
            status=request.data.get('status')
        )


        serializer = TripSerializer(trip)
        return Response(serializer.data, status=status.HTTP_201_CREATED)