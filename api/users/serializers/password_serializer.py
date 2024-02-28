from rest_framework import serializers
from django.contrib.auth.password_validation import validate_password
from django.contrib.auth import get_user_model

CustomUser = get_user_model()


class ChangePasswordSerializer(serializers.Serializer):
    """

    ChangePasswordSerializer

    Serializer class used for validating and processing password change request.

    Attributes:
        - old_password (CharField): The current password of the user.
        - new_password (CharField): The desired new password of the user.
        - confirm_new_password (CharField): The confirmation of the new password.

    Methods:
        - validate(attrs): Custom validation method that verifies that the new password and confirmation are the same.

    """
    old_password = serializers.CharField(required=True)
    new_password = serializers.CharField(required=True, validators=[validate_password])
    confirm_new_password = serializers.CharField(required=True)

    def validate(self, attrs):
        new_password = attrs.get('new_password')
        confirm_new_password = attrs.get('confirm_new_password')
        if new_password != confirm_new_password:
            raise serializers.ValidationError("Hasła muszą być takie same.")
        return super().validate(attrs)


class RequestPasswordResetSerializer(serializers.Serializer):
    """
    RequestPasswordResetSerializer

    A serializer class for validating and serializing requests to reset user passwords.

    Attributes:
        - email (EmailField): The email field for the user to reset password.

    Methods:
        - validate_email(value)
    """
    email = serializers.EmailField(required=True)

    def validate_email(self, value):
        try:
            CustomUser.objects.get(email=value)
        except CustomUser.DoesNotExist:
            raise serializers.ValidationError("Nie ma użytkownika o podanym adresie email.")
        return value


class PasswordResetConfirmSerializer(serializers.Serializer):
    """

    Class: PasswordResetConfirmSerializer

    Serializer for confirming a password reset.

    Attributes:
        - password (CharField): Required field for the new password. Must have a minimum length of 8 characters. Uses the validate_password validator.
        - password2 (CharField): Required field for confirming the new password. Must have a minimum length of 8 characters.

    Methods:
        - validate(attrs): Custom validation method to check if the passwords match. Raises a ValidationError if they don't match.

    """
    password = serializers.CharField(required=True, min_length=8, validators=[validate_password])
    password2 = serializers.CharField(required=True, min_length=8)

    def validate(self, attrs):
        password = attrs.get('password')
        password2 = attrs.get('password2')
        if password != password2:
            raise serializers.ValidationError("Hasła muszą być takie same.")
        return attrs
