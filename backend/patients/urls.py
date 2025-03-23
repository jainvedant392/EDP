from django.urls import path
from .views import patient_list_create, access_patient_by_id

urlpatterns = [
    path('patients/', patient_list_create, name='patient_list_create'),
    path('patients/<int:patient_id>/', access_patient_by_id, name='access_patient_by_id'),
]
