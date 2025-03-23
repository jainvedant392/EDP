from django.db import models

class Allotment(models.Model):
    patient_id=models.ForeignKey('patients.Patient', on_delete=models.CASCADE)
    # ward=models.CharField(max_length=10)
    room_id=models.ForeignKey('allotments.Rooms', on_delete=models.CASCADE)
    doctor_incharge_id=models.ForeignKey('doctors.Doctor', on_delete=models.CASCADE)
    admission_date=models.DateField()
    admission_time=models.TimeField()
    discharge_date=models.DateField()
    discharge_notes=models.TextField()
    
    def __str__(self) -> str:
        return f"Allotment of {self.patient_id.name} by Dr. {self.doctor_incharge_id.name}"

class Rooms(models.Model):
    # ward=models.CharField(max_length=10)
    ward_type=models.CharField(max_length=20) # general, semi-private, private
    floor_number=models.IntegerField()
    room_number=models.IntegerField()
    bed_number=models.IntegerField()
    is_admitted=models.BooleanField()
