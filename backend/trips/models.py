from django.contrib.auth.models import User
from django.db import models


# Create your models here.

class Location(models.Model):
    latitude = models.FloatField()
    longitude = models.FloatField()
    address = models.TextField()


class Trip(models.Model):

    current_location = models.ForeignKey(Location, on_delete=models.CASCADE, related_name='trip_current')
    pickup_location = models.ForeignKey(Location, on_delete=models.CASCADE, related_name='trip_pickup')
    dropoff_location = models.ForeignKey(Location, on_delete=models.CASCADE, related_name='trip_dropoff')
    current_cycle_hours = models.FloatField(help_text="Current cycle hours used")
    trip_date = models.DateTimeField(auto_now_add=True)
    polyline = models.TextField(null=True, blank=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='trip')

    def delete(self, *args, **kwargs):
        self.current_location.delete()
        self.pickup_location.delete()
        self.dropoff_location.delete()
        super().delete(*args, **kwargs)


class RouteStop(models.Model):
    STOP_TYPES = (
        ('fuel', 'Fuel Stop'),
        ('rest', 'Mandatory Rest'),
        ('pickup', 'Pickup Location'),
        ('dropoff', 'Dropoff Location')
    )

    trip = models.ForeignKey(Trip, on_delete=models.CASCADE, related_name='stops')
    stop_type = models.CharField(max_length=10, choices=STOP_TYPES)
    location = models.ForeignKey(Location, on_delete=models.CASCADE)
    arrival_time = models.DateTimeField()
    departure_time = models.DateTimeField(null=True, blank=True)