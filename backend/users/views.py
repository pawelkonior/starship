from django.contrib.auth import get_user_model
from django.shortcuts import render, get_object_or_404
from rest_framework import generics
from . import serializers


class RequestUserPortfolioView(generics.RetrieveAPIView):
    serializer_class = serializers.UserPortfolioSerializer

    def get_object(self):
        return get_object_or_404(
            get_user_model().objects.prefetch_related(
                "projects",
                "courses",
                "enrolled_courses"), pk=self.request.user.id
        )


class UserPortfolioView(generics.RetrieveAPIView):
    serializer_class = serializers.UserPortfolioSerializer
    queryset = get_user_model().objects.all()
