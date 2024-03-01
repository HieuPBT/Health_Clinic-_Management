import json
import string
from datetime import datetime, timedelta, timezone, time
import random
from time import time
import pytz
from django.contrib.auth import get_user_model
from django.contrib.auth.hashers import make_password
from django.db.models import Q
from django.core.mail import send_mail
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.utils.timezone import now
from django.views.decorators.csrf import csrf_exempt
from oauth2_provider.contrib.rest_framework import TokenMatchesOASRequirements
from django.utils.encoding import force_str

from functools import partial

from django.http import Http404, HttpResponse, JsonResponse
from django.shortcuts import render
from oauth2_provider.models import RefreshToken
from rest_framework import viewsets, generics, status, views, parsers, permissions
from rest_framework.decorators import action, api_view
from healthclinic import perms
from rest_framework.response import Response
from rest_framework.views import APIView
from healthclinic import serializers, paginators, models
from healthclinic.token import account_activation_token
from healthclinicapp import settings

# momo
import json
import urllib.request
import urllib
import uuid
import requests
import hmac
import hashlib

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


class AvailableAppointmentListAPIView(APIView):
    permission_classes = [permissions.AllowAny]  # Cho phép mọi người truy cập API này

    def get(self, request):
        # Lấy danh sách các lịch hẹn đã được đặt cho một khoa cụ thể trong khoảng thời gian đã xác định
        current_date = datetime.now().date()
        thirty_days_from_now = current_date + timedelta(days=30)
        booked_appointments = models.Appointment.objects.filter(
            department=self.request.data,
            booking_date__range=[current_date, thirty_days_from_now]
        ).exclude(status='ĐÃ HUỶ')  # Lọc các lịch hẹn đã được đặt và không bị hủy

        # Tạo một danh sách của tất cả các thời gian có thể trong khoảng thời gian đã xác định
        all_appointment_times = [datetime.combine(current_date, time) for time in models.Appointment.TIME_CHOICES]

        # Tạo một danh sách của các thời gian còn khả dụng bằng cách loại bỏ các thời gian đã được đặt
        available_times = [time for time in all_appointment_times if time not in booked_appointments.values_list('booking_time', flat=True)]

        # Trả về danh sách các thời gian còn khả dụng
        return Response(available_times)


class UserViewSet(viewsets.ViewSet, generics.CreateAPIView):
    queryset = models.User.objects.all()
    serializer_class = serializers.UserSerializer
    pagination_class = paginators.UserPagination

    def get_permissions(self):
        # only allow any when create new user
        if self.action in ['create', 'forgot_password']:
            return [permissions.AllowAny()]
        return [perms.OwnerAuthenticated()]  # update_profile, get_profile, change_password

    # decorator
    # return current user data
    @action(detail=False, methods=['get'], url_path='profile', url_name='current_user')
    def get_user_profile(self, request):
        return Response(serializers.UserListSerializer(request.user).data)

    @action(detail=False, methods=['patch'], url_path='update_profile', url_name='update_profile')
    def update_profile(self, request):
        user = models.User.objects.get(email=self.request.user)
        serializer = self.get_serializer(user, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)

    @action(detail=False, methods=['patch'], url_path='update_password', url_name='change_password')
    def update_password(self, request):
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
    # serializer_class = serializers.AppointmentCreateSerializer
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
        if self.action == 'list' and self.request.user.role in ['DOCTOR']:
            return serializers.AppointmentListSerializer
        if self.action == 'list' and self.request.user.role == 'NURSE':
            return serializers.NurseAppointmentSerializer
        return serializers.AppointmentCreateSerializer

    def get_queryset(self):
        # return lists of today appointments for Doctor
        if self.request.user.role == 'DOCTOR':
            try:
                doctor = models.Employee.objects.get(user=self.request.user)
                # Lấy ngày bắt đầu và kết thúc của các ca làm việc
                doctor_schedules = models.Schedule.objects.filter(employee=doctor).values_list('start_date', 'end_date')
                doctor_shift_ids = doctor_schedules.values_list('shift__id', flat=True)
                doctor_shifts = models.Shift.objects.filter(schedule__employee=doctor)

                # Lấy thời gian hiện tại
                bangkok_timezone = pytz.timezone('Asia/Bangkok')
                current_datetime = datetime.now().astimezone(bangkok_timezone)

                # Lấy giờ từ thời gian hiện tại
                current_time = current_datetime.time()

                # Lấy thời gian bắt đầu và kết thúc của các ca làm việc
                shift_times = models.Shift.objects.filter(id__in=doctor_shift_ids).values_list('start_time', 'end_time')

                time_conditions = Q()
                for start_time, end_time in shift_times:
                    time_conditions |= Q(booking_time__range=[start_time, end_time])

                date_conditions = Q()
                for start_date, end_date in doctor_schedules:
                    date_conditions |= Q(booking_date__range=[start_date, end_date])

                for shift in doctor_shifts:
                    # Nếu giờ hiện tại nằm trong khoảng thời gian của ca làm việc, trả về danh sách cuộc hẹn chưa được xác nhận
                    if shift.start_time <= current_time <= shift.end_time:
                        return (models.Appointment.objects.filter(department=doctor.department, status='ĐÃ XÁC NHẬN',
                                                                  booking_date=current_datetime.date())
                                .filter(time_conditions).filter(date_conditions))

                    return models.Appointment.objects.none()

            except models.Employee.DoesNotExist:
                return Response(status.HTTP_204_NO_CONTENT)

        # return lists of today appointments for Nurse
        if self.request.user.role == 'NURSE':
            if self.request.user.role == 'NURSE':
                try:
                    # Lấy thông tin y tá đăng nhập
                    nurse = models.Employee.objects.get(user=self.request.user)
                    nurse_shifts = models.Shift.objects.filter(schedule__employee=nurse)

                    # Lấy thời gian hiện tại
                    bangkok_timezone = pytz.timezone('Asia/Bangkok')
                    current_datetime = datetime.now().astimezone(bangkok_timezone)

                    # Lấy giờ từ thời gian hiện tại
                    current_time = current_datetime.time()

                    # Kiểm tra xem giờ hiện tại có nằm trong bất kỳ ca làm việc nào của y tá không
                    for shift in nurse_shifts:
                        # Nếu giờ hiện tại nằm trong khoảng thời gian của ca làm việc, trả về danh sách cuộc hẹn chưa được xác nhận
                        if shift.start_time <= current_time <= shift.end_time:
                            return models.Appointment.objects.filter(status='CHƯA XÁC NHẬN')

                    # Nếu không nằm trong bất kỳ ca làm việc nào, trả về danh sách rỗng
                    return models.Appointment.objects.none()

                except models.Employee.DoesNotExist:
                    return Response(status.HTTP_204_NO_CONTENT)

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


class AppointmentAvailableBookingTime(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        allowed_booking_times = [
            time(7, 0), time(7, 30), time(8, 0), time(8, 30), time(9, 0),
            time(9, 30), time(10, 0), time(10, 30), time(11, 0), time(11, 30),
            time(13, 0), time(13, 30), time(14, 0), time(14, 30), time(15, 0),
            time(15, 30), time(16, 0), time(16, 30), time(17, 0), time(17, 30)
        ]
        booking_date = request.query_params.get('date')  # Get the booking date from the query parameters
        department = request.query_params.get('department')
        if booking_date and department:
            # If booking_date is provided, filter available booking times based on that date
            booked_times = models.Appointment.objects.filter(booking_date=booking_date, department=department).values_list('booking_time', flat=True)
            available_booking_times = [time for time in allowed_booking_times if time not in booked_times]
            # If no booking_date is provided, return all available booking times
            return Response(available_booking_times)
        # Return the available booking times in the response
        return Response(status.HTTP_204_NO_CONTENT)


class AppointmentCountInNext30DaysAPIView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        # Tính ngày hiện tại và ngày sau 30 ngày
        bangkok_timezone = pytz.timezone('Asia/Bangkok')
        current_datetime = datetime.now().astimezone(bangkok_timezone)
        today = current_datetime.date()
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
            return [perms.IsDoctor()]
        if self.action in ['get_today_prescription', 'create_invoice']:
            return [perms.IsNurse()]
        return [permissions.DjangoModelPermissions()]

    @action(detail=False, methods=['get'], url_path='today_prescription', url_name='today_prescription')
    def get_today_prescription(self, request):
        # Lấy thời gian hiện tại
        bangkok_timezone = pytz.timezone('Asia/Bangkok')
        current_datetime = datetime.now().astimezone(bangkok_timezone)

        # Lọc các đơn thuốc đã tạo vào ngày hiện tại
        prescriptions_today = models.Prescription.objects.filter(created_date=current_datetime.date())

        # Lọc các đơn thuốc mà chưa có hóa đơn tương ứng
        prescriptions_without_invoice = prescriptions_today.exclude(invoice__isnull=False)

        # Sử dụng paginator để phân trang
        paginator = paginators.PrescriptionPagination()
        result_page = paginator.paginate_queryset(prescriptions_without_invoice, request)

        # Trả về phản hồi cho các đơn thuốc không có hóa đơn tương ứng
        return paginator.get_paginated_response(
            serializers.TodayPrescriptionSerializer(result_page, many=True, context={'request': request}).data)

    # patient history
    @action(detail=False, methods=['get'], url_path='patient_prescription', url_name='patient_prescription')
    def get_patient_prescription(self, request):
        p = models.Prescription.objects.all()
        q = self.request.query_params.get("patient")
        start_date = self.request.query_params.get('start_date')
        end_date = self.request.query_params.get("end_date")
        if q:
            p = p.filter(appointment__patient=q)
        if q and start_date and end_date:
            p = p.filter(appointment__patient=q).filter(created_date__gte=start_date).filter(created_date__lte=end_date)
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


class MomoViewSet(viewsets.ViewSet):
    permission_classes = [perms.IsNurse]

    @action(detail=False, methods=['post'], url_path='create', url_name='momo_create')
    @csrf_exempt
    def create_momo_payment(self, request): # tạo đường link thanh toán
        endpoint = "https://test-payment.momo.vn/v2/gateway/api/create"
        partnerCode = "MOMO"
        accessKey = "F8BBA842ECF85"
        secretKey = "K951B6PE1waDMi640xX08PD3vg6EkVlz"
        requestId = str(uuid.uuid4())
        amount = self.request.data.get('total')
        orderId = str(uuid.uuid4())
        # orderId = total.get('appointment_id')+total.get('user_id')+total.get('booking_date')
        orderInfo = "pay with MoMo"
        requestType = "captureWallet"
        extraData = ""
        redirectUrl = ""
        ipnUrl = "https://webhook.site/b3088a6a-2d17-4f8d-a383-71389a6c600b"
        rawSignature = "accessKey=" + accessKey + "&amount=" + amount + "&extraData=" + extraData + "&ipnUrl=" + ipnUrl + "&orderId=" + orderId + "&orderInfo=" + orderInfo + "&partnerCode=" + partnerCode + "&redirectUrl=" + redirectUrl + "&requestId=" + requestId + "&requestType=" + requestType
        h = hmac.new(bytes(secretKey, 'ascii'), bytes(rawSignature, 'ascii'), hashlib.sha256)
        signature = h.hexdigest()
        data = {
            'partnerCode': partnerCode,
            'partnerName': "Phòng Khám Tư Lộc Hiếu",
            'requestId': requestId,
            'amount': amount,
            'orderId': orderId,
            'orderInfo': orderInfo,
            'redirectUrl': redirectUrl,
            'ipnUrl': ipnUrl,
            'lang': "vi",
            'extraData': extraData,
            'requestType': requestType,
            'signature': signature
        }

        data = json.dumps(data)

        clen = len(data)
        response = requests.post(endpoint, data=data,
                                 headers={'Content-Type': 'application/json', 'Content-Length': str(clen)})

        if response.status_code == 200:
            response_data = response.json()
            return JsonResponse({**response_data})
        else:
            return JsonResponse({'error': 'Invalid request method'})

    @csrf_exempt
    @action(detail=False, methods=['post'], url_path='query', url_name='query_momo')
    def query_momo_payment(self, request): # kiểm tra giao dịch đã thanh toán?
        endpoint = "https://test-payment.momo.vn/v2/gateway/api/query"
        secretKey = "K951B6PE1waDMi640xX08PD3vg6EkVlz"
        accessKey = "F8BBA842ECF85"
        request_data = self.request.data
        partnerCode = request_data.get('partnerCode')
        requestId = request_data.get('requestId')
        orderId = request_data.get('orderId')
        lang = request_data.get('lang')
        # mã hóa HMAC SHA256
        rawSignature = "accessKey=" + accessKey + "&orderId=" + orderId + "&partnerCode=" + partnerCode + "&requestId=" + requestId
        h = hmac.new(bytes(secretKey, 'ascii'), bytes(rawSignature, 'ascii'), hashlib.sha256)
        signature = h.hexdigest()

        data = {
            'partnerCode': partnerCode,
            'requestId': requestId,
            'orderId': orderId,
            'lang': lang,
            'signature': signature
        }

        response = requests.post(endpoint, json=data)

        if response.status_code == 200:
            response_data = response.json()
            return JsonResponse({**response_data})
        else:
            return JsonResponse({'error': 'Invalid request method'})


class ZaloViewSet(viewsets.ViewSet):
    permission_classes = [perms.IsNurse]

    @csrf_exempt
    @action(detail=False, methods=['post'], url_path='create', url_name='create_zalo')
    def create_zalo_payment(self, request):   # tạo đường link thanh toán
        # zalo config
        endpoint = "https://sandbox.zalopay.com.vn/v001/tpe/createorder"
        appid = 553
        key1 = "9phuAOYhan4urywHTh0ndEXiV3pKHr5Q"
        embeddata = json.dumps({"merchantinfo": "embeddata123"})
        item = json.dumps([{"itemid": "knb", "itemname": "Pham Ba Trung Hieu", "itemprice": 99999, "itemquantity": 1}])
        appuser = "demo"
        apptime = int(round(time() * 1000))  # thời gian hết hạn thanh toán
        apptransid = "{:%y%m%d}_{}".format(datetime.today(), uuid.uuid4())

        # Lấy dữ liệu từ request của client
        amount = self.request.data.get('amount')

        # Tạo chuỗi dữ liệu theo định dạng yêu cầu
        raw_data = "{}|{}|{}|{}|{}|{}|{}".format(appid, apptransid, appuser, amount, apptime, embeddata, item)

        # Tính toán MAC bằng cách sử dụng HMAC
        h = hmac.new(key1.encode(), raw_data.encode(), hashlib.sha256)
        mac = h.hexdigest()

        # Dữ liệu gửi đi
        data = {
            "appid": appid,
            "appuser": appuser,
            "apptime": apptime,
            "amount": amount,
            "apptransid": apptransid,
            "embeddata": embeddata,
            "item": item,
            "description": "Phòng Khám Tư Lộc Hiếu",
            "bankcode": "zalopayapp",
            "mac": mac
        }

        # Gửi yêu cầu tạo
        response = requests.post(url=endpoint, data=data)

        if response.status_code == 200:
            result = response.json()
            return JsonResponse({**result, 'apptransid': apptransid})
        else:
            return JsonResponse({'error': 'Invalid request method'})

    @csrf_exempt
    @action(detail=False, methods=['post'], url_path='query', url_name='query_zalo')
    def query_zalo_payment(self, request):  # kiểm tra trạng thái thanh toán?
        # zalo config
        endpoint = "https://sandbox.zalopay.com.vn/v001/tpe/getstatusbyapptransid"
        appid = 553
        key1 = "9phuAOYhan4urywHTh0ndEXiV3pKHr5Q"

        request_data = self.request.data
        apptransid = request_data.get('apptransid')

        raw_data = "{}|{}|{}".format(appid, apptransid, key1)  # appid|apptransid|key1

        h = hmac.new(key1.encode(), raw_data.encode(), hashlib.sha256)
        mac = h.hexdigest()

        # Dữ liệu gửi đi
        data = {
            "appid": appid,
            "apptransid": apptransid,
            "mac": mac
        }

        # gửi yêu cầu kiểm tra
        response = requests.post(url=endpoint, data=data)

        if response.status_code == 200:
            result = response.json()
            return JsonResponse({**result})
        else:
            return JsonResponse({'error': 'Invalid request method'})
