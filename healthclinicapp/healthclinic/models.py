from django.db import models
from django.contrib.auth.models import AbstractUser, BaseUserManager
from django.utils import timezone
from django.utils.translation import gettext_lazy as _
from cloudinary.models import CloudinaryField

from healthclinicapp import settings

# Create your models here.
"""
UserManager has two method to create user, regular user - create_user(), super user - create_superuser()
We extend create_user() method to create super user, patient, nurse, doctor, etc
Class CustomUserManager only has method, no fields
"""


class CustomUserManager(BaseUserManager):
    # using email/password to login instead of username/password
    def create_user(self, email, password, **other_fields):
        if not email:
            raise ValueError(_("An email is required."))
        if not password:
            raise ValueError(_("A password is required."))

        # normalize and lower before save to db, exp abc@gmail.com == aBC@gMail.com
        email = self.normalize_email(email)
        email = email.lower()

        user = self.model(email=email, **other_fields)
        user.set_password(password)
        user.save()
        return user

    def create_superuser(self, email=None, password=None):
        user = self.create_user(email, password)
        user.is_superuser = True
        user.is_staff = True
        user.set_password(password)
        user.save()
        return user


"""
PATIENT, ADMIN, NURSE, DOCTOR -> all are USER
They can be can be distinguish by their role, groups they belong to and permissions
Using Role(ADMIN, PATIENT, DOCTOR, NURSE) to assign to user when they are created
Using email as username to login
"""


class Role(models.TextChoices):
    ADMIN = "ADMIN", _("Admin")
    PATIENT = "PATIENT", _("Patient")
    DOCTOR = "DOCTOR", _("Doctor")
    NURSE = "NURSE", _("Nurse")


class User(AbstractUser):
    username = None # not using username
    email = models.EmailField(_('email address'), unique=True) # using email for authentication
    phone_number = models.CharField(max_length=11, null=True, blank=True)
    date_of_birth = models.DateField(blank=True, null=True)
    sex = models.CharField(max_length=10, blank=True, null=True)
    avatar = CloudinaryField('avatar', null=True, blank=True)
    role = models.CharField(_('role'), max_length=50, choices=Role.choices, default=Role.PATIENT)

    USERNAME_FIELD = 'email'  # using email to login
    REQUIRED_FIELDS = []  # require when create superuser

    objects = CustomUserManager()

    def __str__(self):
        return self.email


class BaseModel(models.Model):
    created_date = models.DateField(auto_now_add=True)
    updated_date = models.DateField(auto_now=True)
    # active = models.BooleanField(default=True)

    class Meta:
        abstract = True


class Patient(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, primary_key=True)

    def __str__(self):
        return self.user.email


class Employee(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, primary_key=True)
    address = models.CharField(max_length=255, null=True, blank=True)

    def __str__(self):
        return self.user.email

