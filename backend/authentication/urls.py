from django.urls import path, include
from rest_framework.routers import DefaultRouter

from authentication import views
from authentication.views import RegisterView, LoginView,LogoutView

router = DefaultRouter()


urlpatterns = [
    path('/register/', RegisterView.as_view(), name='register'),
    path('/login/', LoginView.as_view(), name='login'),
    path('/logout/', LogoutView.as_view(), name='logout'),
]