from django.contrib.auth import get_user_model
from django.contrib.sites.models import Site
from django.core.mail import send_mail
from django.db.models.signals import post_save
from django.dispatch import receiver
from django.template.loader import render_to_string
from django.utils.encoding import force_bytes
from django.utils.http import urlsafe_base64_encode
from healthclinic.models import User
from healthclinic.token import account_activation_token
from healthclinicapp import settings


@receiver(post_save, sender=get_user_model())
def send_activation_email(sender, instance, created, **kwargs):
    if created:
        current_site = Site.objects.get_current()
        subject = 'Activate your account'
        message= render_to_string('email/account_activate.html', {
            'user': instance,
            'domain': '127.0.0.1:8000',
            'uid': urlsafe_base64_encode(force_bytes(instance.pk)),
            'token': account_activation_token.make_token(instance),
        })
        send_mail(subject, message, settings.EMAIL_HOST_USER, [instance.email], fail_silently=False)