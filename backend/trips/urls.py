from django.urls import path, include
from rest_framework.routers import DefaultRouter

from trips import views

router = DefaultRouter()


router.register(r'', views.TripViewSet)

urlpatterns = [
    path('/', include(router.urls)),
]