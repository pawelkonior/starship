from rest_framework import serializers
from django.contrib.auth import get_user_model

from . import models
from courses.models import Course, Enrollment, Project, Picture
from courses.models import Tag


class TagSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tag
        fields = ("id", "name",)


class CustomUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.CustomUser
        fields = ["id", "username", "email", "first_name", "last_name"]


class UserCoursesSerializer(serializers.ModelSerializer):
    class Meta:
        model = Course
        fields = ["id", "name", "description"]


class ProjectPicturesSerializer(serializers.ModelSerializer):
    class Meta:
        model = Picture
        fields = ["id", "image"]


class UserProjectsSerializer(serializers.ModelSerializer):
    pictures = ProjectPicturesSerializer(many=True, read_only=True)

    class Meta:
        model = Project
        fields = ["name", "description", "link", "pictures"]


class EnrolledCoursesSerializer(serializers.ModelSerializer):
    course_info = serializers.SerializerMethodField()

    class Meta:
        model = Enrollment
        fields = ["course_info", "duration", "scheduled_at"]

    def get_course_info(self, obj):
        course = obj.course
        course_data = UserCoursesSerializer(course).data
        return course_data


class UserPortfolioSerializer(serializers.ModelSerializer):
    courses = UserCoursesSerializer(many=True, read_only=True)
    enrolled_courses = EnrolledCoursesSerializer(many=True, read_only=True)
    projects = UserProjectsSerializer(many=True, read_only=True)

    class Meta:
        model = get_user_model()
        fields = ['id', 'username', 'first_name', "last_name", 'avatar', 'credits', 'projects', 'courses',
                  'enrolled_courses']
