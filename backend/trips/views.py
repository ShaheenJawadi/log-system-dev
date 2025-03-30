# views.py
from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.decorators import action

from driver_logs.models import LogEntry, LogDay, LogSheet
from driver_logs.serializers import LogEntrySerializer, LogDaySerializer
from user.models import Settings
from .models import Trip, Location, RouteStop
from .serializers import (TripSerializer, RouteStopSerializer, TripListSerializer)
from .services import RouteService
from rest_framework.exceptions import PermissionDenied
from django.utils.dateparse import parse_datetime


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
            trip_date=parse_datetime(request.data.get('trip_date')),
            average_speed=request.data.get('average_speed'),
            user=user
        )

        route_service = RouteService(trip)
        planned_trip = route_service.plan_route()

        # complete  data trip
        response_data = self.get_serialized_trip_data(planned_trip)

        log_days = LogDay.objects.filter(trip=trip).order_by('date')

        user_settings = Settings.objects.filter(user=user).first() or Settings()

        for log_day in log_days:

            driving_entries = LogEntry.objects.filter(log_day=log_day, type__in=['driving', 'on'])
            total_driving_minutes = 0
            total_on_duty_minutes = 0
            for entry in driving_entries:
                if entry.type == "driving":
                    total_driving_minutes += entry.end - entry.start
                elif entry.type == "on":
                    total_on_duty_minutes += entry.end - entry.start
            driving_hours = total_driving_minutes / 60
            on_duty_hours = total_on_duty_minutes / 60
            log_day.distance = driving_hours * trip.average_speed
            log_day.save()
            log_sheet = LogSheet.objects.create(
                user=user,
                date=log_day.date,
                totalMileageToday=log_day.distance,
                totalMilesToday=log_day.distance,
                OnDutyHoursToday=on_duty_hours + driving_hours,
                fromLocation=pickup_location.address,
                toLocation=dropoff_location.address,

                truckInfo=user_settings.truckInfo,
                carrierName=user_settings.carrierName,
                officeAddress=user_settings.officeAddress,
                terminalAddress=user_settings.terminalAddress,
                manifestNumber=user_settings.manifestNumber,
                shipperCommodity=user_settings.shipperCommodity,
            )

            log_day.log_sheet = log_sheet
            log_day.save()

        return Response(response_data)

    def get_serialized_trip_data(self, trip):
        log_days = LogDay.objects.filter(trip=trip).order_by('date')
        stops = RouteStop.objects.filter(trip=trip).order_by('arrival_time')

        # Serialize
        trip_data = TripSerializer(trip).data
        log_days_data = LogDaySerializer(log_days, many=True).data
        stops_data = RouteStopSerializer(stops, many=True).data

        response_data = {
            'trip': trip_data,
            'log_days': log_days_data,
            'stops': stops_data
        }

        return response_data

    def destroy(self, request, *args, **kwargs):
        trip = self.get_object()
        if trip.user != request.user:
            raise PermissionDenied(
                "You do not have permission to delete this trip.")
        trip.delete()
        return Response({"message": "Trip deleted successfully"}, status=status.HTTP_204_NO_CONTENT)

    def retrieve(self, request, *args, **kwargs):
        trip = self.get_object()
        if trip.user != request.user:
            raise PermissionDenied("You do not have permission to view this trip.")
        response_data = self.get_serialized_trip_data(trip)
        return Response(response_data)

    def list(self, request, *args, **kwargs):
        user = request.user
        trips = self.get_queryset().filter(user=user).order_by('-trip_date')
        response_data = TripListSerializer(trips, many=True).data
        return Response(response_data)
