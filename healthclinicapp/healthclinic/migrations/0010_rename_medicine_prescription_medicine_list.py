# Generated by Django 5.0.1 on 2024-02-20 03:08

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('healthclinic', '0009_rename_medicine_list_prescription_medicine'),
    ]

    operations = [
        migrations.RenameField(
            model_name='prescription',
            old_name='medicine',
            new_name='medicine_list',
        ),
    ]
