from django.contrib.auth.models import AbstractUser
from django.db import models


class CustomUser(AbstractUser):
    avatar = models.FileField(upload_to="avatars/")
    credits = models.IntegerField(default=0)

    USERNAME_FIELD = "username"

    def __str__(self):
        return self.username

