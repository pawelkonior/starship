from django.db.models import Q
from django_filters import rest_framework as filters
from .models import Company, JobPost


class JobPostFilter(filters.FilterSet):
    """

    JobPostFilter is a subclass of FilterSet and is used to filter objects of the JobPost model based on various fields.

    Attributes:
        - owner__full_name: A CharFilter that is used to filter by the full name of the job post owner.

    Meta class:
        - The Meta class is used to define the model and fields to be filtered.

    Methods:
        - filter_full_name(self, queryset, lookup, full_name): A method that filters the queryset by the full name of the job post owner. It splits the full name into parts and creates a list of queries for each part. It then applies the queries using the Q object and returns the filtered queryset.


    """
    owner__full_name = filters.CharFilter(method="filter_full_name")

    class Meta:
        model = JobPost
        fields = {
            "title": ["icontains"],
            "description": ["icontains"],
            "employment_type": ["icontains"],
            "company__company_name": ["icontains"],
            "location": ["icontains"],
            "salary_high": ["exact", "gt", "lt", "range"],
            "salary_low": ["exact", "gt", "lt", "range"],
            "posting_date": ["exact", "gt", "lt", "range"],
            "expiration_date": ["exact", "gt", "lt", "range"],
            "experience": ["icontains"],
            "position": ["icontains"]
        }

    def filter_full_name(self, queryset, lookup, full_name):
        name_parts = full_name.split()

        queries = [Q(owner__first_name__icontains=part) | Q(owner__last_name__icontains=part) for part in name_parts]

        return queryset.filter(queries.pop())


class CompanyFilter(filters.FilterSet):
    """A class representing a filter for the Company model.

    This class is used to filter instances of the Company model based on the specified fields.

    Attributes:
        - Meta (subclass): A subclass containing metadata about the filter.

    """
    class Meta:
        model = Company
        fields = {
            "company_name": ["icontains"],
            "company_address": ["icontains"]
        }
