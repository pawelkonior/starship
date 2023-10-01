from django.urls import path
from rest_framework import routers
from . import viewsets, views


router = routers.SimpleRouter()
router.register("courses", viewsets.CourseViewSet, basename="course")
router.register("roadmaps", viewsets.RoadmapViewset, basename="course")
router.register("projects", viewsets.ProjectViewset, basename="course")

urlpatterns = [
    path('peer_connection/', views.peer_id_view, name="peer_connect"),
]

urlpatterns += router.urls
