from django.urls import path
from . import consumers

websocket_urlpatterns = [
    path('ws/rideshare/', consumers.RideConsumer.as_asgi()),
]
