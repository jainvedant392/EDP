from rest_framework import serializers
from .models import *

class AllotmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Allotment
        fields = '__all__'

class WardSerializer(serializers.ModelSerializer):
    class Meta:
        model = Ward
        fields = '__all__'

class RoomSerializer(serializers.ModelSerializer):
    class Meta:
        model = Room
        fields = '__all__'

class BedSerializer(serializers.ModelSerializer):
    class Meta:
        model = Bed
        fields = '__all__'

class DepartmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Department
        fields = '__all__'
class DoctorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Doctor
        fields = '__all__'

class PatientSerializer(serializers.ModelSerializer):
    disabilities_or_diseases = serializers.ListField(
        child=serializers.CharField(allow_blank=True),
        allow_empty=True
    )
    allergies = serializers.ListField(
        child=serializers.CharField(allow_blank=True),
        allow_empty=True
    )

    class Meta:
        model = Patient
        fields = '__all__'

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