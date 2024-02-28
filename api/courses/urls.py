from django.urls import path
from rest_framework import routers

from . import viewsets

app_name = "courses"

router = routers.SimpleRouter()
router.register(r"courses", viewsets.CourseViewSet, basename="course")

urlpatterns = router.urls
