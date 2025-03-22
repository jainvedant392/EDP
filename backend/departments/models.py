from django.db import models

class Department(models.Model):
    # _id=models.AutoField(primary_key=True)
    name=models.CharField(max_length=100)
    description=models.TextField()
    head_doctor_id=models.ForeignKey('doctors.Doctor', on_delete=models.CASCADE)
    
    def __str__(self) -> str:
        return f"Department: {self.name}"
