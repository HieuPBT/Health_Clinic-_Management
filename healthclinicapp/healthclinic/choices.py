from django.db import models
from django.utils.translation import gettext_lazy as _


class Role(models.TextChoices):
    ADMIN = "ADMIN", _("Admin")
    PATIENT = "PATIENT", _("Patient")
    DOCTOR = "DOCTOR", _("Doctor")
    NURSE = "NURSE", _("Nurse")


class Gender(models.TextChoices):
    MALE = "MALE", _('Male')
    FEMALE = "FEMALE", _('Female')
    OTHER = "OTHER", _('Other')


class Department(models.TextChoices):
    DERMATOLOGY = "DERMATOLOGY", _('Dermatology')
    COSMETIC = "COSMETIC", _('COSMETIC')