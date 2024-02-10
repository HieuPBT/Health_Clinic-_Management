from django.contrib.auth.base_user import BaseUserManager
from django.utils.translation import gettext_lazy as _

"""
CustomUserManager has two method: 
    + create_user() -> create regular user 
    + create_superuser() -> create super user
Extend create_user() method to create super user
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
        user.role = user.role.ADMIN
        user.is_superuser = True
        user.is_staff = True
        user.set_password(password)
        user.save()
        return user
