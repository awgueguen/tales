from django.contrib import admin
from django.urls import path, include
from django.conf.urls.static import static
from django.conf import settings
from blablapp import views
from rest_framework_simplejwt.views import TokenRefreshView
# from chat.views import index

urlpatterns = [
    path('admin/', admin.site.urls),
    # path('socketio/', index),   #socket.io/
    # path('', index, name='index')
    path('api/', include('blablapp.urls')),
    path('token/', views.MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
