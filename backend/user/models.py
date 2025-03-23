from django.db import models
from django.contrib.auth.models import User


class Settings(models.Model):
    truckInfo = models.CharField(max_length=255, null=True, blank=True)
    carrierName = models.CharField(max_length=255, null=True, blank=True)
    officeAddress = models.CharField(max_length=255, null=True, blank=True)
    terminalAddress = models.CharField(max_length=255, null=True, blank=True)
    manifestNumber = models.CharField(max_length=255, null=True, blank=True)
    shipperCommodity = models.CharField(max_length=255, null=True, blank=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='settings')
