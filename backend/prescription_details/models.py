from django.db import models

class PresciptionDetails(models.Model):
    prescription_id=models.ForeignKey('prescriptions.Prescription', on_delete=models.CASCADE)
    drug=models.CharField(max_length=100)
    dosage=models.CharField(max_length=100)
    frequency=models.CharField(max_length=100)
    duration=models.CharField(max_length=100)