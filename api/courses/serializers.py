import json
import logging

from django.db.models import Subquery, Avg, Count
from rest_framework import serializers

from users.serializers import ListUserSerializer, UserSerializer
from .models import Course, Enrollment, Tag, CourseReview

logger = logging.getLogger(__name__)


class TagSerializer(serializers.ModelSerializer):
    """
    TagSerializer

    Serializer class for Tag model.

    Attributes:
        - model (Model): The model class for which the serializer is created.
        - fields (tuple): Tuple of fields to include in the serialized representation.

    Methods:
        - to_internal_value(data):
            Converts the incoming serialized data into internal Python representation.

            Args:
                data (mixed): The serialized data to be converted.

            Returns:
                mixed: The converted internal Python representation of the data.

        - to_representation(instance):
            Converts the internal Python representation to the serialized representation.

            Args:
                instance (Model): The instance to be serialized.

            Returns:
                mixed: The serialized representation of the instance.
    """
    class Meta:
        model = Tag
        fields = ("id", "name")

    def to_internal_value(self, data):
        if isinstance(data, dict):
            return super().to_internal_value(data)

        tag_exists = Tag.objects.filter(name__iexact=data).exists()
        tag = None

        if isinstance(data, str) and tag_exists:
            tag = Tag.objects.get(name__iexact=data)
        elif not tag_exists:
            tag = Tag.objects.create(name=data)

        return tag

    def to_representation(self, instance):
        return instance.name


class CourseDetailSerializer(serializers.ModelSerializer):
    """
    Class CourseDetailSerializer

    Serializer class for Course model with detailed fields.

    Attributes:
        - owner (ListUserSerializer): Serializer for owner field.
        - students (MethodField): Method to get serialized list of students enrolled in the course.
        - tags (TagSerializer): Serializer for tags field.
        - image (ImageField): Serializer for image field.
        - tutor_rating (MethodField): Method to get average tutor rating for the course.
        - tutor_rating_count (MethodField): Method to get count of tutor ratings for the course.
        - is_mine (MethodField): Method to check if the course is owned by the current user.
        - is_attendee (MethodField): Method to check if the current user is attending the course.

    Methods:
        - get_students(course): Get serialized list of students enrolled in the course.
        - get_is_mine(course): Check if the course is owned by the current user.
        - get_is_attendee(course): Check if the current user is attending the course.
        - get_tutor_rating(course): Get average tutor rating for the course.
        - get_tutor_rating_count(course): Get count of tutor ratings for the course.
        - _get_statistics(course): Get statistics related to tutor rating for the course.
        - update(instance, validated_data): Update the instance with validated data and save.

    """
    owner = ListUserSerializer(read_only=True)
    students = serializers.SerializerMethodField(read_only=True)
    tags = TagSerializer(many=True, required=False)
    image = serializers.ImageField(required=False)
    tutor_rating = serializers.SerializerMethodField(read_only=True)
    tutor_rating_count = serializers.SerializerMethodField(read_only=True)
    is_mine = serializers.SerializerMethodField(read_only=True)
    is_attendee = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = Course
        fields = (
            "id",
            "created_at",
            "owner",
            "title",
            "description",
            "duration",
            "course_date",
            "students",
            "tags",
            "link",
            "price",
            "is_mine",
            "image",
            "completed",
            "agenda",
            "level",
            "tutor_rating",
            "tutor_rating_count",
            "is_attendee",
        )
        read_only_fields = ("id", "created_at", "students")
        write_only_fields = ("id", "tags", "completed")

    def get_students(self, course):
        students = [enrollment.student for enrollment in course.students]
        return ListUserSerializer(students, many=True).data

    def get_is_mine(self, course):
        user = self.context["request"].user
        return course.owner_id == user.id

    def get_is_attendee(self, course):
        user = self.context["request"].user
        return any(enrollment.student == user and enrollment.is_active for enrollment in course.students)

    def get_tutor_rating(self, course):
        return self._get_statistics(course)["tutor_rating"]

    def get_tutor_rating_count(self, course):
        return self._get_statistics(course)["tutor_rating_count"]

    def _get_statistics(self, course):
        if hasattr(self, "_statistics") is False:
            owner_courses = Subquery(Course.objects.filter(owner=course.owner).values("id"))
            self._statistics = CourseReview.objects.filter(course__in=owner_courses).aggregate(
                tutor_rating=Avg("note"), tutor_rating_count=Count("id")
            )
        return self._statistics

    def update(self, instance, validated_data):
        new_tag_names = validated_data.pop("tags", [])
        new_tags = []
        for tag_name in new_tag_names:
            tag = Tag.objects.get(name__iexact=tag_name.name)
            new_tags.append(tag)

        instance.tags.set(new_tags)

        for attr, value in validated_data.items():
            setattr(instance, attr, value)

        instance.save()

        return instance


class CourseCreateSerializer(serializers.ModelSerializer):
    """

    The `CourseCreateSerializer` class is a serializer class that handles data validation and transformation for creating a new course. This class inherits from the `ModelSerializer` class provided by the `serializers` module.

    Attributes:
        - `owner`: A `ListUserSerializer` instance used for serializing the owner field as read-only.
        - `tags`: A JSONField used for serializing the tags field as required and write-only.

    Meta:
        - `model`: The model class that the serializer corresponds to, in this case, the `Course` model.
        - `fields`: The fields that should be included in the serialized representation of the model.
        - `read_only_fields`: The fields that should be considered read-only during deserialization.
        - `extra_kwargs`: Additional keyword arguments to configure field-specific behavior.

    Methods:
        - `get_tags(self, obj)`: A method that returns a serialized representation of the tags associated with a course object.
        - `validate_tags(self, value)`: A method that validates and transforms the tags field data before it is saved.
        - `create(self, validated_data)`: A method that creates a new course object with the validated data.


    """
    owner = ListUserSerializer(read_only=True)
    tags = serializers.JSONField(required=True, write_only=True)

    class Meta:
        model = Course
        fields = (
            "id",
            "created_at",
            "owner",
            "title",
            "description",
            "duration",
            "link",
            "course_date",
            "tags",
            "price",
            "image",
            "agenda",
            "level",
        )
        read_only_fields = ("id", "created_at")
        extra_kwargs = {"course_date": {"required": True}}

    def get_tags(self, obj):
        return TagSerializer(obj.tags.all(), many=True)

    def validate_tags(self, value):
        tags = []
        for tag_name in value:
            tag, _ = Tag.objects.get_or_create(name__iexact=tag_name, defaults={"name": tag_name})
            tags.append(tag)
        return tags

    def create(self, validated_data):
        tags = validated_data.pop("tags")
        course = Course.objects.create(**validated_data)
        course.tags.set(tags)
        return course


class CourseSerializer(serializers.ModelSerializer):
    """

    This class is a serializer class for the Course model. It is used to serialize Course objects into JSON format and deserialize JSON data into Course objects.

    Attributes:
        - owner (ListUserSerializer): Serializer for the owner field. This field is read-only.
        - tags (TagSerializer): Serializer for the tags field. This field can contain multiple tags.

    Meta:
        - model (Course): The model class associated with this serializer.
        - fields (tuple): A tuple of strings representing the fields to be included in the serialized output.
        - read_only_fields (tuple): A tuple of strings representing the fields that should be read-only.

    Methods:
        - create(validated_data): Creates a new Course instance based on the validated data and saves it to the database. Returns the created instance.

    """
    owner = ListUserSerializer(read_only=True)
    tags = TagSerializer(many=True)

    class Meta:
        model = Course
        fields = (
            "id",
            "created_at",
            "owner",
            "title",
            "description",
            "duration",
            "link",
            "course_date",
            "tags",
            "price",
            "completed",
            "image",
            "agenda",
            "level",
        )
        read_only_fields = ("id", "created_at")

    def create(self, validated_data):
        tags_data = validated_data.pop("tags")
        course = Course.objects.create(**validated_data)
        tags = []

        for tag_name in tags_data:
            tag = Tag.objects.get(name__iexact=tag_name.name)
            tags.append(tag)

        course.tags.set(tags)

        return course


class CourseListSerializer(serializers.ModelSerializer):
    """
    Serializer for Course List.

    This serializer is used to serialize a list of courses. It includes fields for course information such as owner, title, description, duration, course date, students count, link, tags, price, is mine, is attendee, agenda, completed, image, and level.

    Attributes:
        - owner (ListUserSerializer): Serializer for the owner of the course.
        - students_count (SerializerMethodField): Field to calculate the number of students enrolled in the course.
        - is_mine (SerializerMethodField): Field to check if the currently authenticated user is the owner of the course.
        - is_attendee (SerializerMethodField): Field to check if the currently authenticated user is enrolled in the course.
        - tags (TagSerializer): Serializer for the tags associated with the course.

    Meta:
        - model (Course): The model class for the serializer.
        - fields (tuple): Tuple containing the fields to include in the serialized output.
        - read_only_fields (tuple): Tuple containing the fields that should be read-only.

    Methods:
        - get_students_count(course): Returns the number of students enrolled in the course.
        - get_is_mine(course): Returns a boolean indicating if the currently authenticated user is the owner of the course.
        - get_is_attendee(course): Returns a boolean indicating if the currently authenticated user is enrolled in the course.
    """
    owner = ListUserSerializer(read_only=True)
    students_count = serializers.SerializerMethodField(read_only=True)
    is_mine = serializers.SerializerMethodField(read_only=True)
    is_attendee = serializers.SerializerMethodField(read_only=True)
    tags = TagSerializer(many=True, read_only=True)

    class Meta:
        model = Course
        fields = (
            "id",
            "created_at",
            "owner",
            "title",
            "description",
            "duration",
            "course_date",
            "students_count",
            "link",
            "tags",
            "price",
            "is_mine",
            "is_attendee",
            "agenda",
            "completed",
            "image",
            "level",
        )
        read_only_fields = ("id", "created_at", "students_count", "tags", "image")

    def get_students_count(self, course):
        return len(course.students)

    def get_is_mine(self, course):
        user = self.context["request"].user
        if user is None:
            return False
        return user.id == course.owner_id

    def get_is_attendee(self, course):
        user = self.context["request"].user
        return any(enrollment.student == user and enrollment.is_active for enrollment in course.students)


class EnrollmentSerializer(serializers.ModelSerializer):
    """
    EnrollmentSerializer serializers class.

    This class is responsible for serializing and deserializing the Enrollment model data. It defines the fields that should be included in the serialized representation and also specifies which fields should be read-only.

    Attributes:
        - course: An instance of the CourseSerializer class. It is a read-only field and represents the course associated with the enrollment.
        - student: An instance of the ListUserSerializer class. It is a read-only field and represents the student associated with the enrollment.

    Meta:
        - model: The Enrollment model class that the serializer class is based on.
        - fields: The fields that should be included in the serialized representation.
        - read_only_fields: The fields that should be treated as read-only and not allowed to be modified.
    """
    course = CourseSerializer(read_only=True)
    student = ListUserSerializer(read_only=True)

    class Meta:
        model = Enrollment
        fields = ("id", "course", "student", "enrollment_date")
        read_only_fields = ("enrollment_date",)


class ReviewSerializer(serializers.ModelSerializer):
    """

    Serializer for CourseReview model.

    This class is responsible for serializing and deserializing instances of CourseReview model into a JSON representation.

    Attributes:
        - course (CourseSerializer): Serializer for Course model. Read-only.
        - user (UserSerializer): Serializer for User model. Read-only.

    Meta:
        - model (CourseReview): The model class that this serializer is associated with.
        - fields (tuple): The fields to include in the serialized representation.
        - read_only_fields (tuple): The fields that should be read-only when deserializing the data.

    """
    course = CourseSerializer(read_only=True)
    user = UserSerializer(read_only=True)

    class Meta:
        model = CourseReview
        fields = ("id", "user", "course", "note", "description")
        read_only_fields = ("id", "user", "course")
