# OK ------------------------------------------------------------------------ #

from django.contrib import admin
from django.urls import path, include
from django.conf.urls.static import static
from django.conf import settings
from rest_framework_simplejwt.views import TokenRefreshView
from tales import views
# from websocket.views import index


urlpatterns = [
    # DJANGO ---------------------------------------------------------------- #
    path('admin/', admin.site.urls),
    # A¨¨PPS ---------------------------------------------------------------- #
    path('api/', include('tales.urls')),
    path('socketio/', include('websocket.urls')),
    # TOKEN ----------------------------------------------------------------- #
    path('token/', views.MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
