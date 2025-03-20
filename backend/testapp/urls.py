from . import views
from django.urls import path

urlpatterns = [
    path('users', views.getUsers, name='users'),
    path ('user/<str:pk>', views.getUser, name='user'),
    path('add', views.addUser, name='add'),
    path('update/<str:pk>', views.updateUser, name='update'),
    path('delete/<str:pk>', views.deleteUser, name='delete'),
]