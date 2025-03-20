from django.db import models
from medical_tests.models import MedicalTest
from diagnosis.models import Diagnosis
from patients.models import Patient
from doctors.models import Doctor

# table for storing tests prescribed by doctors to patient(s)
class TestPrescribed(models.Model):
    # _id=models.AutoField(primary_key=True)
    test_code=models.ForeignKey(MedicalTest, on_delete=models.CASCADE, to_field='test_code')
    diagnosis_id=models.ForeignKey(Diagnosis, on_delete=models.CASCADE)
    patient_id=models.ForeignKey(Patient, on_delete=models.CASCADE, default=None)
    ordering_doctor_id=models.ForeignKey(Doctor, on_delete=models.CASCADE)
    test_date=models.DateField()
    test_time=models.TimeField()
    results=models.TextField()
    result_files=models.FileField(upload_to='test_results/', null=True, blank=True)
    comments=models.TextField()
    status=models.CharField(max_length=20) # pending, completed, cancelled
