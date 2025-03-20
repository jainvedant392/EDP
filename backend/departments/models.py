from django.db import models
from doctors.models import Doctor

class Department(models.Model):
    # _id=models.AutoField(primary_key=True)
    name=models.CharField(max_length=100)
    description=models.TextField()
    head_doctor_id=models.ForeignKey(Doctor, on_delete=models.CASCADE)
