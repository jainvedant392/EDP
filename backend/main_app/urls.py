# from django.urls import path, include
# from .views import *

# urlpatterns = [
#     path('departments/', get_create_departments, name='get_create_departments'),
#     path('departments/<int:department_id>/', get_update_delete_department, name='get_update_delete_department'),
#     path('departments/<int:department_id>/doctors/', get_doctors_in_department, name='get_doctors_in_department'),
#     path('doctors/', get_create_doctors, name='get_create_doctors'),
#     path('doctors/<int:doctor_id>/', get_update_delete_doctor, name='get_update_delete_doctor'),
#     path('doctors/<int:doctor_id>/diagnoses/', get_diagnoses_for_doctor, name='get_diagnoses_for_doctor'),
#     path('patients/', get_create_patients, name='get_create_patients'),
#     path('patients/<int:patient_id>/', get_update_delete_patient, name='get_update_delete_patient'),
#     path('patients/<int:patient_id>/diagnoses/', get_diagnoses_for_patient, name='get_diagnoses_for_patient'),
#     path('patients/<int:patient_id>/diagnoses/<int:diagnosis_id>/', get_diagnosis_for_patient, name='get_diagnosis_for_patient'),
#     path('medical-tests/', get_create_medical_tests, name='get_create_medical_tests'),
#     path('medical-tests/<int:medical_test_id>/', get_update_delete_medical_test, name='get_update_delete_medical_test'),
#     path('room-beds/', get_all_room_bed_details, name='get_all_room_bed_details'),
#     path('room-beds/<int:room_bed_id>/', get_room_bed_details, name='get_room_bed_details'),
#     path('room-beds/create/', create_bed_and_room, name='create_bed_and_room'),
#     path('allotments/', get_all_allotments, name='get_all_allotments'),
#     path('allotments/<int:patient_id>/', get_patient_allotment, name='get_patient_allotment'),
#     path('allotments/create/', create_allotment, name='create_allotment'),
#     path('allotments/<int:allotment_id>/', delete_allotment, name='delete_allotment'),
# ]


from django.urls import path
from .views import (
    # Departments
    get_create_departments, get_update_delete_department, get_doctors_in_department,
    
    # Doctors
    get_create_doctors, get_update_delete_doctor, get_diagnoses_for_doctor,
    
    # Patients
    get_create_patients, get_update_delete_patient, get_diagnoses_for_patient, get_diagnosis_for_patient,
    
    # Medical Tests
    get_create_medical_tests, get_update_delete_medical_test,
    
    # Rooms & Beds
    get_all_room_bed_details, get_room_bed_details, create_bed_and_room,
    
    # Allotments
    get_all_allotments, get_patient_allotment, create_allotment, delete_allotment
)

urlpatterns = [
    # Departments
    path('departments/', get_create_departments, name='get_create_departments'),
    path('departments/<int:department_id>/', get_update_delete_department, name='get_update_delete_department'),
    path('departments/<int:department_id>/doctors/', get_doctors_in_department, name='get_doctors_in_department'),

    # Doctors
    path('doctors/', get_create_doctors, name='get_create_doctors'),
    path('doctors/<int:doctor_id>/', get_update_delete_doctor, name='get_update_delete_doctor'),
    path('doctors/<int:doctor_id>/diagnoses/', get_diagnoses_for_doctor, name='get_diagnoses_for_doctor'),

    # Patients
    path('patients/', get_create_patients, name='get_create_patients'),
    path('patients/<int:patient_id>/', get_update_delete_patient, name='get_update_delete_patient'),
    path('patients/<int:patient_id>/diagnoses/', get_diagnoses_for_patient, name='get_diagnoses_for_patient'),
    path('patients/<int:patient_id>/diagnoses/<int:diagnosis_id>/', get_diagnosis_for_patient, name='get_diagnosis_for_patient'),

    # Medical Tests
    path('medical-tests/', get_create_medical_tests, name='get_create_medical_tests'),
    path('medical-tests/<int:medical_test_id>/', get_update_delete_medical_test, name='get_update_delete_medical_test'),

    # Room & Bed Management
    path('room-beds/', get_all_room_bed_details, name='get_all_room_bed_details'),
    path('room-beds/<int:room_bed_id>/', get_room_bed_details, name='get_room_bed_details'),
    path('room-beds/create/', create_bed_and_room, name='create_bed_and_room'),

    # Allotments
    path('allotments/', get_all_allotments, name='get_all_allotments'),
    path('allotments/<int:patient_id>/', get_patient_allotment, name='get_patient_allotment'),
    path('allotments/create/', create_allotment, name='create_allotment'),
    path('allotments/<int:allotment_id>/', delete_allotment, name='delete_allotment'),
]
