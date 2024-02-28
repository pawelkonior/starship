from django.contrib.auth.tokens import PasswordResetTokenGenerator
from django.core.mail import send_mail
from django.utils.encoding import force_bytes
from django.utils.http import urlsafe_base64_encode


def get_base_url(request):
    """
    Returns the base URL for the given request.

    Parameters:
        request (HttpRequest): The request object.

    Returns:
        str: The base URL as a string.

    """
    return request.build_absolute_uri("/")[:-1]


def generate_activation_link(request, user, token):
    """
    Generate an activation link for a user.

    Parameters:
        - request (Any): The current request object.
        - user (User): The user object.
        - token (str): The activation token string.

    Returns:
        - str: The activation link.

    """
    uid = urlsafe_base64_encode(force_bytes(user.pk))

    base_url = get_base_url(request)
    activation_link = f'{base_url}/activate/{uid}/{token}/'

    return activation_link


def send_confirmation_email(email, activation_link):
    """
    Send a confirmation email to the specified email address with the activation link.

    Parameters:
        - email (str): The email address to which the confirmation email should be sent.
        - activation_link (str): The activation link that the user needs to click to activate their account.

    Returns:
        None
    """
    subject = "Aktywuj konto Starship"
    message = f"Dziękujemy za rejestrację w Starship. Kliknij w poniższy link, aby aktywować swoje konto: \n\n{activation_link}"
    from_email = "noreply@starship.pl"

    send_mail(subject, message, from_email, [email])


def send_password_reset_email(email, activation_link):
    """Sends a password reset email to the specified email address.

    Parameters:
        - email (str): The email address of the user who requested the password reset.
        - activation_link (str): The activation link that allows the user to reset their password.

    Returns:
        None

    """
    subject = "Resetujesz hasło do konta Starship"
    message = (f"Na ten adres mailowy zgłoszono prośbę o zmianę hasła. Jeśli to nie Ty, zignoruj niniejszego maila. \n\n"
               f"W celu zresetowania hasła, kliknij w poniższy link: \n\n{activation_link}")
    from_email = "noreply@starship.pl"

    send_mail(subject, message, from_email, [email])


class AccountActivationTokenGenerator(PasswordResetTokenGenerator):
    """
    AccountActivationTokenGenerator

    This class is responsible for generating account activation tokens.

    Attributes:
        None

    Methods:
        - _make_hash_value(user, timestamp)
            Generates a hash value for the given user and timestamp.

    """
    def _make_hash_value(self, user, timestamp):
        return str(user.pk) + str(timestamp) + str(user.is_active)

account_activation_token_generator = AccountActivationTokenGenerator()
