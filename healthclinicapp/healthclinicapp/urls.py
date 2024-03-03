
from django.contrib import admin
from django.urls import path, include
import debug_toolbar
from healthclinic.admin import admin_site
from healthclinic.views import activate

urlpatterns = [
    # api
    path('api/', include('healthclinic.urls')),
    # django admin
    path('admin/', admin_site.urls),
    # oauth2
    path('o/', include('oauth2_provider.urls', namespace='oauth2_provider')),
    path('__debug__/', include(debug_toolbar.urls)),
    path('activate/<str:uidb64>/<str:token>/', activate, name='activate'),
]
