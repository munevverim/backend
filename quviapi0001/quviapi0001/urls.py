from django.contrib import admin
from django.urls import path, include
from django.conf.urls.static import static

urlpatterns = [
    path("", include("quviapi.urls")),
    path("social-auth/", include("social_django.urls", namespace="social")),
]