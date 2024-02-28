from rest_framework import serializers

from courses.models import Tag
from courses.serializers import TagSerializer
from users.serializers import ListUserSerializer
from .models import Project, ProjectImage


class ProjectImageSerializer(serializers.ModelSerializer):
    """
    Serializer for ProjectImage model.

    This class is responsible for serializing and deserializing ProjectImage instances.

    Attributes:
        - model: The ProjectImage model associated with the serializer.
        - fields: The fields to include in the serialized representation.

    """
    class Meta:
        model = ProjectImage
        fields = ["image"]


class ListProjectSerializer(ListUserSerializer):
    """
    Serializer class for serializing a list of Project objects.

    Inherits from ListUserSerializer.

    Attributes:
        - owner (ListUserSerializer): Serializer for the owner of the project (read-only).
        - images (ProjectImageSerializer): Serializer for the images associated with the project (many, read-only).
        - tags (TagSerializer): Serializer for the tags associated with the project (many, read-only).

    Meta:
        - model (Project): The model class to be serialized.
        - fields (list): The fields to include in the serialization.

    """
    owner = ListUserSerializer(read_only=True)
    images = ProjectImageSerializer(many=True, read_only=True)
    tags = TagSerializer(many=True, read_only=True)

    class Meta:
        model = Project
        fields = ["id", "owner", "title", "description", "source_code_link", "live_version_link", "images", "tags"]


class ProjectSerializer(serializers.ModelSerializer):
    """
    Class to serialize and deserialize Project data.

    Attributes:
        - owner (ListUserSerializer): Serializer for the owner field.
        - images (ProjectImageSerializer): Serializer for the images field.
        - tags (TagSerializer): Serializer for the tags field.

    Methods:
        - create(validated_data): Create a new Project instance with the given validated data
            and return the created instance.
        - update(instance, validated_data): Update an existing Project instance with the
            given validated data and return the updated instance.
    """
    owner = ListUserSerializer(read_only=True)
    images = ProjectImageSerializer(many=True, required=False)
    tags = TagSerializer(many=True, required=False)

    class Meta:
        model = Project
        fields = ["id", "owner", "title", "description", "source_code_link", "live_version_link", "images", "tags"]

    def create(self, validated_data):
        tags_data = validated_data.pop("tags", [])
        images_data = self.context["request"].FILES.getlist("images")
        project = Project.objects.create(**validated_data)
        tags = []

        for tag_name in tags_data:
            tag = Tag.objects.get(name__iexact=tag_name.name)
            tags.append(tag)

        project.tags.set(tags)

        images = []
        for image in images_data:
            img = ProjectImage(project=project, image=image)
            images.append(img)

        ProjectImage.objects.bulk_create(images)

        project.tags.set(tags)

        return project

    def update(self, instance, validated_data):
        new_tag_names = validated_data.pop("tags", [])
        new_tags = []
        for tag_name in new_tag_names:
            tag = Tag.objects.get(name__iexact=tag_name.name)
            new_tags.append(tag)

        instance.tags.set(new_tags)

        new_images = self.context["request"].FILES.getlist("images")

        current_image_ids = [image.id for image in instance.images.all()]
        incoming_images_ids = [int(img["id"]) for img in new_images if "id" in img]
        images_to_delete = set(current_image_ids) - set(incoming_images_ids)

        ProjectImage.objects.filter(id__in=images_to_delete).delete()

        for image in new_images:
            if "id" in image:
                image_instance = ProjectImage.objects.get(id=int(image.get("id")))

                for attr, value in image.items():
                    setattr(image_instance, attr, value)

                image_instance.save()
            else:
                ProjectImage.objects.create(project=instance, image=image)

        for attr, value in validated_data.items():
            setattr(instance, attr, value)

        instance.save()

        return instance
