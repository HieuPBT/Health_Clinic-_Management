from django.apps import AppConfig


class HealthclinicConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'healthclinic'

    def ready(self):
        import healthclinic.signals
