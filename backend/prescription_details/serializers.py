from rest_framework import serializers
from .models import PresciptionDetails

class PrescriptionDetailsSerializer(serializers.ModelSerializer):
    class Meta:
        model = PresciptionDetails
        fields = '__all__'