# views.py
from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.decorators import action

from driver_logs.models import LogEntry, LogDay
from driver_logs.serializers import LogEntrySerializer, LogDaySerializer
from .models import Trip, Location,  RouteStop
from .serializers import (TripSerializer, RouteStopSerializer)
from .services import RouteService


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

        user = request.user

        trip = Trip.objects.create(
            current_location=current_location,
            pickup_location=pickup_location,
            dropoff_location=dropoff_location,
            current_cycle_hours=request.data.get('current_cycle_hours'),
            status=request.data.get('status'),
            user=user
        )



        route_service = RouteService(trip)
        planned_trip = route_service.plan_route()


        # complete  data trip
        response_data = self.get_serialized_trip_data(planned_trip)
        return Response(response_data)

    def get_serialized_trip_data(self, trip):


        log_days = LogDay.objects.filter(trip=trip).order_by('date')
        stops = RouteStop.objects.filter(trip=trip).order_by('arrival_time')

        # Serialize
        trip_data = TripSerializer(trip).data
        log_days_data = LogDaySerializer(log_days, many=True).data
        stops_data = RouteStopSerializer(stops, many=True).data


        for log_day_data in log_days_data:
            log_day = next(ld for ld in log_days if ld.id == log_day_data['id'])
            entries = LogEntry.objects.filter(log_day=log_day).order_by('start')
            log_day_data['entries'] = LogEntrySerializer(entries, many=True).data


        response_data = {
            'trip': trip_data,
            'log_days': log_days_data,
            'stops': stops_data
        }

        return response_data


    def destroy(self, request, *args, **kwargs):
        trip = self.get_object()
        trip.delete()
        return Response({"message": "Trip deleted successfully"}, status=status.HTTP_204_NO_CONTENT)