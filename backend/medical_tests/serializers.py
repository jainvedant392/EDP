from rest_framework import serializers
from .models import MedicalTest

class MedicalTestSerializer(serializers.ModelSerializer):
    class Meta:
        model = MedicalTest
        fields = '__all__'
