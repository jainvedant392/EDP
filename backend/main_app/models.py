from django.db import models
from django.utils import timezone
from django.contrib.postgres.fields import ArrayField


class BaseModel(models.Model):
    created_at=models.DateTimeField(auto_now_add=True)
    updated_at=models.DateTimeField(auto_now=True)

    class Meta:
        abstract=True


class Allotment(BaseModel):
    patient_id=models.ForeignKey('main_app.Patient', on_delete=models.CASCADE)
    room_id=models.ForeignKey('main_app.Rooms', on_delete=models.CASCADE)
    doctor_incharge_id=models.ForeignKey('main_app.Doctor', on_delete=models.CASCADE) # why do we need incharge doctor at the time of allotment? i think we don't
    admission_date=models.DateField(null=False)
    admission_time=models.TimeField(null=False)
    discharge_date=models.DateField(null=True)
    discharge_notes=models.TextField(null=True)
    
    def __str__(self) -> str:
        return f"Allotment of {self.patient_id.name} by Dr. {self.doctor_incharge_id.name}"


class Rooms(BaseModel):
    ward_type=models.CharField(max_length=20, null=False) # general, semi-private, private
    floor_number=models.IntegerField(null=False)
    room_number=models.IntegerField(null=False)
    bed_number=models.IntegerField(null=False)
    is_admitted=models.BooleanField(default=True)

    def __str__(self) -> str:
        return f"Room: {self.room_number}, Bed: {self.bed_number}"


class Department(BaseModel):
    name=models.CharField(max_length=100)
    description=models.TextField(null=True, blank=True)
    head_doctor_id=models.ForeignKey('main_app.Doctor', on_delete=models.CASCADE, null=True, blank=True)
    
    def __str__(self) -> str:
        return f"Department: {self.name}"


class Doctor(BaseModel):
    GENDER_CHOICES = [
        ('male', 'Male'),
        ('female', 'Female'),
        ('other', 'Other'),
    ]

    STATUS_CHOICES = [
        ('active', 'Active'),
        ('on-leave', 'On-Leave'),
        ('retired', 'Retired'),
        ('inactive', 'Inactive'), # for soft-delete
    ]

    name=models.CharField(max_length=100)
    dob=models.DateField()
    age=models.IntegerField()
    gender=models.CharField(choices=GENDER_CHOICES, null=True, blank=True)
    medical_license_number=models.CharField(max_length=50)
    department_id=models.ForeignKey('main_app.Department', on_delete=models.CASCADE)
    working_hours=models.TextField()
    contact_number=models.CharField(max_length=15)
    email_id=models.EmailField()
    aadhar=models.CharField(max_length=12)
    address=models.TextField()
    qualifications=ArrayField(models.TextField())
    specializations=ArrayField(models.TextField())
    years_of_experience=models.IntegerField()
    profile_photo=models.ImageField(upload_to='images/', null=True, blank=True)
    status=models.CharField(choices=STATUS_CHOICES, default='active') # active, on-leave, retired, inactive(for soft-delete)

    def __str__(self) -> str:
        return f"Dr. {self.name}"


class Patient(BaseModel):
    GENDER_CHOICES = [
        ('male', 'Male'),
        ('female', 'Female'),
        ('other', 'Other'),
    ]

    STATUS_CHOICES = [
        ('active', 'Active'),
        ('deceased', 'Deceased'),
        ('discharged', 'Discharged'),
        ('inactive', 'Inactive'), # for soft-delete
    ]

    name=models.CharField(max_length=100)
    dob=models.DateField()
    age=models.IntegerField()
    gender=models.CharField(choices=GENDER_CHOICES, null=True, blank=True)
    blood_group=models.CharField(max_length=5)
    contact_number=models.CharField(max_length=15)
    emergency_contact_number=models.CharField(max_length=15)
    address=models.TextField()
    aadhar=models.CharField(max_length=12)
    is_disabled=models.BooleanField()
    disabilities_or_diseases=ArrayField(models.CharField(max_length=50, null=True))
    allergies=ArrayField(models.CharField(max_length=50, null=True))
    medical_history=models.TextField(null=True, blank=True)
    profile_photo=models.ImageField(upload_to='images/', null=True, blank=True)
    status=models.CharField(choices=STATUS_CHOICES, default='active') # active, deceased, discharged, inactive(for soft-delete)

    def __str__(self) -> str:
        return f"Patient: {self.name}"


class MedicalTest(BaseModel):
    test_code=models.CharField(max_length=20, unique=True, primary_key=True)
    name=models.CharField(max_length=100)
    short_name=models.CharField(max_length=50)
    description=models.TextField()
    preconditions=models.TextField()
    test_category=models.CharField(max_length=20) #e.g., Blood Tests, Radiology, Pathology, Cardiology, Neurology
    test_subcategory=models.CharField(max_length=20) #e.g., Complete Blood Count, X-ray, Biopsy, ECG, EEG
    test_parameters=models.JSONField() # test parameters with key value pairs of parameter name and reference range. e.g., {"Hemoglobin": "12-16 g/dL", "WBC": "4000-11000 cells/mcL"}
    sample_type=models.CharField(max_length=20) #e.g. Blood, Urine, Tissue, Swab
    turnaround_time=models.IntegerField() # in hours
    reference_range_format=models.CharField(max_length=20) #e.g. numerical range, positive/negative
    units=models.CharField(max_length=20)
    cost=models.DecimalField(max_digits=10, decimal_places=2)

    def __str__(self) -> str:
        return f"{self.short_name} Medical Test"


class Diagnosis(BaseModel):
    STATUS_CHOICES = [
        ('ongoing', 'Ongoing'),
        ('completed', 'Completed'),
        ('cancelled', 'Cancelled'),
    ]

    patient_id=models.ForeignKey('main_app.Patient', on_delete=models.CASCADE, default=None)
    visiting_doctor_id=models.ForeignKey('main_app.Doctor', on_delete=models.CASCADE, default=None)
    diagnosis_date=models.DateField(default=timezone.now)
    diagnosis_time=models.TimeField(default=None)
    blood_pressure=models.CharField(max_length=15)
    blood_sugar=models.CharField(max_length=15)
    SPo2=models.IntegerField()
    heart_rate=models.IntegerField()
    diagnosis_summary=models.TextField()
    tests=ArrayField(models.CharField(max_length=20), default=list)
    status=models.CharField(max_length=10, choices=STATUS_CHOICES, default='ongoing')


class TestPrescribed(BaseModel):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('completed', 'Completed'),
        ('cancelled', 'Cancelled'),
    ]

    test_code=models.ForeignKey('main_app.MedicalTest', on_delete=models.CASCADE)
    diagnosis_id=models.ForeignKey('main_app.Diagnosis', on_delete=models.CASCADE, related_name='tests_prescribed')
    patient_id=models.ForeignKey('main_app.Patient', on_delete=models.CASCADE, default=None)
    ordering_doctor_id=models.ForeignKey('main_app.Doctor', on_delete=models.CASCADE)
    test_date=models.DateField()
    test_time=models.TimeField()
    test_results=models.TextField()
    test_result_files=models.FileField(upload_to='test_results/', null=True, blank=True)
    comments=models.TextField()
    status=models.CharField(max_length=20, choices=STATUS_CHOICES, default='active') # pending, completed, cancelled

    def __str__(self) -> str:
        return f"Test {self.test_code.short_name} prescribed to patient {self.patient_id.name} by Dr. {self.ordering_doctor_id.name}" # pylint: disable=no-member


class Prescription(BaseModel):
    STATUS_CHOICES = [
        ('active', 'Active'),
        ('inactive', 'Inactive'),
    ]

    diagnosis_id=models.ForeignKey('main_app.Diagnosis', on_delete=models.CASCADE)
    patient_id=models.ForeignKey('main_app.Patient', on_delete=models.CASCADE)
    prescribed_by_doctor_id=models.ForeignKey('main_app.Doctor', on_delete=models.CASCADE)
    prescription_date=models.DateField()
    # prescription_details=models.FileField(upload_to='prescription_details/', null=True, blank=True)
    additional_notes=models.TextField()
    status=models.CharField(max_length=15, default='inactive') # active, inactive

    def __str__(self) -> str:
        return f"Prescription for patient {self.patient_id.name} by Dr. {self.prescribed_by_doctor_id.name} on date {self.prescription_date}"


class PresciptionDetails(BaseModel):
    prescription_id=models.ForeignKey('main_app.Prescription', on_delete=models.CASCADE)
    diagnosis_id=models.ForeignKey('main_app.Diagnosis', on_delete=models.CASCADE)
    patient_id=models.ForeignKey('main_app.Patient', on_delete=models.CASCADE)
    prescribed_by_doctor_id=models.ForeignKey('main_app.Doctor', on_delete=models.CASCADE)
    drug=models.CharField(max_length=100)
    dosage=models.CharField(max_length=100)
    frequency=models.CharField(max_length=100)
    duration=models.CharField(max_length=100)

    def __str__(self) -> str:
        return f"Prescription details for patient {self.patient_id.name} by Dr. {self.prescribed_by_doctor_id.name} for drug {self.drug}"

