from django.db import models
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin, AbstractUser
from django.utils import timezone
from django.utils.translation import gettext_lazy as _
from cloudinary.models import CloudinaryField
from rest_framework.exceptions import ValidationError

from .managers import CustomUserManager
from .choices import Role, Gender, Department, Status, Payment

from healthclinicapp import settings

# Create your models here.

"""
PATIENT, ADMIN, NURSE, DOCTOR -> all are USER
They can be can be distinguish by their role, groups and permissions
Using Role(ADMIN, PATIENT, DOCTOR, NURSE) to assign to user when they are created
Using email as username to login
"""


class User(AbstractBaseUser, PermissionsMixin):
    email = models.EmailField(_('email'), max_length=100, unique=True) # using email instead of username
    full_name = models.CharField(_('full name'), max_length=100, blank=True, null=True)
    role = models.CharField(_('role'), max_length=50, choices=Role.choices, default=Role.PATIENT) # default role=Patient
    avatar = CloudinaryField(_('avatar'), blank=True, null=True)
    gender = models.CharField(_('gender'), max_length=50, choices=Gender.choices, default=Gender.MALE) # default gender=Male
    date_of_birth = models.DateField(blank=True, null=True)
    phone_number = models.CharField(max_length=11, blank=True, null=True)
    address = models.CharField(max_length=255, null=True, blank=True)

    is_active = models.BooleanField(default=True, help_text=_(
        "Designates whether this user should be treated as active. "
        "Unselect this instead of deleting accounts."
        ),)
    is_staff = models.BooleanField(default=False, help_text=_(
            "Designates whether the user can log into this admin site."
        ),) # indicate whether user can log in admin site
    date_joined = models.DateTimeField(_("date joined"), default=timezone.now)

    USERNAME_FIELD = 'email' # using email to login
    REQUIRED_FIELDS = [] # require when create superuser

    objects = CustomUserManager()

    def __str__(self):
        return self.email


class Patient(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, primary_key=True)
    health_insurance = models.CharField(max_length=50, blank=True, null=True)

    def __str__(self):
        return self.user.email


class BaseModel(models.Model):
    created_date = models.DateField(auto_now_add=True)
    updated_date = models.DateField(auto_now=True)
    # active = models.BooleanField(default=True)

    class Meta:
        abstract = True


class Shift(BaseModel):
    start_time = models.TimeField()
    end_time = models.TimeField()


class Employee(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, primary_key=True)
    Department = models.CharField(max_length=100, choices=Department.choices)
    shift = models.ManyToManyField(Shift)

    def __str__(self):
        return self.user.email


class Schedule(BaseModel):
    doctor = models.ForeignKey(User, on_delete=models.RESTRICT)
    shift = models.ForeignKey(Shift, on_delete=models.RESTRICT)
    start_date = models.DateField()
    end_date = models.DateField()


class Appointment(BaseModel):
    patient = models.ForeignKey(User, on_delete=models.CASCADE, related_name='patient_appointment')
    department = models.CharField(max_length=100, choices=Department.choices)
    booking_date = models.DateField(help_text="YY-MM-DD")
    booking_time = models.TimeField()
    status = models.CharField(max_length=100, choices=Status.choices, default=Status.UNCONFIRMED)
    confirmed_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='nurse_confirm')

    class Meta:
        unique_together = ['patient', 'booking_date', 'booking_time']

    def __str__(self):
        return "{}_{}".format(self.patient.full_name.__str__(), self.patient.phone_number.__str__())


class MedicineCategory(BaseModel):
    name = models.CharField(max_length=255)

    def __str__(self):
        return self.name


class Medicine(BaseModel):
    name = models.CharField(max_length=255, unique=True)
    category = models.ForeignKey(MedicineCategory, on_delete=models.RESTRICT)
    unit = models.CharField(max_length=50, null=False)

    class Meta:
        unique_together = ['name', 'category']

    def __str__(self):
        return self.name


class Prescription(BaseModel):
    doctor = models.ForeignKey(User, on_delete=models.RESTRICT)
    appointment = models.ForeignKey(Appointment, on_delete=models.RESTRICT, unique=True)
    medicine_list = models.ManyToManyField(Medicine, through='PrescriptionMedicine')
    description = models.CharField(max_length=255, null=False, blank=True)
    conclusion = models.CharField(max_length=255, null=False, blank=True)

    def __str__(self):
        return "{}_{}_{}".format(self.appointment.patient.full_name.__str__(), self.appointment.booking_date.__str__(), self.appointment.booking_time.__str__())


class PrescriptionMedicine(models.Model):
    prescription = models.ForeignKey(Prescription, on_delete=models.CASCADE)
    medicine = models.ForeignKey(Medicine, on_delete=models.CASCADE)
    note = models.CharField(max_length=100, null=True, blank=True)
    quantity = models.PositiveIntegerField(default=1)

    def __str__(self):
        return "{}_{}".format(self.prescription.__str__(), self.medicine.__str__())


class Invoice(BaseModel):
    prescription = models.ForeignKey(Prescription, on_delete=models.RESTRICT, unique=True)
    nurse = models.ForeignKey(User, on_delete=models.RESTRICT)
    appointment_fee = models.PositiveIntegerField(null=False)
    prescription_fee = models.PositiveIntegerField(null=True, blank=True)
    payment_method = models.CharField(max_length=100, choices=Payment.choices)

    def get_total(self):
        total = self.appointment_fee
        if self.prescription_fee is not None:
            total += self.prescription_fee
        return total
