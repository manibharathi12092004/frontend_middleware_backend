from rest_framework import serializers


class SummarizeSerializer(serializers.Serializer):
    text = serializers.CharField(max_length=5000)

    def validate_text(self, value):
        if not value.strip():
            raise serializers.ValidationError("Text cannot be empty.")
        return value
