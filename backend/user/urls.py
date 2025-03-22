from django.urls import path, include
from rest_framework.routers import DefaultRouter

from user import views
from user.views import RegisterView, LoginView,LogoutView,VerifyToken

router = DefaultRouter()


urlpatterns = [
    path('/register/', RegisterView.as_view(), name='register'),
    path('/login/', LoginView.as_view(), name='login'),
    path('/logout/', LogoutView.as_view(), name='logout'),
    path('/me/', VerifyToken.as_view(), name='verify_token'),
]