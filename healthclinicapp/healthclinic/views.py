from django.http import Http404
from django.shortcuts import render
from rest_framework import viewsets, generics, status, views, parsers, permissions
from healthclinic import perms
from rest_framework.response import Response
from rest_framework.views import APIView

from healthclinic import serializers, paginators, models
# Create your views here.


class CurrentUserViewSet(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get (self, request):
        user_serializer = serializers.UserSerializer(request.user)
        return Response(user_serializer.data)


class UserViewSet(viewsets.ViewSet, generics.ListAPIView, generics.CreateAPIView, generics.RetrieveAPIView):
    queryset = models.CustomUser.objects.all()
    #permission_classes = [permissions.IsAuthenticated]
    serializer_class = serializers.UserSerializer
    pagination_class = paginators.UserPagination
    #parser_classes = [parsers.MultiPartParser]

    def get_permissions(self):
        # only allow any when create new user
        if self.action == 'create':
            return [permissions.AllowAny()]

        return [permissions.IsAuthenticated()]

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance)
        return Response(serializer.data)


class PatientViewSet(viewsets.ModelViewSet):
    queryset = models.CustomUser.objects.all()
    serializer_class = serializers.PatientSerializer


class AppointmentListCreate(viewsets.ViewSet, generics.CreateAPIView, generics.ListAPIView):
    queryset = models.Appointment.objects.filter(is_confirm=False)
    serializer_class = serializers.AppointmentSerializer

    # def get_queryset(self):
    #     # Lọc các cuộc hẹn dựa trên người dùng đã xác thực là bệnh nhân
    #     return models.Appointment.objects.filter(patient=self.request.user)
    # def perform_create(self, serializer):
    #     if self.request.method == 'POST' and 'patient' not in serializer.validated_data:
    #         # Gán ID của Nurse vào trường confirmed_by
    #         serializer.validated_data['patient'] = self.request.user
    #     serializer.save()

    # def get_permissions(self):
    #     if self.action == 'create':
    #         return [perms.IsPatient]

    def get_permissions(self):
        if self.action == 'create':
            return [perms.IsPatient()]
        return [perms.IsNurse()]

    def perform_create(self, serializer):
        # Tự động gán bệnh nhân hiện tại vào cuộc hẹn mới
        serializer.save(patient=self.request.user)

    # def perform_create(self, serializer):
    #     if 'patient' not in serializer.validated_data:
    #         # Gán ID của User vào trường patient nếu không được cung cấp
    #         serializer.validated_data['patient'] = self.request.user
    #     serializer.save()

    # def perform_create(self, serializer):
    #     serializer.is_valid(raise_exception=True)  # Xác nhận dữ liệu trước khi truy cập validated_data
    #     # Gán ID của User vào trường patient nếu không được cung cấp
    #     serializer.validated_data['patient'] = self.request.user.id
    #     serializer.save()


class AppointmentConfirm(generics.RetrieveUpdateDestroyAPIView):
    queryset = models.Appointment.objects.all()
    permission_classes = [perms.IsNurse]

    def get_serializer_class(self):
        if self.request.method == 'PATCH':
            return serializers.AppointmentConfirmSerializer
        return serializers.AppointmentSerializer

    def perform_update(self, serializer):
        if self.request.method == 'PATCH' and 'confirmed_by' not in serializer.validated_data:
            # Gán ID của Nurse vào trường confirmed_by
            serializer.validated_data['confirmed_by'] = self.request.user
        serializer.save()

    # def confirm(self, serializer):
    #     serializer.save(confirmed_by=self.request.user)
