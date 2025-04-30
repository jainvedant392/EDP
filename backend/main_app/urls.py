from django.urls import path
from .views import (
    # Departments
    get_create_departments, get_update_delete_department, get_doctors_in_department,
    
    # Doctors
    get_create_doctors, get_update_delete_doctor, get_diagnoses_for_doctor,
    create_update_diagnosis,
    create_prescription,
    create_update_prescription_detials,
    create_update_tests_prescribed,
    
    # Patients
    get_create_patients, get_update_delete_patient, get_diagnoses_for_patient, get_diagnosis_for_patient,
    
    # Medical Tests
    get_create_medical_tests, get_update_delete_medical_test,
    
    # Rooms & Beds
    # get_all_room_bed_details, get_room_bed_details,
    get_wards, create_ward, get_rooms, create_room, get_beds, create_beds, update_bed,
    
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
    path('doctors/<int:doctor_id>/diagnoses/<int:patient_id>/', create_update_diagnosis, name='create_diagnosis'),
    path('doctors/<int:doctor_id>/diagnoses/<int:patient_id>/<int:diagnosis_id>/', create_update_diagnosis, name='update_diagnosis'),
    path('doctors/<doctor_id>/prescriptions/<patient_id>/',create_prescription, name='create_prescription'),
    path('doctors/<doctor_id>/prescriptions/<patient_id>/',create_update_prescription_detials, name='create_prescription'),
    path('doctors/<doctor_id>/prescriptions/<patient_id>/<prescription_id>/', create_update_prescription_detials, name='update_prescription'),
    path('doctors/<doctor_id>/tests/<patient_id>/', create_update_tests_prescribed, name='create_tests_prescribed'),
    path('doctors/<doctor_id>/tests/<patient_id>/<test_prescribed_id>/', create_update_tests_prescribed, name='update_tests_prescribed'),

    # Patients
    path('patients/', get_create_patients, name='get_create_patients'),
    path('patients/<int:patient_id>/', get_update_delete_patient, name='get_update_delete_patient'),
    path('patients/<int:patient_id>/diagnoses/', get_diagnoses_for_patient, name='get_diagnoses_for_patient'),
    path('patients/<int:patient_id>/diagnoses/<int:diagnosis_id>/', get_diagnosis_for_patient, name='get_diagnosis_for_patient'),

    # Medical Tests
    path('medical-tests/', get_create_medical_tests, name='get_create_medical_tests'),
    path('medical-tests/<int:medical_test_id>/', get_update_delete_medical_test, name='get_update_delete_medical_test'),

    # Ward, Room & Bed Management
    path('wards/', get_wards, name='get_wards'),
    path('wards/create/', create_ward, name='create_ward'),
    # path('room-beds/', get_all_room_bed_details, name='get_all_room_bed_details'),
    # path('room-beds/<int:bed_id>/', get_room_bed_details, name='get_room_bed_details'),
    path('rooms/', get_rooms, name='get_rooms'),
    path('rooms/create/', create_room, name='create_room'),
    path('beds/', get_beds, name='get_beds'),
    path('beds/create/', create_beds, name='create_bed'),
    path('beds/<int:bed_id>/', update_bed, name='update_bed'),

    # Allotments
    path('allotments/', get_all_allotments, name='get_all_allotments'),
    path('allotments/<int:patient_id>/', get_patient_allotment, name='get_patient_allotment'),
    path('allotments/create/', create_allotment, name='create_allotment'),
    path('allotments/<int:allotment_id>/', delete_allotment, name='delete_allotment'),
]
