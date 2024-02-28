from rest_framework import serializers
from django.contrib.auth import get_user_model


class UserSerializer(serializers.ModelSerializer):
    """

    UserSerializer

    Serializes and deserializes User instances into JSON representation.

    Attributes:
        - full_name (serializers.CharField): A CharField that represents the full name of the user.
        - bio (serializers.CharField): A CharField that represents the biography of the user.

    Meta:
        - model: The User model to be used for serialization.
        - fields: The fields of the User model to be included in the serialization.

    """
    full_name = serializers.CharField(source="get_full_name", required=False, read_only=True)
    bio = serializers.CharField(max_length=500, required=False)

    class Meta:
        model = get_user_model()
        fields = ["id", "email", "first_name", "last_name", "full_name", "score", "bio", "avatar"]


class ListUserSerializer(serializers.ModelSerializer):
    """

    Class: ListUserSerializer

    This class is used to serialize the user model for listing users. It extends the ModelSerializer class provided by the serializers module.

    Attributes:
        - full_name (CharField): A character field that represents the user's full name. It is sourced from the "get_full_name" method of the user model, and is not required and read-only.

    Meta Attributes:
        - model: Represents the user model used for serialization.
        - fields: A list of fields to include in the serialized output. It includes the user's ID, first name, last name, full name, bio, and avatar.

    """
    full_name = serializers.CharField(source="get_full_name", required=False, read_only=True)

    class Meta:
        model = get_user_model()
        fields = ["id", "first_name", "last_name", "full_name", "bio", "avatar"]
