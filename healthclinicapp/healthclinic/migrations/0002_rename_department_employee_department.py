# Generated by Django 5.0.1 on 2024-02-23 07:44

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('healthclinic', '0001_initial'),
    ]

    operations = [
        migrations.RenameField(
            model_name='employee',
            old_name='Department',
            new_name='department',
        ),
    ]