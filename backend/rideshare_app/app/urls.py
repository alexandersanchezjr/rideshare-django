from django.urls import path, include
from . import views
from rest_framework_simplejwt.views import TokenRefreshView


urlpatterns = [
    path('v1/signup', views.SignupApiView.as_view(), name="sign_up"),
    path('v1/login', views.LoginApiView.as_view(), name="login"),
    path('v1/token/refresh', TokenRefreshView.as_view(), name="token_refresh"),
    path('v1/trip', views.TripView.as_view({'get': 'list'}), name='trip_list'),
    path('v1/trip/<uuid:trip_id>', views.TripView.as_view({'get': 'retrieve'}), name="trip_detail")
]