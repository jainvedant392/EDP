from django.db import models
from django.utils import timezone

class Diagnosis(models.Model):
    # _id=models.AutoField(primary_key=True)
    patient_id=models.ForeignKey('patients.Patient', on_delete=models.CASCADE, default=None)
    visiting_doctor_id=models.ForeignKey('doctors.Doctor', on_delete=models.CASCADE, default=None)
    diagnosis_date=models.DateField(default=timezone.now)
    diagnosis_time=models.TimeField(default=None)
