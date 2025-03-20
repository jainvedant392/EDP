from django.db import models

class Prescription(models.Model):
    diagnosis_id=models.ForeignKey('diagnosis.Diagnosis', on_delete=models.CASCADE)
    prescribed_by_doctor_id=models.ForeignKey('doctors.Doctor', on_delete=models.CASCADE)
    prescription_date=models.DateField()
    additional_notes=models.TextField()