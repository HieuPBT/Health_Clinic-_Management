from django.db import models
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin, AbstractUser
from django.utils import timezone
from django.utils.translation import gettext_lazy as _
from cloudinary.models import CloudinaryField
from rest_framework.exceptions import ValidationError

from .managers import CustomUserManager
from .choices import Role, Gender, Department

from healthclinicapp import settings

# Create your models here.

"""
PATIENT, ADMIN, NURSE, DOCTOR -> all are USER
They can be can be distinguish by their role, groups and permissions
Using Role(ADMIN, PATIENT, DOCTOR, NURSE) to assign to user when they are created
Using email as username to login
"""


class CustomUser(AbstractBaseUser, PermissionsMixin):
    email = models.EmailField(_('email'), max_length=100, unique=True) # using email instead of username
    full_name = models.CharField(_('full name'), max_length=100, blank=True, null=True)
    role = models.CharField(_('role'), max_length=50, choices=Role.choices, default=Role.PATIENT) # default role=Patient
    avatar = CloudinaryField(_('avatar'), blank=True, null=True)
    gender = models.CharField(_('gender'), max_length=50, choices=Gender.choices, default=Gender.MALE) # default gender=Male
    date_of_birth = models.DateField(blank=True, null=True)
    phone_number = models.CharField(max_length=11, blank=True, null=True)
    address = models.CharField(max_length=255, null=True, blank=True)

    is_active = models.BooleanField(default=True, help_text=_("Designates whether the user can log into this admin site."),)
    is_staff = models.BooleanField(default=False, help_text=_(
            "Designates whether this user should be treated as active. "
            "Unselect this instead of deleting accounts."
        ),) # indicate whether user can log in admin site
    date_joined = models.DateTimeField(_("date joined"), default=timezone.now)

    USERNAME_FIELD = 'email' # using email to login
    REQUIRED_FIELDS = [] # require when create superuser

    objects = CustomUserManager()

    def __str__(self):
        return self.email


class Patient(models.Model):
    user = models.OneToOneField(CustomUser, on_delete=models.CASCADE, primary_key=True)
    health_insurance = models.CharField(max_length=50, blank=True, null=True)

    def __str__(self):
        return self.user.email


class Employee(models.Model):
    user = models.OneToOneField(CustomUser, on_delete=models.CASCADE, primary_key=True)
    Department = models.CharField(max_length=100, choices=Department.choices, default=Department.COSMETIC)

    def __str__(self):
        return self.user.email


class BaseModel(models.Model):
    created_date = models.DateField(auto_now_add=True)
    updated_date = models.DateField(auto_now=True)
    # active = models.BooleanField(default=True)

    class Meta:
        abstract = True


class Appointment(BaseModel):
    TIMESLOT_LIST = (
        (0, '07:30 – 10:30'),
        (1, '13:00 – 16:30'),
        (3, '18:30 – 09:30'),
    )
    patient = models.ForeignKey(Patient, on_delete=models.CASCADE)
    department = models.CharField(max_length=100, choices=Department.choices)
    booking_date = models.DateField(help_text="YY-MM-DD")
    booking_time = models.IntegerField(choices=TIMESLOT_LIST)
    is_confirm = models.BooleanField(default=False)
    confirmed_by = models.ForeignKey(CustomUser, on_delete=models.SET_NULL, null=True, blank=True)

    class Meta:
        unique_together = ['patient', 'booking_date', 'booking_time']

    def __str__(self):
        return self.department

    # def confirm_appointment(self, confirmed_by):
    #     # Xác nhận cuộc hẹn
    #     self.is_confirm = True
    #     self.confirmed_by = confirmed_by
    #     self.save()

    # def available_time_slots(cls, booking_date):
    #     # Tạo một danh sách chứa tất cả các time slot cho một ngày nhất định
    #     time_slots = [choice[0] for choice in cls.TIMESLOT_LIST]
    #
    #     # Lấy số lượng bệnh nhân đã đặt lịch cho từng time slot trong ngày
    #     slot_counts = cls.objects.filter(booking_date=booking_date).values('booking_time').annotate(count=models.Count('booking_time'))
    #
    #     # Tạo một danh sách chứa các time slot đã đặt lịch
    #     booked_slots = [slot['booking_time'] for slot in slot_counts if slot['count'] >= 25]
    #
    #     # Loại bỏ các time slot đã đặt lịch khỏi danh sách
    #     available_slots = [slot for slot in time_slots if slot not in booked_slots]
    #
    #     return available_slots



