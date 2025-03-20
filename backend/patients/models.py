from django.db import models

class Patient(models.Model):
    name=models.CharField(max_length=100)
    dob=models.DateField()
    age=models.IntegerField()
    gender=models.CharField(max_length=10) # male, female, others
    blood_group=models.CharField(max_length=5)
    contact_number=models.CharField(max_length=15)
    emergency_contact_number=models.CharField(max_length=15)
    address=models.TextField()
    aadhar=models.CharField(max_length=12)
    is_disabled=models.BooleanField()
    disabilities=models.TextField() # comma separated values
    allergies=models.TextField() # comma separated values
    medical_history=models.TextField()
    profile_photo=models.ImageField(upload_to='images/')
    status=models.CharField(max_length=20) # active, deceased, discharged
