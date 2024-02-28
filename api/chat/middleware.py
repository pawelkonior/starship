from channels.db import database_sync_to_async
from django.contrib.auth import get_user_model
from django.contrib.auth.models import AnonymousUser
from urllib.parse import parse_qs

from rest_framework_simplejwt.exceptions import TokenError
from rest_framework_simplejwt.tokens import UntypedToken


@database_sync_to_async
def get_user_from_token(user_id):
    """Get the user from the provided token.

    Parameters:
        - user_id (int): The ID of the user.

    Returns:
        - user (User): The user object associated with the provided user ID, if found.
        - AnonymousUser: An instance of AnonymousUser if the user with the provided ID does not exist in the database.

    """
    user = get_user_model()

    try:
        return user.objects.get(pk=user_id)
    except user.DoesNotExist:
        return AnonymousUser()


class TokenAuthMiddleware:
    """
    A middleware class that performs token authentication before calling the application.

    Attributes:
        - app: The application to call after performing token authentication.

    Methods:
        - __init__(self, app):
            Initializes the TokenAuthMiddleware object.

        - __call__(self, scope, receive, send):
            Performs token authentication and calls the application.

    """
    def __init__(self, app):
        self.app = app

    async def __call__(self, scope, receive, send):
        params = parse_qs(scope["query_string"])
        user_token = params.get(b"token", [])

        if not user_token:
            scope["user"] = AnonymousUser()
            return await self.app(scope, receive, send)

        try:
            untyped_token = UntypedToken(user_token[0])
        except TokenError:
            scope["user"] = AnonymousUser()
            return await self.app(scope, receive, send)

        user_id = untyped_token.get("user_id", None)

        scope["user"] = await get_user_from_token(user_id)

        return await self.app(scope, receive, send)
