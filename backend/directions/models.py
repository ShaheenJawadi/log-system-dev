from django.db import models


# Create your models here.

class Location(models.Model):
    latitude = models.FloatField()
    longitude = models.FloatField()
    address = models.TextField()


class Trip(models.Model):
    STATUS_CHOICES = (
        ('planned', 'Planned'),
        ('in_progress', 'In Progress'),
        ('completed', 'Completed'),
    )

    current_location = models.ForeignKey(Location, on_delete=models.CASCADE, related_name='trip_current')
    pickup_location = models.ForeignKey(Location, on_delete=models.CASCADE, related_name='trip_pickup')
    dropoff_location = models.ForeignKey(Location, on_delete=models.CASCADE, related_name='trip_dropoff')
    current_cycle_hours = models.FloatField(help_text="Current cycle hours used")
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='planned')
    created_at = models.DateTimeField(auto_now_add=True)



