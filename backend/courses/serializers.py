from rest_framework import serializers
from . import models
from users.serializers import CustomUserSerializer, TagSerializer
from rest_framework.serializers import ModelSerializer


class ProgrammePointSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.ProgrammePoint
        fields = ("id", "name", "description")


class CourseSerializer(serializers.ModelSerializer):
    owner = CustomUserSerializer(read_only=True)
    programme_points = ProgrammePointSerializer(many=True)
    tags = TagSerializer(many=True)

    class Meta:
        model = models.Course
        fields = ("id", "name", "owner", "description", "created_at", 'programme_points', "tags")

    def create(self, validated_data):
        validated_data = dict(validated_data)
        programme_points = validated_data.pop("programme_points")
        tags = validated_data.pop("tags")
        course = models.Course.objects.create(**validated_data)

        for programme_point in programme_points:
            models.ProgrammePoint.objects.create(course=course, **programme_point)

        for tag in tags:
            tag, created = models.Tag.objects.get_or_create(**tag)
            course.tags.add(tag)

        return course


class LearningStagesSerializer(ModelSerializer):
    class Meta:
        model = models.LearningStages
        fields = ("id", "roadmap", "stage_num", "name", "description")


class RoadmapSerializer(ModelSerializer):
    stages = LearningStagesSerializer(many=True)

    class Meta:
        model = models.Roadmap
        fields = ("id", "topic", "description", "created_at", "owner", "tags", "stages")


class PictureSerializer(ModelSerializer):
    class Meta:
        model = models.Picture
        fields = ("image",)


class ProjectSerializer(ModelSerializer):
    pictures = PictureSerializer(many=True, required=False)
    owner = CustomUserSerializer(read_only=True)

    class Meta:
        model = models.Project
        fields = ("id", "owner", "name", "description", "link", "pictures")

    def create(self, validated_data):
        validated_data = dict(validated_data)

        if validated_data.get("pictures"):
            pictures = validated_data.pop("pictures")

        project = models.Project.objects.create(**validated_data)

        for picture in pictures:
            models.Picture.objects.create(project=project, **picture)

        return project
