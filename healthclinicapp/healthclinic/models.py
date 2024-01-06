from django.db import models
from django.contrib.auth.models import AbstractUser, BaseUserManager, PermissionsMixin
from django.utils import timezone
from django.utils.translation import gettext_lazy as _
from cloudinary.models import CloudinaryField
# Create your models here.
"""
UserManager has two method to create user, regular user - create_user(), super user - create_superuser()
We extend create_user() method to create super user, patient, nurse, doctor, etc
Class CustomUserManager only has method, no fields
"""


class CustomUserManager(BaseUserManager):
    # using email/password to login instead of username//password
    def create_user(self, email, full_name, password, **other_fields):
        if not email:
            raise ValueError(_("Must be an email"))

        # normalize and lower before save to db, exp abc@gmail.com == aBC@gMail.com
        email = self.normalize_email(email)
        email = email.lower()

        user = self.model(email=email, full_name=full_name, **other_fields)
        user.set_password(password)
        user.save()
        return user

    def create_superuser(self, email, full_name, password, **other_fields):
        user = self.create_user(email, full_name, **other_fields)

        user.Role.ADMIN
        user.save()

        return user

    def create_doctor(self, email, full_name, password, **other_fields):
        user = self.create_user(email, full_name, **other_fields)

        user.Role.DOCTOR
        user.save()

        return user

    def create_nurse(self, email, full_name, password, **other_fields):
        user = self.create_user(email, full_name, **other_fields)

        user.Role.NURSE
        user.save()

        return user


"""
PATIENT, ADMIN, NURSE, DOCTOR -> all are USER
They can be can be distinguish by their role, groups they belong to and permissions
Using Role(ADMIN, PATIENT, DOCTOR, NURSE) to assign to user when they are created
Using email as username to login
"""


class User(AbstractUser):
    email = models.EmailField(_('email address'), unique=True)
    full_name = models.CharField(_("full name"),max_length=255)
    username = models.CharField(max_length=50)
    avatar = CloudinaryField('avatar', null=True)
    phone_number = models.CharField(max_length=11, null=False)
    date_of_birth = models.DateTimeField(blank=True)
    age = models.PositiveIntegerField(null=False)  # PositiveIntegerField - User must enter age > 0
    address = models.CharField(max_length=255, null=False)

    class Role(models.TextChoices):
        ADMIN = "ADMIN", _("Admin")
        PATIENT = "PATIENT", _("Patient")
        DOCTOR = "DOCTOR", _("Doctor")
        NURSE = "NURSE", _("Nurse")

    role = models.CharField(_('role'), max_length=50, choices=Role.choices, default=Role.PATIENT)

    """
    is_staff = models.BooleanField(default=False)#permisson to login admin site
    is_superuser = models.BooleanField(default=False)#superuser
    is_active = models.BooleanField(default=True)
    is_patient = models.BooleanField(default=False)
    is_doctor = models.BooleanField(default=False)
    is_nurse = models.BooleanField(default=False)
    """

    USERNAME_FIELD = 'email'  # using eamil to login
    REQUIRED_FIELDS = ['user_name']  # require when create superuser

    objects = CustomUserManager()

    def __str__(self):
        return self.email
    """
    age = models.IntegerField(null=False)
    address = models.CharField(max_length=100, null=False)
    phone_number = models.CharField(max_length=10, null=False)
    """


class BaseModel(models.Model):
    created_date = models.DateField(auto_now_add=True)
    updated_date = models.DateField(auto_now=True)
    # active = models.BooleanField(default=True)

    class Meta:
        abstract = True


"""
class Patient(User):
    avatar = CloudinaryField('avatar', null=False)

class ShiftSchedule(BaseModel):
    staff = models.ForeignKey('Staff', on_delete=models.CASCADE)
    shift_date = models.DateField()
    shift_start_time = models.TimeField()
    shift_end_time = models.TimeField()


class Staff(User):
    pass


class Doctor(Staff):
    pass


class Nurse(Staff):
    pass
"""