from rest_framework import serializers

from driver_logs.models import LogEntry, LogDay


class LogEntrySerializer(serializers.ModelSerializer):
    class Meta:
        model = LogEntry
        fields = ['id', 'type', 'start', 'end', 'remark']


class LogDaySerializer(serializers.ModelSerializer):
    class Meta:
        model = LogDay
        fields = ['id', 'trip', 'date']
