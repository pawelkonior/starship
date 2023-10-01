from django.urls import path
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)
from . import views

app_name = 'users'

urlpatterns = [
    path('user_portfolio/', views.RequestUserPortfolioView.as_view(), name='request_user_portfolio'),
    path('user_portfolio/<int:pk>/', views.UserPortfolioView.as_view(), name='user_portfolio'),
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]
