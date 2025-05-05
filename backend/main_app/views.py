from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework import status

from django.shortcuts import get_object_or_404
from django.db.models import Prefetch
from django.http import JsonResponse
from django.db import transaction

from rest_framework.permissions import IsAuthenticated
from .permissions import IsAdminUser, IsDoctorUser, IsPatientUser, IsStaffUser

from .models import *
from .serializers import *


######################################################### DEPARTMENT VIEWS ####################################################################
# List all departments / Create new department(s)
# /api/departments/
@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated, IsAdminUser])  # Only Admin can access this
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
@permission_classes([IsAuthenticated, IsAdminUser])  # Only Admin can access this
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
@permission_classes([IsAuthenticated])  # Any authenticated user can access this
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
@permission_classes([IsAuthenticated, IsAdminUser])  # Only Admin can create doctors
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
@permission_classes([IsAuthenticated, IsDoctorUser])  # Only doctors can create doctors
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
    

# List all diagnosis for a doctor with filter options according to status - ongoing, completed, cancelled
# /api/doctors/<doctor_id>/diagnosis/
# @api_view(['GET'])
# @permission_classes([IsAuthenticated, IsDoctorUser])   # Only Doctors can access this
# def get_diagnoses_for_doctor(request, doctor_id):
#     """
#     GET: List all diagnosis for a doctor
#     """
#     diagnosis = Diagnosis.objects.filter(visiting_doctor_id=doctor_id)
#     serializer = DiagnosisSerializer(diagnosis, many=True)
#     return Response(serializer.data, status=status.HTTP_200_OK)
    

# Create/update diagnosis for a patient
# Update /api/doctors/<doctor_id>/diagnosis/<patient_id>/<diagnosis_id>/
# Create /api/doctors/<doctor_id>/diagnosis/<patient_id>/
@api_view(['POST', 'PATCH'])
@permission_classes([IsAuthenticated, IsDoctorUser])   # Only Doctors can access this
def create_update_diagnosis(request, doctor_id, patient_id, diagnosis_id=None):
    """
    POST: Create new diagnosis
    PATCH: Update an existing diagnosis
    """
    if request.method == 'POST':
        serializer = DiagnosisSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    elif request.method == 'PATCH':
        diagnosis = get_object_or_404(Diagnosis, id=diagnosis_id, patient_id=patient_id)
        serializer = DiagnosisSerializer(diagnosis, data=request.data, partial=True)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


#create/update prescription detials for a patient
#create /api/doctors/<doctor_id>/prescriptions/<patient_id>/
#update /api/doctors/<doctor_id>/prescriptions/<patient_id>/<prescription_id>/
@api_view(['POST', 'PUT', 'PATCH'])
@permission_classes([IsAuthenticated, IsDoctorUser])   # Only Doctors can access this
def create_update_prescription_detials(request, prescription_id=None):
    """
    POST: Create new prescription details
    PUT: Update an existing prescription detail
    PATCH: Partially update an existing prescription detail
    """

    if(request.method == 'POST'):
        serializer = PrescriptionDetailsSerializer(data=request.data, many=(isinstance(request.data, list)))

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    elif (request.method in ['PUT', 'PATCH']):
        presciption_details=get_object_or_404(PrescriptionDetails, id=prescription_id)
        serializer = PrescriptionDetailsSerializer(presciption_details, data=request.data, partial=(request.method == 'PATCH'))

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    

# Create/Update medical test prescribed for a patient
# /api/diagnoses/<diagnosis_id>/tests/<patient_id>/
# /api/diagnoses/<diagnosis_id>/tests/<patient_id>/<test_prescribed_id>/
@api_view(['POST', 'PUT', 'PATCH'])
@permission_classes([IsAuthenticated, IsDoctorUser, IsStaffUser])   # Only Doctors and Admin can access this
def create_update_tests_prescribed(request, diagnosis_id=None, test_prescribed_id=None):
    """
    POST: Create new test(s) for a diagnosis
    PUT/PATCH: Update a specific test
    """

    if request.method == 'POST':
        is_bulk = isinstance(request.data, list)
        serializer = TestPrescribedSerializer(
            data=request.data,
            many=is_bulk,
            context={'diagnosis_id': diagnosis_id}
        )

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    elif request.method in ['PUT', 'PATCH']:
        test = get_object_or_404(TestPrescribed, id=test_prescribed_id)
        serializer = TestPrescribedSerializer(
            test,
            data=request.data,
            partial=(request.method == 'PATCH')
        )

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
            
# TO BE CONTINUED...
# YAHAN PE BAAKI KE VIEWS BANENGE RELATED TO DIAGNOSIS, PRESCRIPTIONS, PRESC_DETAILS, SINCE WOH DOCTOR CREATE KAREGA, ROUTE DECIDE KAR LENA.
# AND ALSO TESTS RELATED VIEWS KAHAN BANENGE WOH DEKHNA HOGA.


######################################################### PATIENT VIEWS ######################################################################
# List all patients / Create new patient(s)
# /api/patients/
@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated, IsStaffUser])   # Only Staff can access this
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
@permission_classes([IsAuthenticated, IsDoctorUser])   # Only doctor can access this
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
    

# List all diagnosis for a patient
# /api/patients/<patient_id>/diagnosis/
# @api_view(['GET'])
# @permission_classes([IsAuthenticated])   # All authenticated users can access this
# def get_diagnoses_for_patient(request, patient_id):
#     """
#     GET: List all diagnosis for a patient
#     """
#     diagnosis = Diagnosis.objects.filter(patient_id=patient_id)
#     serializer = DiagnosisSerializer(diagnosis, many=True)
#     return Response(serializer.data, status=status.HTTP_200_OK)


# Retrieve a specific diagnosis with complete details for a patient
# /api/patients/<patient_id>/diagnosis/<diagnosis_id>/
@api_view(['GET'])
@permission_classes([IsAuthenticated])   # All authenticated users can access this
def get_diagnosis_for_patient(request, patient_id, diagnosis_id):
    """
    GET: Retrieve a specific diagnosis info for a patient with complete details,
    including prescriptions, associated prescription details and medical tests prescribed.
    """
    get_object_or_404(Patient, id=patient_id) # ensure that the patient exists
    diagnosis = get_object_or_404(Diagnosis, id=diagnosis_id, patient_id=patient_id) # ensure that the diagnosis exists
    prescriptions = Prescription.objects.filter(diagnosis_id=diagnosis_id, patient_id=patient_id)
    prescription_details = PrescriptionDetails.objects.filter(prescription_id__in=prescriptions)

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
                    "method": detail.method,
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
@permission_classes([IsAuthenticated, IsAdminUser])   # Only admin can access this
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
@permission_classes([IsAuthenticated, IsAdminUser])   # Only admin can access this
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


######################################################### ALLOTMENT VIEWS ######################################################################
# List all room and bed details (with filter options according to status - available, occupied)
# /api/room-beds/
# @api_view(['GET'])
# def get_all_room_bed_details(request):
#     """
#     GET: List all bed details along with associated room and ward info
#     """
#     # Apply filter based on the query parameter 'is_admitted' → now maps to 'is_occupied'
#     is_admitted = request.query_params.get('is_admitted', None)
    
#     if is_admitted is not None:
#         is_occupied = is_admitted.lower() == 'true'
#         beds = Bed.objects.filter(is_occupied=is_occupied)
#     else:
#         beds = Bed.objects.all()
    
#     serializer = BedSerializer(beds, many=True)
#     return Response(serializer.data, status=status.HTTP_200_OK)


# Retrieve a specific room and bed details
# /api/room-beds/<bed_id>/
@api_view(['GET'])
@permission_classes([IsAuthenticated, IsStaffUser])   # Only staff can access this
def get_room_bed_details(request, bed_id):
    """
    GET: Retrieve a specific bed's details along with room and ward info
    """
    bed = get_object_or_404(Bed, id=bed_id)
    serializer = BedSerializer(bed)
    return Response(serializer.data, status=status.HTTP_200_OK)


# List all wards
# /api/wards/
@api_view(['GET'])
@permission_classes([IsAuthenticated, IsStaffUser])   # Only staff can access this
def get_wards(request):
    wards = Ward.objects.all()
    serializer = WardSerializer(wards, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)

# Create a new ward
# /api/wards/create/
@api_view(['POST'])
@permission_classes([IsAuthenticated, IsAdminUser])   # Only Admin can access this
def create_ward(request):
    serializer = WardSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# List all rooms
# /api/rooms/
@api_view(['GET'])
@permission_classes([IsAuthenticated, IsStaffUser])   # Only staff can access this
def get_rooms(request):
    rooms = Room.objects.all()
    serializer = RoomSerializer(rooms, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)

# Create a new room
# /api/rooms/create/
@api_view(['POST'])
@permission_classes([IsAuthenticated, IsAdminUser])   # Only Admin can access this
def create_room(request):
    serializer = RoomSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# List all beds
# /api/beds/
@api_view(['GET'])
@permission_classes([IsAuthenticated, IsStaffUser])   # Only staff can access this
def get_beds(request):
    beds = Bed.objects.all()
    serializer = BedSerializer(beds, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)

# Create a new bed
# /api/beds/create/
@api_view(['POST'])
@permission_classes([IsAuthenticated, IsAdminUser])   # Only Admin can access this
def create_beds(request):
    """
    POST: Create one or more bed objects (accepts an array)
    """
    data = request.data

    # If it's a list, many=True; otherwise just a single object
    many = isinstance(data, list)

    serializer = BedSerializer(data=data, many=many)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# Update a specific bed
# /api/beds/<bed_id>/
@api_view(['PATCH'])
@permission_classes([IsAuthenticated, IsStaffUser])   # Only staff can access this
def update_bed(request, bed_id):
    bed = get_object_or_404(Bed, id=bed_id)
    serializer = BedSerializer(bed, data=request.data, partial=True)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_200_OK)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# Get all allotments
# /api/allotments/
@api_view(['GET'])
@permission_classes([IsAuthenticated, IsStaffUser])   # Only staff can access this
def get_all_allotments(request):
    """
    GET: Get all allotments
    """
    allotments = Allotment.objects.all()
    serializer = AllotmentSerializer(allotments, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)


# Get allotment details of a patient
# /api/allotments/<patient_id>/
# @api_view(['GET'])
# @permission_classes([IsAuthenticated, IsStaffUser])   # Only staff can access this
# def get_patient_allotment(request, patient_id):
#     """
#     GET: Get a patient's allotment details
#     """
#     get_object_or_404(Patient, id=patient_id)
#     allotment = get_object_or_404(Allotment, patient_id=patient_id)
#     room_bed_details = get_object_or_404(RoomBed, id=allotment.room_bed_id.id)
#     if allotment:
#         serializer = AllotmentSerializer(allotment)
#         room_serializer = RoomBedSerializer(room_bed_details)
#         response_data = {
#             "allotment": serializer.data,
#             "room_bed_details": room_serializer.data,
#         }
#         return Response(response_data, status=status.HTTP_200_OK)
#     else:
#         return Response({"message": "No allotment found for this patient."}, status=status.HTTP_404_NOT_FOUND)


# Create a new allotment for a patient
# /api/allotments/create/
# @api_view(['POST'])
# @permission_classes([IsAuthenticated, IsStaffUser])   # Only staff can access this
# def create_allotment(request):
#     """
#     POST: Create a new allotment for a patient
#     """
#     serializer = AllotmentSerializer(data=request.data)
#     if serializer.is_valid():
#         allotment = serializer.save()

#         # mark the bed and room as occupied / alloted
#         room = get_object_or_404(RoomBed, id=allotment.room_bed_id.id)
#         room.is_admitted = True
#         room.save()
#         room_serializer = RoomBedSerializer(room)
#         response_data = {
#             "allotment": serializer.data,
#             "room": room_serializer.data,
#         }

#         return Response(response_data, status=status.HTTP_201_CREATED)
#     return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# Delete an allotment
# By deleting means deleting the particular allotment record plus marking the is_admitted field false in the roombed object linked with it
# /api/allotments/<allotment_id>/
# @api_view(['DELETE'])
# @permission_classes([IsAuthenticated, IsStaffUser])   # Only staff can access this
# def delete_allotment(request, allotment_id):
#     """
#     DELETE: Delete an allotment
#     """
#     allotment = get_object_or_404(Allotment, id=allotment_id)
#     room_bed = get_object_or_404(RoomBed, id=allotment.room_bed_id.id)
    
#     # mark the bed and room as available
#     room_bed.is_admitted = False
#     room_bed.save()
    
#     allotment.delete()
#     return Response(status=status.HTTP_204_NO_CONTENT)


####################################################### APIS THE FOR DOCTOR FLOW IN FRONTEND ###################################################

@api_view(['POST'])
def create_full_diagnosis(request):
    serializer = DiagnosisFullCreateSerializer(data=request.data)
    if serializer.is_valid():
        diagnosis = serializer.save()
        return Response({"status": "success", "message": "Diagnosis created successfully", "diagnosis_id": diagnosis.id}, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
def get_full_diagnosis_details(request, diagnosis_id):
    """
    GET: Retrieve a diagnosis, its prescription (if any), prescription details (medicines), and tests prescribed
    """
    try:
        diagnosis = Diagnosis.objects.get(id=diagnosis_id)
    except Diagnosis.DoesNotExist:
        return Response({"error": "Diagnosis not found."}, status=status.HTTP_404_NOT_FOUND)

    # Diagnosis base data
    diagnosis_data = {
        "id": diagnosis.id,
        "patient_id": diagnosis.patient_id.id,
        "doctor_id": diagnosis.visiting_doctor_id.id,
        "diagnosis_date": diagnosis.diagnosis_date,
        "diagnosis_time": diagnosis.diagnosis_time,
        "blood_pressure": diagnosis.blood_pressure,
        "blood_sugar": diagnosis.blood_sugar,
        "SPo2": diagnosis.SPo2,
        "heart_rate": diagnosis.heart_rate,
        "summary": diagnosis.diagnosis_summary,
        "tests": diagnosis.tests,
        "status": diagnosis.status
    }

    # Check if there's a prescription linked to this diagnosis
    prescription = Prescription.objects.filter(diagnosis_id=diagnosis).first()
    if prescription:
        prescription_details = PrescriptionDetails.objects.filter(prescription_id=prescription)
        tests_prescribed = TestPrescribed.objects.filter(prescription_id=prescription)

        diagnosis_data["prescription"] = {
            "id": prescription.id,
            "prescribed_by": prescription.prescribed_by_doctor_id.id,
            "date": prescription.prescription_date,
            "notes": prescription.additional_notes,
            "status": prescription.status,
            "medicines": PrescriptionDetailsSerializer(prescription_details, many=True).data,
            "tests": TestPrescribedSerializer(tests_prescribed, many=True).data
        }
    else:
        diagnosis_data["prescription"] = None

    return Response(diagnosis_data, status=status.HTTP_200_OK)


@api_view(['GET'])
@permission_classes([IsAuthenticated])   # All authenticated users can access this
def get_diagnoses_for_patient(request, patient_id):
    """
    GET: List all diagnosis for a patient
    """
    diagnosis = Diagnosis.objects.filter(patient_id=patient_id)
    serializer = DiagnosisSerializer(diagnosis, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)


@api_view(['GET'])
@permission_classes([IsAuthenticated, IsDoctorUser])   # Only Doctors can access this
def get_diagnoses_for_doctor(request, doctor_id):
    """
    GET: List all diagnosis for a doctor
    """
    diagnosis = Diagnosis.objects.filter(visiting_doctor_id=doctor_id)
    serializer = DiagnosisSerializer(diagnosis, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)
