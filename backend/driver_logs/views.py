from rest_framework import viewsets, status

from driver_logs.serializers import LogDaySerializer
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from driver_logs.models import LogDay
from django.db.models.signals import post_delete
from django.dispatch import receiver
from rest_framework.exceptions import PermissionDenied
class LogsView(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = LogDaySerializer

    def get_queryset(self):
        return LogDay.objects.filter(log_sheet__user=self.request.user)


    def destroy(self, request, *args, **kwargs):
        logDay = self.get_object()
        if logDay.log_sheet and logDay.log_sheet.user != request.user:
            raise PermissionDenied("You do not have permission to delete this log entry.")

        if(logDay.trip):
            logDay.trip.delete()
        else:
            logDay.delete()

        return Response({"message": "LogDay deleted successfully"}, status=status.HTTP_204_NO_CONTENT)

    @receiver(post_delete, sender=LogDay)
    def delete_log_sheet(sender, instance, **kwargs):
        if instance.log_sheet:
            instance.log_sheet.delete()
