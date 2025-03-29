from django.contrib.auth.models import User
from django.db import models

from django.utils import timezone


# Create your models here.

class Location(models.Model):
    latitude = models.FloatField()
    longitude = models.FloatField()
    address = models.TextField()


class Trip(models.Model):
    current_location = models.ForeignKey(Location, on_delete=models.CASCADE, related_name='trip_current')
    pickup_location = models.ForeignKey(Location, on_delete=models.CASCADE, related_name='trip_pickup')
    dropoff_location = models.ForeignKey(Location, on_delete=models.CASCADE, related_name='trip_dropoff')
    current_cycle_hours = models.FloatField(default=0, help_text="Current cycle hours used")
    trip_date = models.DateTimeField(default=timezone.now)
    average_speed = models.FloatField(default=55, help_text="Current average speed used")
    polyline = models.TextField(null=True, blank=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='trip')
    total_distance = models.FloatField(null=True, blank=True)

    def save(self, *args, **kwargs):
        if self.total_distance == 0 or self.total_distance is None:
            self.total_distance = 0.0
        else:
            self.total_distance = round(self.total_distance, 2)
        super(Trip, self).save(*args, **kwargs)

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
        ('dropoff', 'Dropoff Location'),
        ('reset', '34-hour reset')
    )

    trip = models.ForeignKey(Trip, on_delete=models.CASCADE, related_name='stops')
    stop_type = models.CharField(max_length=10, choices=STOP_TYPES)
    location = models.ForeignKey(Location, on_delete=models.CASCADE)
    arrival_time = models.DateTimeField()
    departure_time = models.DateTimeField(null=True, blank=True)

    def delete(self, *args, **kwargs):
        self.location.delete()
        super().delete(*args, **kwargs)
