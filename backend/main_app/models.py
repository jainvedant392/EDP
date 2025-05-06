from django.db import models
from django.utils import timezone
from django.contrib.postgres.fields import ArrayField

class BaseModel(models.Model):
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True


class Allotment(BaseModel):
    patient_id = models.ForeignKey('main_app.Patient', on_delete=models.PROTECT)
    ward_id = models.ForeignKey('main_app.Ward', on_delete=models.PROTECT, null=True, blank=True)
    room_id = models.ForeignKey('main_app.Room', on_delete=models.PROTECT, null=True, blank=True)
    bed_id = models.ForeignKey('main_app.Bed', on_delete=models.PROTECT, null=True, blank=True)
    admission_date = models.DateField(null=False)
    admission_time = models.TimeField(null=False)
    discharge_date = models.DateField(null=True, blank=True)
    discharge_notes = models.TextField(null=True, blank=True)
    
    def __str__(self) -> str:
        return f"""
        Allotment of patient {self.patient_id.name} to:
        ward {self.ward_id.ward_type if self.ward_id else 'N/A'}
        room {self.room_id.room_number if self.room_id else 'N/A'}
        bed {self.bed_id.bed_number if self.bed_id else 'N/A'}
        on {self.admission_date}"""


class Ward(models.Model):
    name = models.CharField(max_length=50)  # e.g., ICU, General, Maternity
    floor_number = models.IntegerField()
    ward_type = models.CharField(max_length=50, default="General")  # Added field for string representation

    def __str__(self):
        return f"{self.name} Ward - Floor {self.floor_number}"


class Room(models.Model):
    ROOM_TYPES = [
        ("Private", "Private"),
        ("Semi-Private", "Semi-Private"),
        ("Deluxe", "Deluxe"),
        ("General", "General")
    ]

    ward = models.ForeignKey(Ward, on_delete=models.CASCADE)
    room_number = models.IntegerField()
    room_type = models.CharField(max_length=20, choices=ROOM_TYPES)

    def __str__(self):
        return f"{self.room_type} Room {self.room_number} in {self.ward.name}"


class Bed(models.Model):
    room = models.ForeignKey(Room, on_delete=models.CASCADE)
    bed_number = models.IntegerField()
    is_occupied = models.BooleanField(default=False)

    def __str__(self):
        return f"Bed {self.bed_number} in {self.room}"


class Department(BaseModel):
    name = models.CharField(max_length=100)
    description = models.TextField(null=True, blank=True)
    head_doctor_id = models.ForeignKey('main_app.Doctor', on_delete=models.SET_NULL, null=True, blank=True)
    
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
        ('inactive', 'Inactive'),
    ]

    name = models.CharField(max_length=100)
    dob = models.DateField()
    age = models.IntegerField()
    gender = models.CharField(max_length=20, choices=GENDER_CHOICES, null=True, blank=True)
    medical_license_number = models.CharField(max_length=50)
    department_id = models.ForeignKey('main_app.Department', on_delete=models.SET_NULL, null=True, blank=True)
    working_hours = models.TextField()
    contact_number = models.CharField(max_length=15)
    email_id = models.EmailField()
    aadhar = models.CharField(max_length=12)
    address = models.TextField()
    qualifications = ArrayField(models.TextField(), default=list)
    specializations = ArrayField(models.TextField(), default=list)
    years_of_experience = models.IntegerField()
    profile_photo = models.ImageField(upload_to='images/', null=True, blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='active')

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
        ('inactive', 'Inactive'),
    ]

    name = models.CharField(max_length=100)
    dob = models.DateField()
    age = models.IntegerField()
    gender = models.CharField(max_length=20, choices=GENDER_CHOICES, null=True, blank=True)
    blood_group = models.CharField(max_length=5)
    contact_number = models.CharField(max_length=15)
    emergency_contact_number = models.CharField(max_length=15)
    address = models.TextField()
    aadhar = models.CharField(max_length=12)
    is_disabled = models.BooleanField(default=False)
    disabilities_or_diseases = ArrayField(models.CharField(max_length=50, null=True, blank=True), default=list, null=True, blank=True)
    allergies = ArrayField(models.CharField(max_length=50, null=True, blank=True), default=list, null=True, blank=True)
    medical_history = models.TextField(null=True, blank=True)
    profile_photo = models.ImageField(upload_to='images/', null=True, blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='active')

    def __str__(self) -> str:
        return f"Patient: {self.name}"


class MedicalTest(BaseModel):
    test_code = models.CharField(max_length=20, unique=True, primary_key=True)
    name = models.CharField(max_length=100)
    short_name = models.CharField(max_length=50)
    description = models.TextField()
    preconditions = models.TextField()
    test_category = models.CharField(max_length=20)
    test_subcategory = models.CharField(max_length=20)
    test_parameters = models.JSONField()
    sample_type = models.CharField(max_length=20)
    turnaround_time = models.IntegerField()
    reference_range_format = models.CharField(max_length=20)
    units = models.CharField(max_length=20)
    cost = models.DecimalField(max_digits=10, decimal_places=2)

    def __str__(self) -> str:
        return f"{self.short_name} Medical Test"


class Diagnosis(BaseModel):
    STATUS_CHOICES = [
        ('ongoing', 'Ongoing'),
        ('completed', 'Completed'),
        ('cancelled', 'Cancelled'),
    ]

    patient_id = models.ForeignKey('main_app.Patient', on_delete=models.PROTECT)
    visiting_doctor_id = models.ForeignKey('main_app.Doctor', on_delete=models.PROTECT)
    diagnosis_date = models.DateField(default=timezone.now)
    diagnosis_time = models.TimeField(default=timezone.now)  # Changed from 'default=None'
    blood_pressure = models.CharField(max_length=15, null=True, blank=True)  # Made nullable
    blood_sugar = models.CharField(max_length=15, null=True, blank=True)  # Made nullable
    SPo2 = models.CharField(max_length=10, null=True, blank=True)  # Changed from IntegerField to CharField, made nullable
    heart_rate = models.CharField(max_length=10, null=True, blank=True)  # Changed from IntegerField to CharField, made nullable
    diagnosis_summary = models.TextField(null=True, blank=True)  # Made nullable
    tests = ArrayField(models.CharField(max_length=100), default=list, null=True, blank=True)  # Increased max_length
    # uploadedTests = ArrayField(models.CharField(max_length=255), default=list, null=True, blank=True)  # Added for uploaded file names
    # additional_notes = models.TextField(null=True, blank=True)  # Added field
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='ongoing')

    def __str__(self) -> str:
        return f"Diagnosis for {self.patient_id.name} by Dr. {self.visiting_doctor_id.name} on {self.diagnosis_date}"


class TestPrescribed(BaseModel):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('completed', 'Completed'),
        ('cancelled', 'Cancelled'),
    ]

    test_code = models.ForeignKey('main_app.MedicalTest', on_delete=models.PROTECT)
    prescription_id = models.ForeignKey('main_app.Prescription', on_delete=models.PROTECT, null=True, blank=True)
    patient_id = models.ForeignKey('main_app.Patient', on_delete=models.PROTECT)
    ordering_doctor_id = models.ForeignKey('main_app.Doctor', on_delete=models.PROTECT)
    test_date = models.DateField()
    test_time = models.TimeField()
    test_results = models.TextField(null=True, blank=True)  # Made nullable
    test_result_files = models.FileField(upload_to='test_results/', null=True, blank=True)
    comments = models.TextField(null=True, blank=True)  # Made nullable
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')  # Changed default

    def __str__(self) -> str:
        return f"Test {self.test_code.short_name} prescribed to patient {self.patient_id.name} by Dr. {self.ordering_doctor_id.name}"


class Prescription(BaseModel):
    STATUS_CHOICES = [
        ('active', 'Active'),
        ('inactive', 'Inactive'),
    ]

    diagnosis_id = models.ForeignKey('main_app.Diagnosis', on_delete=models.PROTECT)
    patient_id = models.ForeignKey('main_app.Patient', on_delete=models.PROTECT)
    prescribed_by_doctor_id = models.ForeignKey('main_app.Doctor', on_delete=models.PROTECT)
    prescription_date = models.DateField(default=timezone.now)  # Added default
    additional_notes = models.TextField(null=True, blank=True)  # Made nullable
    status = models.CharField(max_length=15, choices=STATUS_CHOICES, default='active')  # Changed default to active

    def __str__(self) -> str:
        return f"Prescription for patient {self.patient_id.name} by Dr. {self.prescribed_by_doctor_id.name} on date {self.prescription_date}"


class PrescriptionDetails(BaseModel):
    prescription_id = models.ForeignKey('main_app.Prescription', on_delete=models.PROTECT)
    diagnosis_id = models.ForeignKey('main_app.Diagnosis', on_delete=models.PROTECT)
    patient_id = models.ForeignKey('main_app.Patient', on_delete=models.PROTECT)
    prescribed_by_doctor_id = models.ForeignKey('main_app.Doctor', on_delete=models.PROTECT)
    drug = models.CharField(max_length=100, null=True, blank=True)
    dosage = models.CharField(max_length=100, null=True, blank=True)
    method = models.CharField(max_length=100, null=True, blank=True)
    duration = models.CharField(max_length=100, null=True, blank=True)

    def __str__(self) -> str:
        return f"Prescription details for patient {self.patient_id.name} by Dr. {self.prescribed_by_doctor_id.name} for drug {self.drug}"