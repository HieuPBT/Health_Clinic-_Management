from django.db import models
from django.contrib.auth.models import AbstractUser
from cloudinary.models import CloudinaryField
# Create your models here.


class User(AbstractUser):
    age = models.IntegerField(null=False)
    address = models.CharField(max_length=100, null=False)
    phone_number = models.CharField(max_length=10, null=False)

    class Meta:
        abstract = True


class BaseModel(models.Model):
    created_date = models.DateField(auto_now_add=True)
    updated_date = models.DateField(auto_now=True)
    active = models.BooleanField(default=True)

    class Meta:
        abstract = True



class Patient(User):
    avatar = CloudinaryField('avatar', null=False)

class ShiftSchedule():
    pass


class Staff(User):
    pass