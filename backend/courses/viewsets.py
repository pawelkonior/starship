from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.viewsets import ReadOnlyModelViewSet
from .serializers import RoadmapSerializer, ProjectSerializer
from .models import Roadmap, Project


from . import serializers, models


class CourseViewSet(viewsets.ModelViewSet):
    serializer_class = serializers.CourseSerializer
    queryset = models.Course.objects.all()
    authentication_classes = []  # disables authentication
    permission_classes = []  # disables permission

    def create(self, request, *args, **kwargs):
        user = self.request.user

        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save(owner=user)

        return Response(serializer.data, status=status.HTTP_201_CREATED)


class RoadmapViewset(ReadOnlyModelViewSet):
    serializer_class = RoadmapSerializer

    def get_queryset(self):
        return Roadmap.objects.filter(owner=self.request.user)


class ProjectViewset(viewsets.ModelViewSet):
    serializer_class = ProjectSerializer
    queryset = Project.objects.all()

    def create(self, request, *args, **kwargs):
        user = self.request.user

        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save(owner=user)

        return Response(serializer.data, status=status.HTTP_201_CREATED)
