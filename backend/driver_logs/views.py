from rest_framework import viewsets

from driver_logs.serializers import LogDaySerializer
from rest_framework.response import Response

from driver_logs.models import LogDay


class LogsView(viewsets.ModelViewSet):
    queryset = LogDay.objects.all()
    serializer_class = LogDaySerializer
