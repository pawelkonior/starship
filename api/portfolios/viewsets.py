from rest_framework import viewsets, parsers
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from courses.permissions import IsOwnerOrReadOnly
from .models import Project
from .serializers import ProjectSerializer, ListProjectSerializer


class ProjectViewSet(viewsets.ModelViewSet):
    """
    ProjectViewSet is a viewset class that extends the ModelViewSet class provided by the viewsets module.

    Attributes:
        - permission_classes: A list of permission classes that specify the required permissions for accessing the viewset.
        - parser_classes: A list of parser classes that define how the incoming request data should be parsed.

    Methods:
        - list(self, request, *args, **kwargs): Retrieves a list of projects and returns the serialized data in the response.
        - get_queryset(self): Returns the queryset of all projects, including related images and tags, that should be used for the viewset.
        - perform_create(self, serializer): Persists a new project record in the database with the current user as the owner.
        - get_serializer_class(self): Determines the serializer class based on the current action being performed.

    """
    permission_classes = [IsAuthenticated, IsOwnerOrReadOnly]
    parser_classes = [parsers.MultiPartParser, parsers.JSONParser, parsers.FormParser]

    def list(self, request, *args, **kwargs):
        serializer = self.get_serializer(self.get_queryset(), many=True)
        return Response(serializer.data)

    def get_queryset(self):
        return Project.objects.all().prefetch_related("images", "tags")

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)

    def get_serializer_class(self):
        serializer_class = ProjectSerializer
        if self.action == "list":
            serializer_class = ListProjectSerializer

        return serializer_class
