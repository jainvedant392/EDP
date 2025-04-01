from rest_framework import serializers
from .models import *

class AllotmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Allotment
        fields = '__all__'

class RoomBedSerializer(serializers.ModelSerializer):
    class Meta:
        model = RoomBed
        fields = '__all__'

class DepartmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Department
        fields = '__all__'
        # extra_kwargs = {
        #     'head_doctor_id': {'required': False, 'allow_null': True},
        #     'description': {'required': False, 'allow_blank': True},
        # }

class DoctorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Doctor
        fields = '__all__'
        # extra_kwargs = {
        #     'profile_photo': {'required': False, 'allow_null': True},
        # }

class PatientSerializer(serializers.ModelSerializer):
    class Meta:
        model = Patient
        fields = '__all__'
        # extra_kwargs = {
        #     'disabilities_or_diseases': {'required': False, 'allow_blank': True},
        #     'allergies': {'required': False, 'allow_blank': True},
        #     'medical_history': {'required': False, 'allow_blank': True},
        #     'profile_photo': {'required': False, 'allow_null': True},
        # }

class MedicalTestSerializer(serializers.ModelSerializer):
    class Meta:
        model = MedicalTest
        fields = '__all__'

class DiagnosisSerializer(serializers.ModelSerializer):
    class Meta:
        model = Diagnosis
        fields = '__all__'

class TestPrescribedSerializer(serializers.ModelSerializer):
    class Meta:
        model = TestPrescribed
        fields = '__all__'

class PrescriptionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Prescription
        fields = '__all__'

class PrescriptionDetailsSerializer(serializers.ModelSerializer):
    class Meta:
        model = PrescriptionDetails
        fields = '__all__'