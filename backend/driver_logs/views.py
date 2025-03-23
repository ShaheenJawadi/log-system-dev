from rest_framework import viewsets, status

from driver_logs.serializers import LogDaySerializer
from rest_framework.response import Response

from driver_logs.models import LogDay
from django.db.models.signals import post_delete
from django.dispatch import receiver

class LogsView(viewsets.ModelViewSet):
    queryset = LogDay.objects.all()
    serializer_class = LogDaySerializer


    def destroy(self, request, *args, **kwargs):
        logDay = self.get_object()
        if(logDay.trip):
            logDay.trip.delete()
        else:
            logDay.delete()

        return Response({"message": "LogDay deleted successfully"}, status=status.HTTP_204_NO_CONTENT)

    @receiver(post_delete, sender=LogDay)
    def delete_log_sheet(sender, instance, **kwargs):
        if instance.log_sheet:
            instance.log_sheet.delete()
