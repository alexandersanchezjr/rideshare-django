from channels.routing import ProtocolTypeRouter, URLRouter
from django.urls import path
from rideshare_app import middleware
import app.routing
import django

django.setup()

application = ProtocolTypeRouter({
    "websocket": middleware.TokenAuthMiddlewareStack(URLRouter(
        app.routing.websocket_urlpatterns
    ))
})