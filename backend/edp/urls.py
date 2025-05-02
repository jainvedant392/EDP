from django.contrib import admin
from django.urls import path, include
from django.http import JsonResponse
from auth_app.views import PatientRegisterView, RoleBasedLoginView

urlpatterns = [
    # return a simple json hello in / route
    path('', lambda request: JsonResponse({'message': 'EDP API'}), name='hello'),
    path('admin/', admin.site.urls),
    path('api/', include([
        path('', include('main_app.urls')),
    ])),
    path('register/patient/', PatientRegisterView.as_view()),
    path('login/<str:role>/', RoleBasedLoginView.as_view()),
]
