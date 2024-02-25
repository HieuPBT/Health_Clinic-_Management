"""
WSGI config for healthclinicapp project.

It exposes the WSGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/5.0/howto/deployment/wsgi/
"""

import os
import time

from django.core.wsgi import get_wsgi_application

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'healthclinicapp.settings')

application = get_wsgi_application()

os.environ["TZ"] = "Asia/Bangkok"
time.tzset()