from rest_framework import serializers
from .models import TestPrescribed

class TestPrescribedSerializer(serializers.ModelSerializer):
    class Meta:
        model = TestPrescribed
        fields = '__all__'
