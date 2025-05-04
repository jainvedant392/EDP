from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from .models import CustomUser
from main_app.models import Patient

# Create your views here.
class PatientRegisterView(APIView):
    def post(self, request):
        aadhaar = request.data.get('aadhaar')
        password = request.data.get('password')
        if not aadhaar or not password:
            return Response({'error': 'Aadhaar and password are required'}, status=400)
        if CustomUser.objects.filter(aadhaar=aadhaar).exists():
            return Response({'error': 'User already exists'}, status=400)
        
        patient_obj = Patient.objects.filter(aadhar=aadhaar).first()
        user = CustomUser.objects.create_user(
            aadhaar=aadhaar,
            password=password,
            role='patient',
            patient=patient_obj
        )
        return Response({'message': 'User created successfully'}, status=201)


class RoleBasedLoginView(APIView):
    def post(self, request, role):
        if role not in ['staff', 'doctor', 'patient']:
            return Response({'error': 'Invalid role'}, status=400)

        if role == 'patient':
            aadhaar = request.data.get('aadhaar')
            password = request.data.get('password')
            user = CustomUser.objects.filter(aadhaar=aadhaar, role='patient').first()
        else:
            email = request.data.get('email')
            password = request.data.get('password')
            user = CustomUser.objects.filter(email=email, role=role).first()

        if user is None or not user.check_password(password):
            return Response({'error': 'Invalid credentials', 'password':password}, status=401)

        refresh = RefreshToken.for_user(user)
        return Response({
            'refresh': str(refresh),
            'access': str(refresh.access_token),
            'role': user.role,
            'id': 4,
        })