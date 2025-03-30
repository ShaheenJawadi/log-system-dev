from rest_framework import viewsets, status

from driver_logs.serializers import LogDaySerializer
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from driver_logs.models import LogDay, LogSheet, LogEntry
from django.db.models.signals import post_delete
from django.dispatch import receiver
from rest_framework.exceptions import PermissionDenied


class LogsView(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = LogDaySerializer

    def get_queryset(self):
        return LogDay.objects.filter(log_sheet__user=self.request.user).order_by('-date')

    def destroy(self, request, *args, **kwargs):
        logDay = self.get_object()
        if logDay.log_sheet and logDay.log_sheet.user != request.user:
            raise PermissionDenied("You do not have permission to delete this log entry.")

        if (logDay.trip):
            logDay.trip.delete()
        else:
            logDay.delete()

        return Response({"message": "LogDay deleted successfully"}, status=status.HTTP_204_NO_CONTENT)

    @receiver(post_delete, sender=LogDay)
    def delete_log_sheet(sender, instance, **kwargs):
        if instance.log_sheet:
            instance.log_sheet.delete()

    def create(self, request, *args, **kwargs):
        user = request.user
        data = request.data

        log_sheet_data = data.get("log_sheet", {})
        log_sheet = LogSheet.objects.create(user=user, **log_sheet_data)

        log_day = LogDay.objects.create(
            date=data.get("date"),
            log_sheet=log_sheet
        )

        log_entries_data = data.get("entries", [])
        for entry_data in log_entries_data:
            LogEntry.objects.create(log_day=log_day, **entry_data)

        return Response(LogDaySerializer(log_day).data, status=status.HTTP_201_CREATED)

    def update(self, request, *args, **kwargs):
        log_day = self.get_object()
        data = request.data

        if "log_sheet" in data:
            log_sheet_data = data["log_sheet"]
            for key, value in log_sheet_data.items():
                setattr(log_day.log_sheet, key, value)
            log_day.log_sheet.save()

        log_day.date = data["date"]
        log_day.save()

        log_day.entries.all().delete()
        log_entries_data = data.get("entries", [])
        for entry_data in log_entries_data:
            entry_data.pop("log_day", None)
            LogEntry.objects.create(**entry_data, log_day=log_day)

        return Response(LogDaySerializer(log_day).data, status=status.HTTP_200_OK)
