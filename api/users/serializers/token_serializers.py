from typing import Dict, Any

from django.contrib.auth import user_logged_in
from rest_framework_simplejwt import serializers


class CustomTokenObtainPairSerializer(serializers.TokenObtainPairSerializer):
    """

    CustomTokenObtainPairSerializer

    A custom subclass of `serializers.TokenObtainPairSerializer` that adds additional functionality during validation.

    Methods:
        - validate(attrs: dict) -> dict:
            Validates the input attributes and returns the validated data.

    Attributes:
        - None

    """
    def validate(self, attrs: Dict[str, Any]) -> Dict[str, str]:
        result = super().validate(attrs)
        user_logged_in.send(sender=self.__class__, user=self.user)
        return result
