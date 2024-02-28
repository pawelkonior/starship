from rest_framework import serializers
from django.contrib.auth import get_user_model


class RegistrationSerializer(serializers.ModelSerializer):
    """

    RegistrationSerializer

    Serializes and deserializes user registration data.

    Attributes:
        - password (serializers.CharField): Field for user password.
        - password_confirmation (serializers.CharField): Field for password confirmation.

    Methods:
        - validate(data): Validates the registration data.
        - create(validated_data): Creates a new user with the provided registration data.

    """

    password = serializers.CharField(
        max_length=128,
        min_length=8,
        write_only=True,
    )
    password_confirmation = serializers.CharField(
        max_length=128,
        min_length=8,
        write_only=True,
    )

    class Meta:
        model = get_user_model()
        fields = ["email", "first_name", "last_name", "password", "password_confirmation"]
        required_fields = ["email", "first_name", "last_name", "password", "password_confirmation"]

    def validate(self, data):
        if data["password"] != data["password_confirmation"]:
            raise serializers.ValidationError({"password": "Password fields didn't match."})
        return data

    def create(self, validated_data):
        validated_data.pop("password_confirmation")
        return get_user_model().objects.create_user(username=validated_data.get("email"), **validated_data)
