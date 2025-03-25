from rest_framework import serializers

from driver_logs.models import LogEntry, LogDay, LogSheet


class LogSheetSerializer(serializers.ModelSerializer):
    class Meta:
        model = LogSheet
        fields = '__all__'


class LogEntrySerializer(serializers.ModelSerializer):
    class Meta:
        model = LogEntry
        fields = '__all__'


class LogDaySerializer(serializers.ModelSerializer):
    log_sheet = LogSheetSerializer(read_only=True)
    entries = LogEntrySerializer(many=True, read_only=True)
    related_log_days = serializers.SerializerMethodField()
    class Meta:
        model = LogDay
        fields = '__all__'

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        representation['entries'] = sorted(representation['entries'], key=lambda x: x['start'])

        return representation

    def get_related_log_days(self, obj):
        if obj.trip:
            return list(obj.trip.log_days.order_by('date').values_list('id', flat=True))
        return []

