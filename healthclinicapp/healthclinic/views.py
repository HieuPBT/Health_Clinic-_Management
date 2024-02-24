import string
from datetime import datetime, timedelta
import random

from django.contrib.auth import get_user_model
from django.contrib.auth.hashers import make_password
from django.db.models import Q
from django.core.mail import send_mail
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.views.decorators.csrf import csrf_exempt
from oauth2_provider.contrib.rest_framework import TokenMatchesOASRequirements
from django.utils.encoding import force_str

from functools import partial

from django.http import Http404, HttpResponse
from django.shortcuts import render
from oauth2_provider.models import RefreshToken
from rest_framework import viewsets, generics, status, views, parsers, permissions
from rest_framework.decorators import action
from healthclinic import perms
from rest_framework.response import Response
from rest_framework.views import APIView
from healthclinic import serializers, paginators, models
from healthclinic.token import account_activation_token
from healthclinicapp import settings


# Create your views here.


def activate(request, uidb64, token):
    User = get_user_model()
    try:
        uid = force_str(urlsafe_base64_decode(uidb64))
        user = User.objects.get(pk=uid)
    except(TypeError, ValueError, OverflowError, User.DoesNotExist):
        user = None
    if user is not None and account_activation_token.check_token(user, token):
        user.is_active = True
        user.save()
        return HttpResponse('Thank you for your email confirmation. Now you can login your account.')
    else:
        return HttpResponse('Activation link is invalid!')


class UserViewSet(viewsets.ViewSet, generics.CreateAPIView):
    queryset = models.User.objects.all()
    serializer_class = serializers.UserSerializer
    pagination_class = paginators.UserPagination

    def get_permissions(self):
        # only allow any when create new user
        if self.action in ['create', 'forgot_password']:
            return [permissions.AllowAny()]
        return [perms.OwnerAuthenticated()] # update_profile, get_profile, change_password

    # decorator
    # return current user data
    @action(detail=False, methods=['get'], url_path='profile', url_name='current_user')
    def get_user_profile(self, request):
        return Response(serializers.UserListSerializer(request.user).data)

    @action(detail=False, methods=['patch'], url_path='update_profile', url_name='update_profile')
    def change_profile(self, request):
        user = models.User.objects.get(email=self.request.user)
        serializer = self.get_serializer(user, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)

    @action(detail=False, methods=['patch'], url_path='change_password', url_name='change_password')
    def change_password(self, request):
        user = models.User.objects.get(email=self.request.user)
        old_password = request.data.get('old_password', None)
        new_password = request.data.get('new_password', None)

        if user.check_password(old_password):
            user.set_password(new_password)
            user.save()
            return Response({'detail': 'Password changed successfully'}, status=status.HTTP_200_OK)
        else:
            return Response({'detail': 'Invalid old password'}, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=['post'], url_path='forgot_password', url_name='forgot_password')
    def forgot_password(self, request):
        email = request.data.get('username', None)
        if not email:
            return Response({'detail': 'Email is required.'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            user = models.User.objects.get(email=email)
        except models.User.DoesNotExist:
            return Response({'detail': 'User with this email does not exist.'}, status=status.HTTP_400_BAD_REQUEST)

        # Tạo một mật khẩu mới ngẫu nhiên
        new_password = ''.join(random.choices(string.ascii_letters + string.digits, k=8))

        # Mã hóa mật khẩu mới
        user.password = make_password(new_password)
        user.save()

        # Gửi mật khẩu mới qua email
        send_mail(
            'New Password',
            f'Your new password is: {new_password}',
            settings.EMAIL_HOST_USER,
            [email],
            fail_silently=False,
        )

        return Response({'detail': 'New password has been sent to your email address.'}, status=status.HTTP_200_OK)


class AppointmentViewSet(viewsets.ViewSet, generics.ListAPIView, generics.CreateAPIView):
    queryset = models.Appointment.objects.filter(status='CHƯA XÁC NHẬN')
    #serializer_class = serializers.AppointmentCreateSerializer
    permission_classes = [permissions.DjangoModelPermissions]
    pagination_class = paginators.AppointmentPagination

    def get_permissions(self):
        if self.action in ['get_patient_appointment', 'cancel_appointment']:
            return [perms.OwnerAuthenticated()]
        if self.action in ['confirm_appointment']:
            return [perms.IsNurse()]
        if self.action in ['list']:
            return [perms.IsEmployee()]

        return [permissions.DjangoModelPermissions()]

    def perform_create(self, serializer):
        # Tự động gán bệnh nhân hiện tại vào cuộc hẹn mới
        serializer.save(patient=self.request.user)

    def get_serializer_class(self):
        if self.action == 'list' and self.request.user.role in ['DOCTOR', 'NURSE']:
            return serializers.AppointmentListSerializer
        # if self.action == 'list' and self.request.user.role == 'PATIENT':
        #     return serializers.AppointmentSerializer
        # if self.request.method == 'PATCH' and self.request.user.role == 'NURSE':
        #     return serializers.AppointmentConfirmSerializer
        # if self.request.method == 'PATCH' and self.request.user.role == 'PATIENT':
        #     return serializers.AppointmentCancelSerializer
        return serializers.AppointmentCreateSerializer

    def get_queryset(self):
        # return lists of today appointments for Doctor
        if self.request.user.role == 'DOCTOR':
            doctor = models.Employee.objects.get(user=self.request.user)
            # Lấy ngày bắt đầu và kết thúc của các ca làm việc
            doctor_schedules = models.Schedule.objects.filter(employee=doctor).values_list('start_date', 'end_date')
            doctor_shift_ids = doctor_schedules.values_list('shift__id', flat=True)

            # Lấy thời gian bắt đầu và kết thúc của các ca làm việc
            shift_times = models.Shift.objects.filter(id__in=doctor_shift_ids).values_list('start_time', 'end_time')

            # Tạo một danh sách các điều kiện OR để so sánh thời gian đặt cuộc hẹn với khoảng thời gian của từng ca làm việc
            time_conditions = Q()
            for start_time, end_time in shift_times:
                time_conditions |= Q(booking_time__range=[start_time, end_time])

            date_conditions = Q()
            for start_date, end_date in doctor_schedules:
                date_conditions |= Q(booking_date__range=[start_date, end_date])

            # Lọc các cuộc hẹn dựa trên thời gian đặt cuộc hẹn nằm trong khoảng thời gian của các ca làm việc
            return (models.Appointment.objects.filter(department=doctor.department, status='ĐÃ XÁC NHẬN', booking_date=datetime.now().date())
                    .filter(time_conditions).filter(date_conditions))

        # return lists of today appointments for Nurse
        if self.request.user.role == 'NURSE':
            nurse = models.Employee.objects.get(user=self.request.user)
            # Lấy ngày bắt đầu và kết thúc của các ca làm việc
            nurse_schedules = models.Schedule.objects.filter(employee=nurse).values_list('start_date', 'end_date')
            nurse_shift_ids = nurse_schedules.values_list('shift__id', flat=True)

            # Lấy thời gian bắt đầu và kết thúc của các ca làm việc
            shift_times = models.Shift.objects.filter(id__in=nurse_shift_ids).values_list('start_time', 'end_time')

            # Tạo một danh sách các điều kiện OR để so sánh thời gian đặt cuộc hẹn với khoảng thời gian của từng ca làm việc
            time_conditions = Q()
            for start_time, end_time in shift_times:
                time_conditions |= Q(booking_time__range=[start_time, end_time])

            date_conditions = Q()
            for start_date, end_date in nurse_schedules:
                date_conditions |= Q(booking_date__range=[start_date, end_date])

            # Lọc các cuộc hẹn dựa trên thời gian đặt cuộc hẹn nằm trong khoảng thời gian của các ca làm việc
            return models.Appointment.objects.filter(status='CHƯA XÁC NHẬN').filter(time_conditions).filter(date_conditions)
        # return lists of patient appointments
        # if self.request.user.role == 'PATIENT':
        #     return models.Appointment.objects.filter(patient=self.request.user).all()
        # return lists of unconfirmed appointments for Nurse
        return models.Appointment.objects.all()

    @action(detail=False, methods=['get'], url_path='patient_appointment', url_name='patient_appointment')
    def get_patient_appointment(self, request):
        appointments = models.Appointment.objects.filter(patient=request.user).all()
        is_confirmed = self.request.query_params.get("is_confirm")  # ĐÃ XÁC NHẬN/CHƯA XÁC NHẬN
        is_paid = self.request.query_params.get("is_pay")  # ĐÃ THANH TOÁN/CHƯA THANH TOÁN
        is_canceled = self.request.query_params.get("is_cancel")  # ĐÃ HUỶ
        if is_confirmed:  # return confirmed/unconfirmed user appointment
            appointments = appointments.filter(status=is_confirmed)
        if is_paid:  # return paid/unpaid user appointment
            appointments = appointments.filter(status=is_paid)
        if is_canceled:  # return lists of canceled user appointment
            appointments = appointments.filter(status='ĐÃ HUỶ')
        paginator = paginators.AppointmentPagination()
        result_page = paginator.paginate_queryset(appointments, request)
        return paginator.get_paginated_response(serializers.AppointmentSerializer(result_page, many=True, context={'request': request}).data)

    @action(detail=True, methods=['patch'], url_path='confirm', url_name='confirm')
    def confirm_appointment(self, request, pk=None):
        try:
            appointment = models.Appointment.objects.get(pk=pk)
        except models.Appointment.DoesNotExist:
            return Response({"error": "Appointment not found"}, status=status.HTTP_404_NOT_FOUND)

        # Sau khi xác nhận cuộc hẹn, gửi email thông báo cho bệnh nhân
        subject = 'Xác nhận cuộc hẹn'
        message = ('Xin chào {}\n'
                    'Cuộc hẹn của bạn đã được xác nhận.\n'
                   'Khoa khám bệnh: {}\n'
                   'Thời gian: {}\n'
                   'Ngày khám: {}').format(appointment.patient.full_name, appointment.department , appointment.booking_time, appointment.booking_date)
        from_email = settings.EMAIL_HOST_USER
        to_email = appointment.patient.email  # Địa chỉ email của bệnh nhân

        send_mail(subject, message, from_email, [to_email], fail_silently=False)

        appointment.status = 'ĐÃ XÁC NHẬN'
        appointment.confirmed_by = self.request.user
        appointment.save()

        return Response({"detail": "Appointmnet confirmed"})

    @action(detail=True, methods=['patch'], url_path='cancel', url_name='cancel')
    def cancel_appointment(self, request, pk=None):
        try:
            appointment = models.Appointment.objects.get(pk=pk)
        except models.Appointment.DoesNotExist:
            return Response({"error": "Appointment not found"}, status=status.HTTP_404_NOT_FOUND)

        # Check permission to cancel appointment (optional)
        if not perms.OwnerAuthenticated():
            return Response({"error": "You don't have permission to cancel this appointment"},
                            status=status.HTTP_403_FORBIDDEN)

        # Update appointment status to cancelled
        appointment.status = "ĐÃ HUỶ"
        appointment.save()

        # Serialize response
        serializer = serializers.AppointmentCancelSerializer(appointment)
        return Response(serializer.data)


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


class MedicineListViewSet(viewsets.ViewSet, generics.ListAPIView):
    queryset = models.Medicine.objects.all()
    serializer_class = serializers.MedicineSerializer
    permission_classes = [permissions.DjangoModelPermissions]

    def get_queryset(self):
        queries = self.queryset
        q = self.request.query_params.get("name")
        if q:
            queries = queries.filter(name__icontains=q)
        return queries


class PrescriptionViewSet(viewsets.ViewSet, generics.CreateAPIView):
    queryset = models.Prescription.objects.all()
    serializer_class = serializers.PrescriptionSerializer
    permission_classes = [permissions.DjangoModelPermissions]

    def get_serializer_class(self):
        if self.action == 'create':
            return serializers.PrescriptionCreateSerializer
        return serializers.PrescriptionSerializer

    def perform_create(self, serializer):
        # Tự động gán bac si hiện tại vào toa thuoc mới
        serializer.save(doctor=self.request.user)

        appointment = serializer.instance.appointment
        appointment.status = "CHƯA THANH TOÁN"
        appointment.save()

    def get_permissions(self):
        if self.action == 'get_patient_prescription':
            return [perms.IsDocotor()]
        if self.action in ['get_today_prescription', 'create_invoice']:
            return [perms.IsNurse()]
        return [permissions.DjangoModelPermissions()]

    @action(detail=False, methods=['get'], url_path='today_prescription', url_name='today_prescription')
    def get_today_prescription(self, request):
        t = models.Prescription.objects.filter(created_date=datetime.now().date())
        paginator = paginators.PrescriptionPagination()
        result_page = paginator.paginate_queryset(t, request)
        return paginator.get_paginated_response(
            serializers.PrescriptionSerializer(result_page, many=True, context={'request': request}).data)

    # patient history
    @action(detail=False, methods=['get'], url_path='patient_prescription', url_name='patient_prescription')
    def get_patient_prescription(self, request):
        p = models.Prescription.objects.all()
        q = self.request.query_params.get("patient")
        start_date = self.request.query_params.get('start_date')
        end_date = self.request.query_params.get("end_date")
        if q:
            p = p.filter(appointment__patient=q)
            #return Response(serializers.PrescriptionSerializer(p, many=True, context={'request': request}).data)
        if q and start_date and end_date:
            p = p.filter(appointment__patient=q).filter(created_date__gte=start_date).filter(created_date__lte=end_date)
            #return Response(serializers.PrescriptionSerializer(p, many=True, context={'request': request}).data)
        paginator = paginators.PrescriptionPagination()
        result_page = paginator.paginate_queryset(p, request)
        return paginator.get_paginated_response(
            serializers.PrescriptionSerializer(result_page, many=True, context={'request': request}).data)

    @action(detail=True, methods=['post'], url_path='invoice', url_name='prescription_invoice')
    def create_invoice(self, request, pk):
        prescription = self.get_object()
        serializer = serializers.InvoiceSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save(nurse=request.user, prescription=prescription)

        appointment = prescription.appointment
        appointment.status = "ĐÃ THANH TOÁN"
        appointment.save()

        return Response(serializer.data, status=status.HTTP_201_CREATED)
