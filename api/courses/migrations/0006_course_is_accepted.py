# Generated by Django 4.2.10 on 2024-04-17 10:08

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("courses", "0005_course_agenda_course_image"),
    ]

    operations = [
        migrations.AddField(
            model_name="course",
            name="is_accepted",
            field=models.BooleanField(
                default=False,
                help_text="Czy kurs został zaakceptowany przez administratora?",
                verbose_name="Czy zaakceptowano?",
            ),
        ),
    ]