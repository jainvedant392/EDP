from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import status
from django.shortcuts import get_object_or_404
from .models import Patient
from .serializers import PatientSerializer

# List all patients / Create a new patient
# /api/patients/
@api_view(['GET', 'POST'])
def patient_list_create(request):
    """
    GET: List all patients
    POST: Create a new patient
    """

    if request.method == 'GET':
        patients = Patient.objects.all() # pylint: disable=no-member
        serializer = PatientSerializer(patients, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    elif request.method == 'POST':
        serializer = PatientSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# Retrieve patient details / Update a patient / Delete a patient
# /api/patients/<patient_id>/
@api_view(['GET', 'PUT', 'PATCH', 'DELETE'])
def access_patient_by_id(request, patient_id):
    """
    Retrieve, update, or delete a patient record.
    """
    patient = get_object_or_404(Patient, id=patient_id)

    if request.method == 'GET':
        serializer = PatientSerializer(patient)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    elif request.method in ['PUT', 'PATCH']:
        # PUT = full update, PATCH = partial update
        serializer = PatientSerializer(patient, data=request.data, partial=(request.method == 'PATCH'))
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    elif request.method == 'DELETE':
        # we will do soft delete in this case, by marking the status in Patient as inactive
        patient.status = 'inactive'
        patient.save()
        return Response({"message": "Patient deleted successfully"}, status=status.HTTP_204_NO_CONTENT)

