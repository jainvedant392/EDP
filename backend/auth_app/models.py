from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin, BaseUserManager
from django.db import models
from main_app.models import Patient 

class CustomUserManager(BaseUserManager):
    
    def create_user(self, password=None, **extra_fields):
        if not extra_fields.get('role'):
            raise ValueError("Role is required")
        if extra_fields['role'] != 'patient' and not extra_fields.get('email'):
            raise ValueError("Email is required for staff and doctor")
        user = self.model(**extra_fields)
        user.set_password(password)
        user.save()
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.update(is_staff=True, is_superuser=True, role='staff')
        return self.create_user(email=email, password=password, **extra_fields)

class CustomUser(AbstractBaseUser, PermissionsMixin):
    ROLE_CHOICES = [
        ('staff', 'Staff'),
        ('doctor', 'Doctor'),
        ('patient', 'Patient'),
    ]

    email = models.EmailField(unique=True, null=True, blank=True)
    aadhaar = models.CharField(max_length=12, unique=True, null=True, blank=True)
    role = models.CharField(max_length=10, choices=ROLE_CHOICES)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    patient = models.ForeignKey(Patient, on_delete=models.SET_NULL, null=True, blank=True)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []

    objects = CustomUserManager()

    def __str__(self):
        return f"{self.role.capitalize()} User"