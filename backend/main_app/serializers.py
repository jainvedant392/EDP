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
        fields = '__all__'


class PrescriptionSerializer(serializers.ModelSerializer):
    prescription_details = PrescriptionDetailsSerializer(many=True, required=False)
    tests_prescribed = TestPrescribedSerializer(many=True, required=False)

    class Meta:
        model = Prescription

    def create(self, validated_data):
        prescription_details_data = validated_data.pop('prescription_details', [])
        tests_prescribed_data = validated_data.pop('tests_prescribed', [])

        prescription = Prescription.objects.create(**validated_data)

        for detail in prescription_details_data:
            PrescriptionDetails.objects.create(prescription_id=prescription, diagnosis_id=prescription.diagnosis_id, patient_id=prescription.patient_id, prescribed_by_doctor_id=prescription.prescribed_by_doctor_id, **detail)

        for test in tests_prescribed_data:
            TestPrescribed.objects.create(prescription_id=prescription, patient_id=prescription.patient_id, ordering_doctor_id=prescription.prescribed_by_doctor_id, **test)

        return prescription


class DiagnosisFullCreateSerializer(serializers.ModelSerializer):
    prescription = PrescriptionSerializer(required=False)

    class Meta:
        model = Diagnosis
        exclude = ['id', 'created_at', 'updated_at']

    def create(self, validated_data):
        prescription_data = validated_data.pop('prescription', None)

        with transaction.atomic():
            diagnosis = Diagnosis.objects.create(**validated_data)

            if prescription_data:
                # Inject diagnosis info
                prescription_data['diagnosis_id'] = diagnosis.id
                prescription_data['patient_id'] = diagnosis.patient_id.id
                prescription_data['prescribed_by_doctor_id'] = diagnosis.visiting_doctor_id.id

                prescription_serializer = PrescriptionSerializer(data=prescription_data)
                prescription_serializer.is_valid(raise_exception=True)
                prescription_serializer.save()

        return diagnosis
