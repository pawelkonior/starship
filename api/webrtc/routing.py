from django.urls import path

from . import consumers

websocket_urlpatterns = [
    path('ws/courses/<str:course_pk>/', consumers.WebRtcConsumer.as_asgi()),
]
