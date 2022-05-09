from django.urls import path, include
from socketio_app.views import index

urlpatterns = [
    path('', index, name="index")
]
