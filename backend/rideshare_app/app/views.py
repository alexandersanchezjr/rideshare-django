from django.contrib.auth import get_user_model
from django.db.models import Q
from rest_framework import generics, permissions, viewsets
from serializers import UserSerializer, NestedTripSerializer, LoginSerializer
from models import Trip
from rest_framework_simplejwt.views import TokenObtainPairView


class SignupApiView(generics.CreateAPIView):
    """
    Sign up api view
    """
    queryset = get_user_model().objects.all()
    serializer_class = UserSerializer


class LoginApiView(TokenObtainPairView):
    """
    Login api view with jwt token
    """
    serializer_class = LoginSerializer


class TripView(viewsets.ReadOnlyModelViewSet):
    lookup_field = 'id'
    lookup_url_kwarg = 'trip_id'
    permission_classes = (permissions.IsAuthenticated,)
    serializer_class = NestedTripSerializer

    def get_queryset(self):
        user = self.request.user
        if user.group == 'driver':
            return Trip.objects.filter(
                Q(status=Trip.REQUESTED) | Q(driver=user)
            )
        if user.group == 'rider':
            return Trip.objects.filter(rider=user)
        return Trip.objects.none()


"""
users can participate in trips in one of two ways – they either drive the 
cars or they ride in them. A rider initiates the trip with a request, which 
is broadcast to all available drivers. A driver starts a trip by accepting the 
request. At this point, the driver heads to the pick-up address. The rider is instantly 
alerted that a driver has started the trip and other drivers are notified that the trip 
is no longer up for grabs.
"""