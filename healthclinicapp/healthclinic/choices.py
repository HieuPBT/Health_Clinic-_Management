from django.db import models
from django.utils.translation import gettext_lazy as _


class Role(models.TextChoices):
    ADMIN = "ADMIN", _("Admin")
    PATIENT = "PATIENT", _("Patient")
    DOCTOR = "DOCTOR", _("Doctor")
    NURSE = "NURSE", _("Nurse")


class Gender(models.TextChoices):
    MALE = "MALE", _('Nam')
    FEMALE = "FEMALE", _('Nữ')
    OTHER = "OTHER", _('Khác')


class Department(models.TextChoices):
    OTORHINOLARYNGOLOGY = "TAI MŨI HỌNG", _('TAI MŨI HỌNG')
    DERMATOLOGY = "DA LIỄU", _('DA LIỄU')
    PLASTIC_SURGERY = "THẨM MỸ", _('THẨM MỸ')
    OPHTHALMOLOGY = "MẮT", _('MẮT')
    DENTISTRY = "RĂNG HÀM MẶT", _('RĂNG HÀM MẶT')


class Status(models.TextChoices):
    CONFIRMED = "ĐÃ XÁC NHẬN"
    UNCONFIRMED = "CHƯA XÁC NHẬN"
    CANCELED = "ĐÃ HUỶ"
    PAID = "ĐÃ THANH TOÁN"
    UNPAID = "CHƯA THANH TOÁN"


class Payment(models.TextChoices):
    DIRECT = "TRỰC TIẾP"
    MOMO = "MOMO", _("Momo")
    ZALO_PAY = "ZALO_PAY", _("Zalo Pay")
