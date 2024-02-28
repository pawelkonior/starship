from django.db.models import Q
from django.db.models.functions import Now
from django_filters import rest_framework as filters
from .models import Course


class CourseFilter(filters.FilterSet):
    """
    CourseFilter class is a subclass of filters.FilterSet and is used to filter Course objects based on various criteria.

    Attributes:
        - owner__full_name: A CharFilter used to filter courses based on the full name of the owner.
        - upcoming: A BooleanFilter used to filter courses based on whether they are upcoming or not.

    Meta:
        - model: The model class that the CourseFilter is used to filter.
        - fields: A dictionary specifying the fields and the available filters for each field.

    Methods:
        - filter_full_name(queryset, lookup, full_name): This method is called by the owner__full_name filter. It filters the queryset by splitting the full_name input into individual name parts and creating queries to match any part of the name with owner's first name or last name. The method returns the filtered queryset.

        - filter_upcoming(queryset, lookup, upcoming): This method is called by the upcoming filter. It filters the queryset based on whether the course_date is greater than or equal to the current date and time if upcoming is True. If upcoming is False, it returns the original queryset.

    """
    owner__full_name = filters.CharFilter(method="filter_full_name")
    upcoming = filters.BooleanFilter(method="filter_upcoming", field_name="upcoming")

    class Meta:
        model = Course
        fields = {
            "tags__name": ["icontains"],
            "duration": ["exact", "gt", "lt", "range"],
            "owner__first_name": ["icontains"],
            "owner__last_name": ["icontains"],
            "title": ["icontains"],
            "course_date": ["exact", "range", "gt", "lt"],
            "created_at": ["exact", "range", "gt", "lt"],
        }

    def filter_full_name(self, queryset, lookup, full_name):
        name_parts = full_name.split()

        queries = [Q(owner__first_name__icontains=part) | Q(owner__last_name__icontains=part) for part in name_parts]

        return queryset.filter(queries.pop())

    def filter_upcoming(self, queryset, lookup, upcoming):
        if upcoming:
            return queryset.filter(course_date__gte=Now())
        return queryset
