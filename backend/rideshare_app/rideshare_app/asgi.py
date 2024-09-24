"""
ASGI config for rideshare_app project.

It exposes the ASGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/5.1/howto/deployment/asgi/
"""

import os
from channels.routing import ProtocolTypeRouter, URLRouter
from django.core.asgi import get_asgi_application
from channels.auth import AuthMiddlewareStack
from django.core.asgi import get_asgi_application
from rideshare_app import middleware

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'rideshare_app.settings')

django_asgi_application = get_asgi_application()

import app.routing

application = ProtocolTypeRouter({
    "http": django_asgi_application,
    "websocket": middleware.TokenAuthMiddlewareStack(
        URLRouter(
            app.routing.websocket_urlpatterns
        )
    ),
})
