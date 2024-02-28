from rest_framework import routers
from django.urls import path

from . import viewsets, views

app_name = "users"

router = routers.SimpleRouter()
router.register(r"users", viewsets.UserViewSet, basename="user")

urlpatterns = [
    path('activate/<uidb64>/<token>/', views.AccountActivationView.as_view(), name='activate'),
    path('reset_password/', views.PasswordResetRequestView.as_view(), name='reset_password'),
    path('change_password/', views.ChangePasswordView.as_view(), name='change_password'),
    path('reset_password_confirm/<uidb64>/<token>', views.PasswordResetConfirmView.as_view(), name='reset_password_confirm'),
]

urlpatterns += router.urls
