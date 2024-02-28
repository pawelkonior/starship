from rest_framework import permissions


class IsUserOrAdminUser(permissions.BasePermission):
    """
    Class: IsUserOrAdminUser

    This class is a custom permission class that determines whether a user has permission to access an object.

    Methods:
    - has_object_permission(self, request, view, obj): Determines whether the current user has permission to access the given object.

    """
    def has_object_permission(self, request, view, obj):
        return obj == request.user or request.user.is_superuser


class IsAdminUserOrIsStaff(permissions.BasePermission):
    """
    The IsAdminUserOrIsStaff class is a subclass of the BasePermission class from the permissions module in Django.

    This class checks whether a user has permission to access a particular view based on whether the user is either an admin user or a staff member.

    Methods:
        - has_permission(request, view): This method is called to check if the user has permission to access the view. It returns True if the user is either an admin user or a staff member, and False otherwise.

    """
    def has_permission(self, request, view):
        return request.user.is_staff or request.user.is_superuser
