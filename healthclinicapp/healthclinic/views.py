from datetime import datetime, timedelta
from django.http import Http404
from django.shortcuts import render
from rest_framework import viewsets, generics, status, views, parsers, permissions
from rest_framework.decorators import action
from healthclinic import perms
from rest_framework.response import Response
from rest_framework.views import APIView
from healthclinic import serializers, paginators, models
# Create your views here.


class UserViewSet(viewsets.ViewSet, generics.CreateAPIView):
    queryset = models.CustomUser.objects.all()
    serializer_class = serializers.UserSerializer
    pagination_class = paginators.UserPagination
    #permission_classes = [permissions.IsAuthenticated]
    #parser_classes = [parsers.MultiPartParser]

    def get_permissions(self):
        # only allow any when create new user
        if self.action == 'create':
            return [permissions.AllowAny()]
        if self.action == 'get_current_user':
            return [perms.IsPatient()]

        return [permissions.IsAuthenticated()]

    # decorator
    # return current user data
    @action(detail=False, methods=['get'], url_path='current_user', url_name='current_user')
    def get_current_user(self, request):
        return Response(serializers.UserListSerializer(request.user).data)


class AppointmentViewSet(viewsets.ViewSet, generics.ListAPIView, generics.CreateAPIView, generics.UpdateAPIView ):
    #queryset = models.Appointment.objects.filter(is_confirm=False).all()
    serializer_class = serializers.AppointmentCreateSerializer
    pagination_class = paginators.AppointmentPagination

    def get_permissions(self):
        if self.action in ['create', 'get_current_user_appointment']:
            return [perms.IsPatient()]
        if self.request.method == 'PATCH' and self.request.user.role == "PATIENT":
            return [perms.PatientOwner()]
        if self.request.method == 'PATCH' and self.request.user.role == "NURSE":
            return [perms.IsNurse()]
        return [permissions.IsAuthenticated()]

    def perform_create(self, serializer):
        # Tự động gán bệnh nhân hiện tại vào cuộc hẹn mới
        serializer.save(patient=self.request.user)

    def get_serializer_class(self):
        if self.action == 'list':
            return serializers.AppointmentListSerializer
        if self.request.method == 'PATCH' and self.request.user.role == 'NURSE':
            return serializers.AppointmentConfirmSerializer
        if self.request.method == 'PATCH' and self.request.user.role == 'PATIENT':
            return serializers.AppointmentDeleteSerializer
        return serializers.AppointmentCreateSerializer

    def perform_update(self, serializer):
        if self.request.method == 'PATCH' and 'confirmed_by' not in serializer.validated_data and self.request.user.role == 'NURSE':
            # Gán ID của Nurse vào trường confirmed_by
            serializer.validated_data['confirmed_by'] = self.request.user
        serializer.save()

    def get_queryset(self):
        # return appointment count base on date <- 100 appointment
        queries = models.Appointment.objects.all()
        q = self.request.query_params.get("b_date")
        if q:
            queries = queries.filter(booking_date=q, is_cancel=False)
            return queries
        # return today confirmed appointment list for doctor
        if self.request.user.role == 'DOCTOR':
            return models.Appointment.objects.filter(is_confirm=True, is_cancel=False, booking_date=datetime.now().date())
        if self.request.user.role == 'PATIENT':
            return models.Appointment.objects.filter(patient=self.request.user).all()
        return models.Appointment.objects.filter(is_confirm=False, is_cancel=False)

    @action(detail=False, methods=['get'], url_path='patient_appointment', url_name='patient_appointment')
    def get_current_user_appointment(self, request):
        a = models.Appointment.objects.filter(patient=request.user).all()
        paginator = paginators.AppointmentPagination()
        result_page = paginator.paginate_queryset(a, request)
        return paginator.get_paginated_response(serializers.AppointmentSerializer(result_page, many=True, context={'request': request}).data)

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


class AppointmentCountInNext30DaysAPIView(APIView):
    def get(self, request):
        # Tính ngày hiện tại và ngày sau 30 ngày
        today = datetime.now().date()
        thirty_days_from_now = today + timedelta(days=30)

        # Lọc và đếm các booking trong khoảng thời gian từ ngày hiện tại đến 30 ngày sau
        counts = []
        current_date = today
        while current_date <= thirty_days_from_now:
            next_date = current_date + timedelta(days=1)
            count = models.Appointment.objects.filter(booking_date__gte=current_date, booking_date__lt=next_date).count()
            counts.append({'date': current_date.strftime('%Y-%m-%d'), 'count': count})
            current_date = next_date

        return Response(counts)


# class AppointmentConfirm(generics.RetrieveUpdateAPIView):
#     queryset = models.Appointment.objects.all()
#     permission_classes = [perms.IsNurse]
#
#     def get_serializer_class(self):
#         if self.request.method == 'PATCH':
#             return serializers.AppointmentConfirmSerializer
#         return serializers.AppointmentSerializer
#
#     def perform_update(self, serializer):
#         if self.request.method == 'PATCH' and 'confirmed_by' not in serializer.validated_data:
#             # Gán ID của Nurse vào trường confirmed_by
#             serializer.validated_data['confirmed_by'] = self.request.user
#         serializer.save()


# class MedicineFilter(django_filters.FilterSet):
#     # Định nghĩa các trường mà bạn muốn cho phép lọc
#     name = django_filters.CharFilter(lookup_expr='icontains')
#     # Thêm các trường khác nếu cần
#
#     class Meta:
#         model = models.Medicine
#         fields = ['name',]  # Danh sách các trường bạn muốn lọc


class MedicineListViewSet(viewsets.ViewSet, generics.ListAPIView):
    queryset = models.Medicine.objects.all()
    serializer_class = serializers.MedicineSerializer
    permission_classes = [perms.IsDoctor]
    # filter_backends = [filters.OrderingFilter, django_filters.rest_framework.DjangoFilterBackend]
    # filterset_class = MedicineFilter

    def get_queryset(self):
        queries = self.queryset
        q = self.request.query_params.get("name")
        if q:
            queries = queries.filter(name__icontains=q)
        return queries


class PrescriptionViewSet(viewsets.ViewSet, generics.ListAPIView, generics.CreateAPIView):
    queryset = models.Prescription.objects.all()
    serializer_class = serializers.PrescriptionSerializer
    permission_classes = [perms.IsDoctor]

    def get_serializer_class(self):
        if self.action == 'create':
            return serializers.PrescriptionCreateSerializer
        return serializers.PrescriptionSerializer

    def perform_create(self, serializer):
        # Tự động gán bac si hiện tại vào toa thuoc mới
        serializer.save(doctor=self.request.user)

    @action(detail=False, methods=['get'], url_path='patient_prescription', url_name='patient_prescription')
    def get_patient_prescription(self, request):
        p = models.Prescription.objects.all()
        q = self.request.query_params.get("patient")
        start_date = self.request.query_params.get('start_date')
        end_date = self.request.query_params.get("end_date")
        if q and start_date and end_date:
            p = p.filter(appointment__patient=q).filter(created_date__gte=start_date).filter(created_date__lte=end_date)
        return Response(serializers.PrescriptionSerializer(p, many=True, context={'request': request}).data)