from django.contrib.auth import get_user_model
from django.urls import reverse
from django.utils.encoding import force_bytes
from django.utils.http import urlsafe_base64_encode
from rest_framework import permissions, status, viewsets, parsers
from rest_framework.decorators import action
from rest_framework.generics import get_object_or_404
from rest_framework.response import Response

from courses.serializers import CourseSerializer, EnrollmentSerializer
from job_posts.serializers import CompanySerializer, JobPostSerializer
from portfolios.serializers import ProjectSerializer
from .serializers import RegistrationSerializer, UserSerializer, ListUserSerializer
from .permissions import IsUserOrAdminUser
from .utils import send_confirmation_email, account_activation_token_generator


CustomUser = get_user_model()


class UserViewSet(viewsets.ModelViewSet):
    """
    A view set for viewing and manipulating user instances.

    :param request: Request object
    :type request: rest_framework.request.Request
    :param args: Variable length argument list
    :param kwargs: Arbitrary keyword arguments
    :return: Response object
    :rtype: rest_framework.response.Response
    """

    parser_classes = [parsers.MultiPartParser, parsers.JSONParser]

    def create(self, request, *args, **kwargs):
        """
        Processes POST request to create a new user, creates an account activation token,
        sends an account activation email, and returns an HTTP 201 CREATED response.

        :param request: the request object
        :type request: rest_framework.request.Request
        :param args: Variable length argument list
        :param kwargs: Arbitrary keyword arguments
        :return: Response with serializer data and HTTP 201 CREATED status
        :rtype: rest_framework.response.Response

        """

        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()

        token = account_activation_token_generator.make_token(user)
        uid = urlsafe_base64_encode(force_bytes(user.pk))

        activation_link = request.build_absolute_uri(reverse("users:activate", kwargs={"uidb64": uid, "token": token}))

        send_confirmation_email(user.email, activation_link)

        return Response(serializer.data, status=status.HTTP_201_CREATED)

    def list(self, request, *args, **kwargs):
        """
        Processes GET request, serializes the queryset and returns it with an HTTP 200 OK response.

        :param request: The request object
        :type request: rest_framework.request.Request
        :param args: Variable length argument list
        :param kwargs: Arbitrary keyword arguments
        :return: Response with serialized queryset data and HTTP 200 OK status
        :rtype: rest_framework.response.Response

        """
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def get_queryset(self):
        return CustomUser.objects.all()

    @action(detail=True, methods=["get"], url_path="courses", url_name="user-courses")
    def list_user_courses(self, request, pk=None):
        """
        Processes GET request on user-specific courses, serializes the queryset
        related to a specific user and returns it. If user_id is not provided,
        returns an HTTP 400 BAD REQUEST response with error message.

        :param request: The request object
        :type request: rest_framework.request.Request
        :param user_id: The ID of a specific user
        :type user_id: int, required
        :return: Response with serialized queryset data pertaining to user's courses
                 and HTTP 200 OK status, or an error message with HTTP 400 BAD REQUEST status
        :rtype: rest_framework.response.Response

        """
        user = get_object_or_404(CustomUser.objects.prefetch_related("courses"), id=pk)
        active_courses = user.courses.filter(is_active=True)
        serializer = CourseSerializer(active_courses, many=True)

        return Response(serializer.data, status=status.HTTP_200_OK)

    @action(detail=True, methods=["get"], url_path="enrollments", url_name="user-enrollments")
    def list_enrolled_courses(self, request, pk=None):
        """
        List Enrolled Courses

        Retrieves the list of courses in which a user is enrolled.

        :param request: The HTTP request object.
        :param pk: The primary key of the user.
        :type request: HttpRequest
        :type pk: int
        :returns: The serialized data of the enrolled courses.
        :rtype: Response
        """
        user = get_object_or_404(CustomUser.objects.prefetch_related("enrollments__course"), id=pk)
        courses = [enrollment.course for enrollment in user.enrollments.filter(is_active=True)]
        serializer = CourseSerializer(courses, many=True)

        return Response(serializer.data, status=status.HTTP_200_OK)

    @action(detail=True, methods=["get"], url_path="companies", url_name="user-companies")
    def list_all_user_companies(self, request, pk=None):
        """
        List all companies associated with a user.

        Parameters:
            - request: The HTTP request object.
            - pk: The primary key of the user.

        Returns:
            - A Response object containing the serialized data of the user's companies, with a status code of 200 if successful.

        """
        user = get_object_or_404(CustomUser.objects.prefetch_related("companies"), pk=pk)
        companies = user.companies.all()
        serializer = CompanySerializer(companies, many=True)

        return Response(serializer.data, status=status.HTTP_200_OK)

    @action(detail=True, methods=["get"], url_path="job-posts", url_name="user-job-posts")
    def list_all_users_job_posts(self, request, pk=None):
        """
        List all job posts of a specific user.
        This method takes the following parameters:

        Parameters:
            - request (HttpRequest): The HTTP request object.
            - pk (int): The primary key of the user.

        Returns:
            - Response: The HTTP response containing a list of serialized job posts of the user.

        """
        user = get_object_or_404(CustomUser.objects.prefetch_related("job_posts"), pk=pk)
        job_posts = user.job_posts.all()
        serializer = JobPostSerializer(job_posts, many=True)

        return Response(serializer.data, status=status.HTTP_200_OK)

    @action(detail=True, methods=["get"], url_path="projects", url_name="user-projects")
    def list_all_user_projects(self, request, pk=None):
        """
        List All User Projects

        Fetches all projects associated with a specific user.

        Parameters:
            - request (django.http.HttpRequest): The HTTP request object.
            - pk (int): The primary key of the user.

        Returns:
            - Response (rest_framework.response.Response): The HTTP response object containing the serialized project data.

        """
        user = get_object_or_404(CustomUser.objects.prefetch_related("projects"), pk=pk)
        projects = user.projects.all()
        serializer = ProjectSerializer(projects, many=True)

        return Response(serializer.data, status=status.HTTP_200_OK)

    @action(detail=True, methods=["get"], url_path="profile", url_name="user-profile")
    def user_profile(self, request, pk=None):
        """
        Returns the user profile data including courses, enrollments, companies, job posts, and score.

        Parameters:
            - `request` (django.http.HttpRequest): The HTTP request object.
            - `pk` (int): The primary key of the user to retrieve the profile for.

        Returns:
            - `django.http.HttpResponse`: The HTTP response containing the user profile data in JSON format.

        """
        user_data = get_object_or_404(
            CustomUser.objects.prefetch_related("courses", "enrollments", "companies", "job_posts"), pk=pk
        )
        profile_serializer = UserSerializer(user_data, many=False)
        courses_serializer = CourseSerializer(user_data.courses.all(), many=True)
        enrollments_serializer = EnrollmentSerializer(user_data.enrollments.all(), many=True)
        companies_serializer = CompanySerializer(user_data.companies.all(), many=True)
        job_posts_serializer = JobPostSerializer(user_data.job_posts.all(), many=True)
        score = request.user.score

        return Response(
            {
                "user_profile": profile_serializer.data,
                "courses": courses_serializer.data,
                "enrollments": enrollments_serializer.data,
                "companies": companies_serializer.data,
                "job_posts": job_posts_serializer.data,
                "score": score,
            }
        )

    def get_serializer_class(self):
        """
        Determines the appropriate serializer class based on the action.

        :return: The appropriate serializer class for the action
        :rtype: rest_framework.serializers.Serializer

        """

        match self.action:
            case "create":
                return RegistrationSerializer
            case "list":
                return ListUserSerializer
            case _:
                return UserSerializer

    def get_permissions(self):
        """
        Determines the appropriate permissions based on the current action.

        :return: The appropriate permission classes for the action
        :rtype: list of rest_framework.permissions.BasePermission subclasses

        """
        if self.action in ["update", "partial_update"]:
            self.permission_classes = (
                IsUserOrAdminUser,
                permissions.IsAuthenticated,
            )
        elif self.action == "create":
            self.permission_classes = (permissions.AllowAny,)
        else:
            self.permission_classes = (permissions.IsAuthenticated,)

        return super().get_permissions()
