from rest_framework import serializers
from .models import *
from django.db import transaction


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
    tests = serializers.ListField(
        child=serializers.CharField(allow_blank=True),
        allow_empty=True
    )

    class Meta:
        model = Diagnosis
        fields = '__all__'

class TestPrescribedSerializer(serializers.ModelSerializer):
    class Meta:
        model = TestPrescribed
        fields = '__all__'

class PrescriptionDetailsSerializer(serializers.ModelSerializer):
    class Meta:
        model = PrescriptionDetails
        fields = ['drug', 'dosage', 'method', 'duration']

class PrescriptionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Prescription
        fields = ['prescription_date', 'additional_notes', 'status']


class DiagnosisFullCreateSerializer(serializers.ModelSerializer):
    prescriptions = PrescriptionDetailsSerializer(many=True, required=False)
    additional_notes = serializers.CharField(required=False, write_only=True)
    
    class Meta:
        model = Diagnosis
        exclude = ['id', 'created_at', 'updated_at']
    
    def create(self, validated_data):
        # Extract prescription-related data
        prescriptions_data = validated_data.pop('prescriptions', [])
        additional_notes = validated_data.pop('additional_notes', '')
        
        with transaction.atomic():
            # Create the diagnosis
            diagnosis = Diagnosis.objects.create(**validated_data)
            
            # Only create a prescription if there are prescription details
            if prescriptions_data:
                # Create the prescription
                prescription = Prescription.objects.create(
                    diagnosis_id=diagnosis,
                    patient_id=diagnosis.patient_id,
                    prescribed_by_doctor_id=diagnosis.visiting_doctor_id,
                    prescription_date=diagnosis.diagnosis_date,
                    additional_notes=additional_notes,
                    status='active'  # Set to active by default
                )
                
                # Create the prescription details
                for prescription_detail in prescriptions_data:
                    PrescriptionDetails.objects.create(
                        prescription_id=prescription,
                        diagnosis_id=diagnosis,
                        patient_id=diagnosis.patient_id,
                        prescribed_by_doctor_id=diagnosis.visiting_doctor_id,
                        **prescription_detail
                    )
            
        return diagnosis
