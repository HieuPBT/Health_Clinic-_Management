from django.urls import path, include, re_path
from healthclinic import views
from rest_framework import routers
from rest_framework import permissions
from drf_yasg.views import get_schema_view
from drf_yasg import openapi

router = routers.DefaultRouter()
router.register('user', views.UserViewSet)
router.register('appointment', views.AppointmentViewSet, basename='appointment')
router.register('medicine', views.MedicineListViewSet, basename='medicine')
router.register('prescription', views.PrescriptionViewSet)
# momo
router.register('momo', views.MomoViewSet, basename='momo'),
# zalo
router.register('zalopay', views.ZaloViewSet, basename='zalopay')

schema_view = get_schema_view(
    openapi.Info(
        title="Health Clinic API",
        default_version='v1',
        description="APIs for Health Clinic ", contact=openapi.Contact(email=""),
        license=openapi.License(name="Hieu PBT"),
    ),
    public=True,
    permission_classes=(permissions.AllowAny,),
)

urlpatterns = [
    path('', include(router.urls)),
    path('appointment_count/', views.AppointmentCountInNext30DaysAPIView.as_view()),
    path('appointment_available_time/', views.AppointmentAvailableBookingTime.as_view()),
    re_path(r'^swagger(?P<format>\.json|\.yaml)$',
            schema_view.without_ui(cache_timeout=0),
            name='schema-json'),
    re_path(r'^swagger/$',
            schema_view.with_ui('swagger', cache_timeout=0),
            name = 'schema-swagger-ui'),
    re_path(r'^redoc/$',
            schema_view.with_ui('redoc', cache_timeout=0),
            name='schema-redoc')
]
