from django.urls import path, include
from rest_framework.routers import DefaultRouter

from driver_logs import views

router = DefaultRouter()


router.register(r'', views.LogsView, basename='logs')

urlpatterns = [
    path('/', include(router.urls)),
]