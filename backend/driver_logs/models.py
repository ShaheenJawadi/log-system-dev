from django.db import models
from django.contrib.auth.models import User

from trips.models import Trip


class LogSheet(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='log_sheets_driver')
    totalMilesToday = models.IntegerField(null=True, blank=True)
    totalMileageToday = models.IntegerField(null=True, blank=True)
    truckInfo = models.CharField(max_length=255, null=True, blank=True)
    carrierName = models.CharField(max_length=255, null=True, blank=True)
    officeAddress = models.CharField(max_length=255, null=True, blank=True)
    terminalAddress = models.CharField(max_length=255, null=True, blank=True)
    manifestNumber = models.CharField(max_length=255, null=True, blank=True)
    shipperCommodity = models.CharField(max_length=255, null=True, blank=True)
    date = models.DateField(null=True, blank=True)
    fromLocation = models.CharField(max_length=255, null=True, blank=True)
    toLocation = models.CharField(max_length=255, null=True, blank=True)
    OnDutyHoursToday = models.IntegerField(null=True, blank=True)
    totalOnDutyLast7Days = models.IntegerField(null=True, blank=True)
    totalAvailableTomorrow70 = models.IntegerField(null=True, blank=True)
    totalOnDutyLast5Days = models.IntegerField(null=True, blank=True)
    totalOnDutyLast8Days = models.IntegerField(null=True, blank=True)
    totalAvailableTomorrow60 = models.IntegerField(null=True, blank=True)
    totalOnDutyLast7Days60 = models.IntegerField(null=True, blank=True)


class LogDay(models.Model):
    trip = models.ForeignKey(Trip, on_delete=models.CASCADE, related_name='log_days',null=True, blank=True)
    date = models.DateField()
    log_sheet = models.OneToOneField(LogSheet, on_delete=models.CASCADE, related_name='log_day', null=True, blank=True)






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
