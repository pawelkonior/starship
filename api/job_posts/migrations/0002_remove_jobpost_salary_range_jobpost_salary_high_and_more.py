# Generated by Django 4.2.10 on 2024-04-14 09:41

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("job_posts", "0001_initial"),
    ]

    operations = [
        migrations.RemoveField(
            model_name="jobpost",
            name="salary_range",
        ),
        migrations.AddField(
            model_name="jobpost",
            name="salary_high",
            field=models.DecimalField(
                blank=True, decimal_places=2, max_digits=10, null=True
            ),
        ),
        migrations.AddField(
            model_name="jobpost",
            name="salary_low",
            field=models.DecimalField(
                blank=True, decimal_places=2, max_digits=10, null=True
            ),
        ),
    ]
