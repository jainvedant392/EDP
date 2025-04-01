from django.contrib import admin
from django.urls import path, include
from django.http import JsonResponse

urlpatterns = [
    # return a simple json hello in / route
    path('', lambda request: JsonResponse({'message': 'EDP API'}), name='hello'),
    path('admin/', admin.site.urls),
    path('api/', include([
        path('', include('main_app.urls')),
    ])),
]
