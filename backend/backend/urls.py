from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

urlpatterns = [
    path('admin/', admin.site.urls),

    path(r'', include('blablapp.urls')),
    # r'string' is of explcit declaration of rawdata
    # caret = > ^ means the start of the URL string and $ is the end of the URL.
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),


] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)  # if settings.DEBUG ?
