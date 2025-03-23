from django.db import models
from django.utils import timezone
from django.contrib.postgres.fields import ArrayField

class Diagnosis(models.Model):
    STATUS_CHOICES = [
        ('ongoing', 'Ongoing'),
        ('completed', 'Completed'),
        ('cancelled', 'Cancelled'),
    ]

    patient_id=models.ForeignKey('patients.Patient', on_delete=models.CASCADE, default=None)
    visiting_doctor_id=models.ForeignKey('doctors.Doctor', on_delete=models.CASCADE, default=None)
    diagnosis_date=models.DateField(default=timezone.now)
    diagnosis_time=models.TimeField(default=None)
    blood_pressure=models.CharField(max_length=15)
    SPo2=models.IntegerField()
    heart_rate=models.IntegerField()
    diagnosis_summary=models.TextField()
    tests=ArrayField(models.CharField(max_length=20), default=list)
    status=models.CharField(max_length=10, choices=STATUS_CHOICES, default='ongoing')
