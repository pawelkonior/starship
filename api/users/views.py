from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError
from django.utils.http import urlsafe_base64_decode, urlsafe_base64_encode
from django.utils.encoding import force_str, force_bytes
from django.urls import reverse
from rest_framework import views, status, permissions
from rest_framework.generics import get_object_or_404
from rest_framework.response import Response
from rest_framework_simplejwt.authentication import JWTAuthentication

from .exceptions import InvalidUserID, InvalidActivationToken, AlreadyActive
from .permissions import IsUserOrAdminUser
from .serializers import ChangePasswordSerializer, PasswordResetConfirmSerializer, RequestPasswordResetSerializer
from .utils import send_confirmation_email, send_password_reset_email, account_activation_token_generator

CustomUser = get_user_model()


class AccountActivationView(views.APIView):
    """

    Class: AccountActivationView

    An APIView class for activating user accounts.

    Attributes:
        - permission_classes: A tuple containing the permission classes for the view. By default, it allows any user to access the view.

    Methods:
        - get: Handles the GET request for activating a user account.
          Parameters:
            - request: The request object.
            - uidb64: The user ID encoded in base64.
            - token: The activation token.
            - *args: Additional positional arguments.
            - **kwargs: Additional keyword arguments.
          Raises:
            - InvalidUserID: If the user ID is invalid.
            - AlreadyActive: If the account is already active.
            - InvalidActivationToken: If the activation token is not valid.
          Returns:
            - A response containing a success message if the account is activated successfully.

    """

    permission_classes = (permissions.AllowAny,)

    def get(self, request, uidb64=None, token=None, *args, **kwargs):
        try:
            uid = force_str(urlsafe_base64_decode(uidb64))
            user = get_object_or_404(CustomUser, pk=uid)
        except (TypeError, ValueError, OverflowError, CustomUser.DoesNotExist):
            raise InvalidUserID("Invalid user ID.")

        if user.is_active:
            raise AlreadyActive("Account is already active.")

        if not account_activation_token_generator.check_token(user, token):
            raise InvalidActivationToken("The token is not valid.")

        user.is_active = True
        user.save()

        return Response({"message": "Account activated successfully."}, status=status.HTTP_200_OK)


class ChangePasswordView(views.APIView):
    """
    ChangePasswordView

    API view for changing the password of a user.

    Attributes:
        - permission_classes (list): List of permission classes applied to the view.
        - authentication_classes (list): List of authentication classes applied to the view.

    Methods:
        - patch(request, *args, **kwargs):
                Patch method for changing the password.
                Args:
                    request (HttpRequest): The HTTP request object.
                    *args: Variable length argument list.
                    **kwargs: Arbitrary keyword arguments.
                Returns:
                    Response: HTTP response with the result of the password change.
                Raises:
                    N/A
    """

    permission_classes = [IsUserOrAdminUser]
    authentication_classes = [JWTAuthentication]

    def patch(self, request, *args, **kwargs):
        user = request.user
        serializer = ChangePasswordSerializer(data=request.data)
        if serializer.is_valid():
            old_password = serializer.validated_data.get("old_password")
            new_password = serializer.validated_data.get("new_password")

            if not user.check_password(old_password):
                return Response({"error": "Stare hasło jest nieprawidłowe."}, status=status.HTTP_400_BAD_REQUEST)

            user.set_password(new_password)
            user.save()

            return Response({"success": "Hasło zostało zmienione."}, status=status.HTTP_200_OK)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class PasswordResetRequestView(views.APIView):
    """
    The PasswordResetRequestView class is a view that handles the password reset request functionality.

    Attributes:
        - permission_classes (tuple): A tuple of permission classes. In this case, it allows any user to access the view.

    Methods:
        - post(request):
                Handles the HTTP POST request to initiate a password reset.

                Parameters:
                    request (HttpRequest): The request object containing the POST data.

                Returns:
                    Response: A response object with a message indicating that a password reset email has been sent.


    """

    permission_classes = (permissions.AllowAny,)

    def post(self, request):
        serializer = RequestPasswordResetSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        email = serializer.validated_data["email"]
        user = get_object_or_404(CustomUser, email=email)

        token = account_activation_token_generator.make_token(user)
        uid = urlsafe_base64_encode(force_bytes(user.pk))

        reset_link = request.build_absolute_uri(
            reverse("users:reset_password_confirm", kwargs={"uidb64": uid, "token": token})
        )

        send_password_reset_email(user.email, reset_link)

        return Response({"message": "Wysłano e-maila do zresetowania hasła."}, status=status.HTTP_200_OK)


class PasswordResetConfirmView(views.APIView):
    """
    The PasswordResetConfirmView class is responsible for handling the POST request to reset a user's password.

    Attributes:
        - permission_classes: A tuple of permission classes that determines the access level for this view. In this case, it allows any user to access this view.

    Methods:
     - post(self, request, uidb64, token): Handles the POST request to reset the password. It takes in the request object, uidb64, and token as parameters.

            Parameters:
            - request: The HTTP request object.
            - uidb64: The base64 encoded string representing the user's ID.
            - token: The token used for password reset.

            Returns:
            - If uidb64 or token is missing, it will return a JSON response with an error message and HTTP status code 400 (Bad Request).
            - If the uidb64 is invalid, it will return a JSON response with an error message and HTTP status code 400 (Bad Request).
            - If the user with the provided ID does not exist, it will return a JSON response with an error message and HTTP status code 400 (Bad Request).
            - If the token is invalid, it will return a JSON response with an error message and HTTP status code 400 (Bad Request).
            - If the provided data is valid, it will deserialize the request data using the PasswordResetConfirmSerializer, set the user's password, and save the user. It will then return a JSON response with a success message and HTTP status code 200 (OK).
    """

    permission_classes = (permissions.AllowAny,)

    def post(self, request, uidb64, token):
        if not uidb64 or not token:
            return Response({"error": "Token i UID są wymagane."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            uid = force_str(urlsafe_base64_decode(uidb64))
        except (TypeError, ValueError, OverflowError):
            return Response({"error": "Nieprawidłowe UID."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            user = CustomUser.objects.get(pk=uid)
        except CustomUser.DoesNotExist:
            return Response({"error": "Nie ma użytkownika z takim UID."}, status=status.HTTP_400_BAD_REQUEST)

        if not account_activation_token_generator.check_token(user, token):
            return Response(
                {"error": "Link do resetowania hasła jest nieprawidłowy."}, status=status.HTTP_400_BAD_REQUEST
            )

        serializer = PasswordResetConfirmSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        password = serializer.validated_data["password"]

        user.set_password(password)
        user.save()

        return Response({"message": "Hasło zostało pomyślnie zresetowane."}, status=status.HTTP_200_OK)
