# Generated by Django 4.2.10 on 2024-03-01 13:19

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name="Course",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                (
                    "created_at",
                    models.DateTimeField(auto_now_add=True, verbose_name="Stworzony"),
                ),
                ("title", models.CharField(max_length=200, verbose_name="Tytuł")),
                ("description", models.TextField(verbose_name="Opis")),
                ("duration", models.IntegerField(verbose_name="Czas trwania")),
                (
                    "course_date",
                    models.DateTimeField(null=True, verbose_name="Dzień i godzina"),
                ),
                (
                    "is_active",
                    models.BooleanField(default=True, verbose_name="Aktywny"),
                ),
                (
                    "owner",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.DO_NOTHING,
                        related_name="courses",
                        to=settings.AUTH_USER_MODEL,
                        verbose_name="Twórca",
                    ),
                ),
            ],
            options={
                "verbose_name": "Kurs",
                "verbose_name_plural": "Kursy",
            },
        ),
        migrations.CreateModel(
            name="Enrollment",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                (
                    "enrollment_date",
                    models.DateTimeField(auto_now_add=True, verbose_name="Data zapisu"),
                ),
                (
                    "is_active",
                    models.BooleanField(default=True, verbose_name="Zapisany"),
                ),
                (
                    "course",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="enrollments",
                        to="courses.course",
                        verbose_name="Kurs",
                    ),
                ),
                (
                    "student",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="enrollments",
                        to=settings.AUTH_USER_MODEL,
                        verbose_name="Student",
                    ),
                ),
            ],
            options={
                "unique_together": {("course", "student")},
            },
        ),
    ]
