from rest_framework import permissions


class IsOwnerOrReadOnly(permissions.BasePermission):
    """
    Class: IsOwnerOrReadOnly

    A custom permission class that allows only the owner of an object to make changes, while allowing read-only access to others.

    Methods:
        - has_object_permission(self, request, view, obj):
            Determines whether the user has the necessary permissions to perform the requested action on the object.

    Attributes:
        - None

    """
    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True

        return obj.owner == request.user


class ParticipatedInCourse(permissions.BasePermission):
    """
    Class ParticipatedInCourse(permissions.BasePermission):

        This class is used to determine whether a user has participated in a course or not.

        Attributes:
            - message (str): The error message to be returned if the user has not participated in the course.

        Methods:
            - has_object_permission(request, view, course):
                    Checks whether the course has been completed and the user is enrolled in it.

        """
    message = "Kurs się nie zakończył, lub nie jesteś jego członkiem."

    def has_object_permission(self, request, view, course):
        return course.completed and course.enrollments.filter(student=request.user, is_active=True)
