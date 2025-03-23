from rest_framework import serializers
from .models import Patient

class PatientSerializer(serializers.ModelSerializer):
    class Meta:
        model = Patient
        fields = '__all__'
        extra_kwargs = {
            'disabilities': {'required': False, 'allow_blank': True},
            'allergies': {'required': False, 'allow_blank': True},
            'medical_history': {'required': False, 'allow_blank': True},
            'profile_photo': {'required': False, 'allow_null': True},
        }