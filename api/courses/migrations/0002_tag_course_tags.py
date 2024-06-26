# Generated by Django 4.2.10 on 2024-04-12 18:17

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("courses", "0001_initial"),
    ]

    operations = [
        migrations.CreateModel(
            name="Tag",
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
                ("name", models.CharField(max_length=200, unique=True)),
            ],
        ),
        migrations.AddField(
            model_name="course",
            name="tags",
            field=models.ManyToManyField(
                blank=True, to="courses.tag", verbose_name="Tagi"
            ),
        ),
    ]
