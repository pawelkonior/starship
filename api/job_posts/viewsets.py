from rest_framework import status, mixins
from rest_framework.decorators import action
from rest_framework.generics import get_object_or_404
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.viewsets import GenericViewSet

from courses.permissions import IsOwnerOrReadOnly
from .models import Company, JobPost
from . import serializers
from .filters import CompanyFilter, JobPostFilter


class CompanyViewSet(mixins.RetrieveModelMixin, mixins.ListModelMixin, GenericViewSet):
    """

    This class represents a viewset for accessing and manipulating Company objects.

    Attributes:
        - queryset: A queryset representing all Company objects.
        - filter_backends: A list of filter backend classes to apply when filtering the queryset.
        - filterset_class: A filterset class to use for filtering the queryset.
        - serializer_class: The serializer class to use for serializing and deserializing Company objects.
        - permission_classes: A list of permission classes to apply when checking access permissions for the view.

    Methods:
        - list_company_job_posts(request, pk=None): Retrieves a list of job posts associated with a specific company.
            Parameters:
                - request: The request object.
                - pk: The primary key of the company.
            Returns:
                - The list of job posts serialized as JSON, along with a status code indicating success (200 OK).

    """
    queryset = Company.objects.all()
    filter_backends = [DjangoFilterBackend]
    filterset_class = CompanyFilter
    serializer_class = serializers.CompanySerializer
    permission_classes = [IsAuthenticated, IsOwnerOrReadOnly]

    @action(detail=True, methods=["get"], url_path="job-posts", url_name="job-posts")
    def list_company_job_posts(self, request, pk=None):
        company = get_object_or_404(Company.objects.prefetch_related("company_posts"), pk=pk)
        job_posts = company.company_posts.all()
        serializer = serializers.JobPostSerializer(job_posts, many=True)

        return Response(serializer.data, status=status.HTTP_200_OK)


class JobPostViewSet(mixins.RetrieveModelMixin, mixins.ListModelMixin, GenericViewSet):
    """
    A ViewSet for handling job post related actions.

    This ViewSet provides the following actions:
        - retrieve: Retrieves a single job post instance.
        - list: Retrieves a list of job posts.

    Attributes:
        - queryset (QuerySet): The queryset used for retrieving job posts.
        - filter_backends (list): A list of filter backends to apply when filtering job posts.
        - filterset_class (FilterSet): The filterset class used for filtering job posts.
        - serializer_class (Serializer): The serializer class used for serializing job posts.
        - permission_classes (list): A list of permission classes to apply for job post actions.
    """
    queryset = JobPost.objects.all()
    filter_backends = [DjangoFilterBackend]
    filterset_class = JobPostFilter
    serializer_class = serializers.JobPostSerializer
    permission_classes = [IsAuthenticated, IsOwnerOrReadOnly]
