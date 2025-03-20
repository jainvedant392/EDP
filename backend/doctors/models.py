from django.db import models
# from departments.models import Department

class Doctor(models.Model):
    # _id=models.AutoField(primary_key=True)
    name=models.CharField(max_length=100)
    dob=models.DateField()
    age=models.IntegerField()
    gender=models.CharField(max_length=10) # male, female, others
    medical_license_number=models.CharField(max_length=50)
    department_id=models.ForeignKey('departments.Department', on_delete=models.CASCADE)
    working_hours=models.TextField()
    contact_number=models.CharField(max_length=15)
    email_id=models.EmailField()
    aadhar=models.CharField(max_length=12)
    address=models.TextField()
    qualifications=models.TextField() # comma separated values
    specializations=models.TextField() # comma separated values
    years_of_experience=models.IntegerField()
    profile_photo=models.ImageField(upload_to='images/')
    status=models.CharField(max_length=20) # active, on-leave, retired
