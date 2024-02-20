# Generated by Django 5.0.1 on 2024-02-18 03:51

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('healthclinic', '0005_medicinecategory_medicine'),
    ]

    operations = [
        migrations.CreateModel(
            name='Prescription',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created_date', models.DateField(auto_now_add=True)),
                ('updated_date', models.DateField(auto_now=True)),
                ('description', models.CharField(blank=True, max_length=255)),
                ('conclusion', models.CharField(blank=True, max_length=255)),
                ('appointment', models.ForeignKey(on_delete=django.db.models.deletion.RESTRICT, to='healthclinic.appointment')),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='PrescriptionMedicine',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('quantity', models.PositiveIntegerField(default=1)),
                ('medicine', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='healthclinic.medicine')),
                ('prescription', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='healthclinic.prescription')),
            ],
        ),
        migrations.AddField(
            model_name='prescription',
            name='medicine',
            field=models.ManyToManyField(through='healthclinic.PrescriptionMedicine', to='healthclinic.medicine'),
        ),
    ]
