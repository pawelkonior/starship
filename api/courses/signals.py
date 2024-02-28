from datetime import timedelta
from logging import getLogger

from django.contrib.auth import get_user_model
from django.contrib.auth.signals import user_logged_in
from django.db.models.signals import post_save
from django.dispatch import receiver
from django.utils.timezone import now

from courses.models import ScoreChange

user_model = get_user_model()

logger = getLogger(__name__)


NEW_USER_SCORE = 100
WEEKLY_SCORE_INCREASE = 50


@receiver(post_save, sender=user_model)
def create_score_for_new_user(sender, instance, created, **kwargs):
    """

    create_score_for_new_user(sender, instance, created, **kwargs)

    This method is a receiver that listens for post_save signals from the user_model. It creates a score entry for a new user and assigns them an initial score.

    Parameters:
        - sender: The sender of the signal.
        - instance: The instance of the user_model that triggered the signal.
        - created: A flag indicating whether the user instance was created or updated.
        - kwargs: Additional keyword arguments.

    Returns:
        This method does not return any value.


    """
    if created:
        logger.info(f"Score.Register - {instance}")
        ScoreChange.objects.create(user=instance, amount=NEW_USER_SCORE, description="Rejestracja")


@receiver(user_logged_in)
def update_user_score(sender, user, **kwargs):
    """
    Updates the user's score based on the weekly score increase.

    Parameters:
        - sender (object): The sender of the signal.
        - user (User): The user whose score needs to be updated.
        - kwargs (dict): Additional keyword arguments.

    Returns:
        - None

    """
    today = now().date()
    last_monday = today + timedelta(days=-today.weekday())
    next_monday = today + timedelta(days=-today.weekday(), weeks=1)
    if ScoreChange.objects.filter(user=user, created_at__gte=last_monday, created_at__lt=next_monday).exists():
        logger.warning(f"Score.Login.Exists - {user}")
        return

    logger.warning(f"Score.Login.New - {user}")
    ScoreChange.objects.create(user=user, amount=WEEKLY_SCORE_INCREASE, description="Bonus za logowanie")
