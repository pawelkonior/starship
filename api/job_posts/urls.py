from rest_framework import routers
from django.urls import path

from . import viewsets

app_name = "job_posts"

router = routers.DefaultRouter()
router.register(r"companies", viewsets.CompanyViewSet, basename="companies")
router.register(r"jobs", viewsets.JobPostViewSet, basename="jobs")

urlpatterns = []

urlpatterns += router.urls
