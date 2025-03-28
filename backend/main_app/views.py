from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import status

from django.shortcuts import get_object_or_404
from django.db.models import Prefetch
from django.http import JsonResponse

from .models import *
from .serializers import *


######################################################### DEPARTMENT VIEWS ####################################################################
# List all departments / Create new department(s)
# /api/departments/
@api_view(['GET'])
def get_create_departments(request):
    """
    GET: List all departments
    POST: Create new department(s)
    """
    if (request.method == 'GET'):
        departments = Department.objects.all()
        serializer = DepartmentSerializer(departments, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    elif (request.method == 'POST'):
            if isinstance(request.data, list):
                serializer = DepartmentSerializer(data=request.data, many=True)
            else:
                serializer = DepartmentSerializer(data=request.data)

            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_201_CREATED)

            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# Retrieve / Update / Delete a department
# /api/departments/<department_id>/
@api_view(['GET', 'PUT', 'PATCH', 'DELETE'])
def get_update_delete_department(request, department_id):
    """
    GET: Retrieve a department
    PUT: Update a department
    PATCH: Partially update a department
    DELETE: Delete a department
    """
    department = get_object_or_404(Department, id=department_id)

    if (request.method == 'GET'):
        serializer = DepartmentSerializer(department)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    elif (request.method in ['PUT', 'PATCH']):
        serializer = DepartmentSerializer(department, data=request.data, partial=(request.method == 'PATCH'))
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    elif (request.method == 'DELETE'):
        department.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
    

# List all doctors in a department
# /api/departments/<department_id>/doctors/
@api_view(['GET'])
def get_doctors_in_department(request, department_id):
    """
    GET: List all doctors in a department
    """
    doctors = Doctor.objects.filter(department_id=department_id)
    serializer = DoctorSerializer(doctors, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)


######################################################### DOCTOR VIEWS #######################################################################
# List all doctors / Create new doctor(s)
# /api/doctors/
@api_view(['GET', 'POST'])
def get_create_doctors(request):
    """
    GET: List all doctors
    POST: Create new doctor(s)
    """
    if (request.method == 'GET'):
        doctors = Doctor.objects.all()
        serializer = DoctorSerializer(doctors, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    elif (request.method == 'POST'):
        if isinstance(request.data, list):
            serializer = DoctorSerializer(data=request.data, many=True)
        else:
            serializer = DoctorSerializer(data=request.data)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# Retrieve / Update / Delete a doctor
# /api/doctors/<doctor_id>/
@api_view(['GET', 'PUT', 'PATCH', 'DELETE'])
def get_update_delete_doctor(request, doctor_id):
    """
    GET: Retrieve a doctor
    PUT: Update a doctor
    PATCH: Partially update a doctor
    DELETE: Delete a doctor
    """
    doctor = get_object_or_404(Doctor, id=doctor_id)

    if (request.method == 'GET'):
        serializer = DoctorSerializer(doctor)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    elif (request.method in ['PUT', 'PATCH']):
        serializer = DoctorSerializer(doctor, data=request.data, partial=(request.method == 'PATCH'))
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    elif (request.method == 'DELETE'):
        doctor.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
    

# List all diagnoses for a doctor with filter options according to status - ongoing, completed, cancelled
# /api/doctors/<doctor_id>/diagnoses/
@api_view(['GET'])
def get_diagnoses_for_doctor(request, doctor_id):
    """
    GET: List all diagnoses for a doctor
    """
    diagnoses = Diagnosis.objects.filter(visiting_doctor_id=doctor_id)
    serializer = DiagnosisSerializer(diagnoses, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)

# TO BE CONTINUED...



######################################################### PATIENT VIEWS ######################################################################
# List all patients / Create new patient(s)
# /api/patients/
@api_view(['GET', 'POST'])
def get_create_patients(request):
    """
    GET: List all patients
    POST: Create new patient(s)
    """
    if (request.method == 'GET'):
        patients = Patient.objects.filter(status='active')
        serializer = PatientSerializer(patients, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    elif (request.method == 'POST'):
        if isinstance(request.data, list):
            serializer = PatientSerializer(data=request.data, many=True)
        else:
            serializer = PatientSerializer(data=request.data)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    

# Retrieve / Update / Delete a patient (soft delete by marking status as inactive)
# /api/patients/<patient_id>/
@api_view(['GET', 'PUT', 'PATCH', 'DELETE'])
def get_update_delete_patient(request, patient_id):
    """
    GET: Retrieve a patient
    PUT: Update a patient
    PATCH: Partially update a patient
    DELETE: Delete a patient (soft delete by marking status as inactive)
    """
    patient = get_object_or_404(Patient, id=patient_id)

    if (request.method == 'GET'):
        serializer = PatientSerializer(patient)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    elif (request.method in ['PUT', 'PATCH']):
        serializer = PatientSerializer(patient, data=request.data, partial=(request.method == 'PATCH'))
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    elif (request.method == 'DELETE'):
        patient.status = 'inactive'
        patient.save()
        return Response(status=status.HTTP_204_NO_CONTENT)
    

# List all diagnoses for a patient
# /api/patients/<patient_id>/diagnoses/
@api_view(['GET'])
def get_diagnoses_for_patient(request, patient_id):
    """
    GET: List all diagnoses for a patient
    """
    diagnoses = Diagnosis.objects.filter(patient_id=patient_id)
    serializer = DiagnosisSerializer(diagnoses, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)


# Retrieve a specific diagnosis with complete details for a patient
# /api/patients/<patient_id>/diagnoses/<diagnosis_id>/
@api_view(['GET'])
def get_diagnosis_for_patient(request, patient_id, diagnosis_id):
    """
    GET: Retrieve a specific diagnosis info for a patient with complete details,
    including prescriptions, associated prescription details and medical tests prescribed.
    """
    get_object_or_404(Patient, id=patient_id) # ensure that the patient exists
    diagnosis = get_object_or_404(Diagnosis, id=diagnosis_id, patient_id=patient_id) # ensure that the diagnosis exists
    prescriptions = Prescription.objects.filter(diagnosis_id=diagnosis_id, patient_id=patient_id)
    prescription_details = PresciptionDetails.objects.filter(prescription_id__in=prescriptions)

    prescriptions_data = []
    for presc in prescriptions:
        related_details = prescription_details.filter(prescription_id=presc.id) # type: ignore
        prescriptions_data.append({
            "id": presc.id, # type: ignore
            "prescription_date": str(presc.prescription_date),
            "doctor": presc.prescribed_by_doctor_id.name,
            "notes": presc.additional_notes,
            "status": presc.status,
            "details": [
                {
                    "id": detail.id, # type: ignore
                    "drug": detail.drug,
                    "dosage": detail.dosage,
                    "frequency": detail.frequency,
                    "duration": detail.duration
                } for detail in related_details
            ]
        })

    tests_prescribed = TestPrescribed.objects.filter(diagnosis_id=diagnosis_id, patient_id=patient_id)

    data = {
        "diagnosis_data": {
            "id": diagnosis.id, #type: ignore
            "date": str(diagnosis.diagnosis_date),
            "time": str(diagnosis.diagnosis_time),
            "blood_pressure": diagnosis.blood_pressure,
            "blood_sugar": diagnosis.blood_sugar,
            "SPo2": diagnosis.SPo2,
            "heart_rate": diagnosis.heart_rate,
            "diagnosis_summary": diagnosis.diagnosis_summary,
            "tests": diagnosis.tests,
        },
        "prescriptions": prescriptions_data,
        "tests_prescribed": tests_prescribed,
    }

    return JsonResponse({"data": data}, status=status.HTTP_200_OK, safe=False)



############################################################## MEDICAL TEST VIEWS ##############################################################
# List all medical tests / Create new medical test(s)
# /api/medical-tests/
@api_view(['GET', 'POST'])
def get_create_medical_tests(request):
    """
    GET: List all medical tests
    POST: Create new medical test(s)
    """
    if (request.method == 'GET'):
        medical_tests = MedicalTest.objects.all()
        serializer = MedicalTestSerializer(medical_tests, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    elif (request.method == 'POST'):
        if isinstance(request.data, list):
            serializer = MedicalTestSerializer(data=request.data, many=True)
        else:
            serializer = MedicalTestSerializer(data=request.data)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    

# Retrieve / Update / Delete a medical test
# /api/medical-tests/<medical_test_id>/
@api_view(['GET', 'PUT', 'PATCH', 'DELETE'])
def get_update_delete_medical_test(request, medical_test_id):
    """
    GET: Retrieve a medical test
    PUT: Update a medical test
    PATCH: Partially update a medical test
    DELETE: Delete a medical test
    """
    medical_test = get_object_or_404(MedicalTest, id=medical_test_id)

    if (request.method == 'GET'):
        serializer = MedicalTestSerializer(medical_test)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    elif (request.method in ['PUT', 'PATCH']):
        serializer = MedicalTestSerializer(medical_test, data=request.data, partial=(request.method == 'PATCH'))
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    elif (request.method == 'DELETE'):
        medical_test.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


#######################################################################