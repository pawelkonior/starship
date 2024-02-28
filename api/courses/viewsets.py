from django.db import transaction
from django.db.models import Prefetch
from django.db.models.functions import Now
from django.http import Http404
from django.shortcuts import get_object_or_404
from django.utils import timezone
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import viewsets, status, permissions
from rest_framework.decorators import action
from rest_framework.filters import OrderingFilter
from rest_framework.parsers import JSONParser, MultiPartParser
from rest_framework.response import Response

from .models import Course, Enrollment, ScoreChange, CourseReview
from .permissions import IsOwnerOrReadOnly, ParticipatedInCourse
from .serializers import (
    CourseDetailSerializer,
    CourseSerializer,
    CourseListSerializer,
    ReviewSerializer,
    CourseCreateSerializer,
)
from .filters import CourseFilter

from utils.message_response import MessageResponse


class CourseViewSet(viewsets.ModelViewSet):
    """
    Class: CourseViewSet

    A viewset that provides CRUD operations for the Course model.

    Attributes:
        - queryset (QuerySet): The queryset containing all the Course objects in the database.
        - serializer_class: The serializer class for Course objects.
        - filter_backends (list): The list of filter backends to apply to the queryset.
        - filterset_class: The filterset class for filtering the queryset.
        - ordering_fields (tuple): The fields on which the queryset can be ordered.
        - ordering (tuple): The default ordering for the queryset.
        - parser_classes (list): The list of parser classes for parsing the request data.
        - permission_classes (list): The list of permission classes to apply to the view.

    Methods:
        - retrieve(request, pk): Retrieves a Course object by its primary key.
        - destroy(request, *args, **kwargs): Destroys a Course object.
        - manage_enrollments(request, pk): Manages the enrollments for a Course object.
        - _create_enrollments(request, pk): Creates enrollments for a Course object.
        - _delete_enrollment(request, pk): Deletes an enrollment for a Course object.
        - review_course(request, pk): Reviews a Course object.
        - get_queryset(): Gets the queryset for active courses with prefetch related enrollments.
        - perform_create(serializer): Saves the serialized Course, attaching the user who created it as the owner.
        - get_serializer_class(): Gets the serializer class based on the action.
        - get_permissions(): Gets the permissions for different actions.

    """

    queryset = Course.objects.all()
    serializer_class = CourseSerializer
    filter_backends = [DjangoFilterBackend, OrderingFilter]
    filterset_class = CourseFilter
    ordering_fields = ("title", "owner__last_name", "course_date", "price")
    ordering = ("course_date",)
    parser_classes = [MultiPartParser, JSONParser]
    permission_classes = [permissions.IsAuthenticated]

    def retrieve(self, request, pk=None):
        course = self.get_object()
        if not isinstance(course, Course):
            raise Http404("Nie znaleziono kursu.")
        serializer = self.get_serializer(course)

        return Response(serializer.data, status=status.HTTP_200_OK)

    @transaction.atomic
    def destroy(self, request, *args, **kwargs):
        course = self.get_object()
        for enrollment in course.enrollments.filter(is_active=True):
            enrollment.is_active = False
            ScoreChange.objects.create(
                user=enrollment.student, amount=course.price, description=f"Odwołano kurs: {course.title}"
            )
            enrollment.save()

        course.is_active = False
        course.save()

        return Response({"message": f"Odwołano kurs: {course.title}"})

    @action(detail=True, methods=["post", "delete"], url_path="enrollments", url_name="enrollments")
    def manage_enrollments(self, request, pk=None):
        match self.request.method:
            case "POST":
                return self._create_enrollments(request, pk)
            case "DELETE":
                return self._delete_enrollment(request, pk)

    @transaction.atomic
    def _create_enrollments(self, request, pk=None):
        course = self.get_object()
        student = request.user
        enrollment, created = Enrollment.objects.update_or_create(course=course, student=student)

        if enrollment.is_active and not created:
            return MessageResponse(
                message=f"Użytkownik {request.user.email} już został zapisany na kurs {course.title}.", status=400
            )

        if self.request.user.score < course.price:
            return MessageResponse(message="Niewystarczająca ilość punktów, żeby zapisać się na ten kurs.", status=402)

        ScoreChange.objects.create(
            user=request.user, amount=-course.price, description=f"Dołączenie do kursu {course.title}"
        )
        enrollment.is_active = True
        enrollment.save()
        return MessageResponse(message=f"Zapisano na kurs {course.title}.", status=status.HTTP_201_CREATED)

    @transaction.atomic
    def _delete_enrollment(self, request, pk=None):
        course = self.get_object()
        if timezone.now() >= course.course_date:
            return MessageResponse(message=f"Nie można opuścić {course}, kurs już się odbył.", status=400)

        if not course.enrollments.filter(student=request.user, is_active=True).exists():
            return MessageResponse(message=f"Nie jesteś zapisany na kurs {course}.", status=400)

        enrollment = get_object_or_404(Enrollment, course=course, student=self.request.user)
        enrollment.is_active = False
        enrollment.save()
        ScoreChange.objects.create(
            user=request.user, amount=course.price, description=f"Opuszczenie kursu {course.title}"
        )

        return MessageResponse(message=f"Opuszczono kurs {course.title}", status=status.HTTP_200_OK)

    @action(detail=True, methods=["post"], url_path="reviews", url_name="reviews")
    @transaction.atomic
    def review_course(self, request, pk=None):
        course = self.get_object()
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        if CourseReview.objects.filter(course=course, user=request.user).exists():
            return MessageResponse(message="Ten kurs już został przez Ciebie oceniony.", status=400)

        review_ratios = {1: 0.5, 2: 0.75, 3: 1, 4: 1.05, 5: 1.25}
        score_change_amount = review_ratios.get(serializer.validated_data["note"], 1) * course.price
        ScoreChange.objects.create(
            user=course.owner, amount=score_change_amount, description=f"Prowadzenie kursu {course}"
        )
        serializer.save(course=course, user=request.user)
        return MessageResponse(message=f"Zapisano ocene dla kursu {course}", status=201)

    def get_queryset(self):
        """
        Get the queryset for active courses, and prefetch related enrollments.

        This queryset includes active courses, and, for each course, prefetches its active enrollments
        (which include the corresponding students) into a new attribute called 'students'.

        The benefit of this approach is that it allows for efficient retrieval of related information
        with minimal database queries.

        :return: the queryset of active courses with prefetched enrollments.
        :rtype: QuerySet
        """
        return Course.objects.prefetch_related(
            Prefetch(
                "enrollments",
                queryset=Enrollment.objects.select_related("student").filter(is_active=True),
                to_attr="students",
            )
        ).filter(is_active=True, is_accepted=True)

    def perform_create(self, serializer):
        """
        Save the serialized Course, attaching the user who created it as the owner.

        :param serializer: The serializer belonging to the Course model
        :type serializer: rest_framework.serializers.Serializer
        """
        serializer.save(owner=self.request.user)

    def get_serializer_class(self):
        serializers = {
            "review_course": ReviewSerializer,
            "list": CourseListSerializer,
            "retrieve": CourseDetailSerializer,
            "update": CourseDetailSerializer,
            "create": CourseCreateSerializer,
        }

        return serializers.get(self.action, self.serializer_class)

    def get_permissions(self):
        """
        Override the built-in method of viewsets to provide custom permissions for different actions.

        It assigns different permission classes based on the action involved.

        :return: list of permission classes defined in self.permission_classes
        :rtype: list

        :Example:
        """
        actions = {
            "list": [permissions.AllowAny],
            "retrieve": [permissions.AllowAny],
            "destroy": [permissions.IsAuthenticated, IsOwnerOrReadOnly],
            "update": [permissions.IsAuthenticated, IsOwnerOrReadOnly],
            "partial_update": [permissions.IsAuthenticated, IsOwnerOrReadOnly],
            "manage_enrollments": [permissions.IsAuthenticated],
            "review_course": [ParticipatedInCourse],
        }
        self.permission_classes = actions.get(self.action, self.permission_classes)
        return super().get_permissions()
