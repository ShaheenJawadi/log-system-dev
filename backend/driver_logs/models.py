from django.db import models

from trips.models import Trip


class LogDay(models.Model):
    trip = models.ForeignKey(Trip, on_delete=models.CASCADE, related_name='log_days')
    date = models.DateField()

    def __str__(self):
        return f"Log for {self.date} - Trip {self.trip.id}"


class LogEntry(models.Model):
    LOG_TYPES = (
        ('off', 'Off Duty'),
        ('sb', 'Sleeper Berth'),
        ('driving', 'Driving'),
        ('on', 'On Duty Not Driving')
    )

    log_day = models.ForeignKey(LogDay, on_delete=models.CASCADE, related_name='entries')
    type = models.CharField(max_length=10, choices=LOG_TYPES)
    start = models.IntegerField()
    end = models.IntegerField()
    remark = models.CharField(max_length=255, null=True, blank=True)

    def __str__(self):
        return f"{self.type} from {self.start} to {self.end}"