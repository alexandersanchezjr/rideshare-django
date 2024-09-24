from channels.routing import ProtocolTypeRouter, URLRouter
from django.core.asgi import get_asgi_application
from rideshare_app import middleware
import app.routing
import django

django.setup()

django_asgi_app = get_asgi_application()

application = ProtocolTypeRouter({
    "http": django_asgi_app,
    "websocket": middleware.TokenAuthMiddlewareStack(URLRouter(
        app.routing.websocket_urlpatterns
    ))
})