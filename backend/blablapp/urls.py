from django.urls import path
from blablapp import views

print(views)

urlpatterns = [
    path('classes/', views.classes_api),
    path('user/<int:user_id>/characters/', views.characters_api)
]
