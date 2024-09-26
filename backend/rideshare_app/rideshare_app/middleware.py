from urllib.parse import parse_qs
from django.contrib.auth import get_user_model
from django.contrib.auth.models import AnonymousUser
from django.db import close_old_connections
from channels.auth import AuthMiddlewareStack
from rest_framework_simplejwt.tokens import AccessToken
from channels.db import database_sync_to_async

User = get_user_model()


class TokenMiddleware:
    """
    Token middleware
    """

    def __init__(self, inner):
        self.inner = inner

    async def __call__(self, scope, receive, send):
        close_old_connections()
        query_strings = parse_qs(scope['query_string'].decode())
        token = query_strings.get('token')
        if not token:
            scope['user'] = AnonymousUser()
            return self.inner(scope, receive, send)
        try:
            access_token = AccessToken(token[0])
            user_id = access_token.payload['id']
            user = await self._get_user_by_id(user_id)
        except Exception as exception:
            print('Exception: ', exception)
            scope['user'] = AnonymousUser()
            return await self.inner(scope, receive, send)
        if not user.is_active:
            scope['user'] = AnonymousUser()
            return await self.inner(scope, receive, send)
        scope['user'] = user
        return await self.inner(scope, receive, send)

    @database_sync_to_async
    def _get_user_by_id(self, user_id):
        return User.objects.get(id=user_id)

def TokenAuthMiddlewareStack(inner):
    """
    Our new middleware class plucks the JWT access token from the query string and retrieves the associated user. Once
    the WebSocket connection is opened, all messages can be sent and received without verifying the user again. Closing
    the connection and opening it again requires re-authorization.
    :param inner:
    :return:
    """
    return TokenMiddleware(AuthMiddlewareStack(inner))