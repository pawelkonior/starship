from rest_framework import serializers

from job_posts.models import Company, JobPost


class CompanySerializer(serializers.ModelSerializer):
    """
    Class for serializing Company model.

    Attributes:
        - model: The model used for serialization.
        - fields: The fields to be included in the serialized data.
        - read_only_fields: The fields that are read-only and cannot be updated.

    """
    class Meta:
        model = Company
        fields = ["id", "company_name", "company_address", "phone_number", "website", "is_verified"]
        read_only_fields = ["id"]


class JobPostSerializer(serializers.ModelSerializer):
    """
    JobPostSerializer

    Serializer class for serializing/deserializing JobPost objects.

    JobPostSerializer is a subclass of ModelSerializer from the `serializers` module of the Django REST Framework. It provides a convenient way to serialize and deserialize JobPost objects.

    Attributes:
        - company (CompanySerializer): A nested serializer used to serialize the related Company object.

    Meta class:
        - model (JobPost): Specifies the model to be serialized/deserialized.
        - fields (list): Specifies the fields to be included in the serialized output.
        - read_only_fields (list): Specifies the fields that should be read-only when deserializing.

    """
    company = CompanySerializer(read_only=True)

    class Meta:
        model = JobPost
        fields = [
            "id",
            "title",
            "description",
            "company",
            "employment_type",
            "location",
            "salary_low",
            "salary_high",
            "posting_date",
            "expiration_date",
            "experience",
            "position",
        ]
        read_only_fields = ["id", "company"]
