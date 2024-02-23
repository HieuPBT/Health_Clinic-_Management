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
    OTORHINOLARYNGOLOGY = "TAI MŨI HỌNG"
    OBSTETRICS_GYNECOLOGY = "PHỤ SẢN"
    DERMATOLOGY = "DA LIỄU"
    PLASTIC_SURGERY = "THẨM MỸ"
    ORTHOPEDICS = "XƯƠNG KHỚP"
    OPHTHALMOLOGY = "MẮT"
    DENTISTRY = "RĂNG HÀM MẶT"
    PSYCHIATRY = "TÂM THẦN"
    TRADITIONAL_MEDICINE = "Y HỌC CỔ TRUYỀN"
    ENDOCRINOLOGY = "NGOẠI TIẾT"


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
