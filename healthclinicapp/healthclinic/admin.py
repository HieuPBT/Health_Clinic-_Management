import django.apps.registry
from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin, GroupAdmin
from django.contrib.auth.models import Group
from django.shortcuts import render
from django.template.response import TemplateResponse
from django.urls import path
from django.utils.safestring import mark_safe
from .forms import *
from .models import *
from .dao import *
# Register your models here.


class HealthClinicAppAdminSite(admin.AdminSite):
    site_header = 'Hệ thống Quản Lý Phòng Mạch Tư Lộc Hiếu'

    def get_urls(self):
        return  [
            path('stats/', self.stats_view)
        ] + super().get_urls()

    def stats_view(self, request):
        period = request.GET.get('period', 'month')
        patient_stats = count_patient_appointments_by_period(period=period)
        revenue_stats = calculate_revenue_by_period(period=period)

        context = {
            'patient_stats': patient_stats,
            'revenue_stats': revenue_stats,
            'period': period
        }

        return render(request, 'admin/stats.html', context)


admin_site = HealthClinicAppAdminSite(name='myadmin')


class UserAdmin(BaseUserAdmin):
    form = CustomUserChangeForm
    add_form = CustomUserCreationForm

    list_display = ('id', 'email', 'role', 'is_active', 'is_staff', 'is_superuser', 'last_login', 'date_joined')
    list_filter = ('role',)
    fieldsets = (
        (None, {'fields': ('email', 'password', 'role')}),
        ('Permission', {'fields': ('is_staff', 'is_active', 'is_superuser', 'groups', 'user_permissions')}),
        ('Personal info', {'fields': ('full_name', 'gender', 'date_of_birth', 'phone_number', 'address', 'avatar')}),
    )
    add_fieldsets = (
        (None,
         {'fields': ('email', 'password1', 'password2', 'role')}),
        ('Permission', {'fields': ('is_staff', 'is_active', 'is_superuser', 'groups', 'user_permissions')}),
        ('Personal info', {'fields': ('full_name', 'gender', 'date_of_birth', 'phone_number', 'address', 'avatar')}),
    )
    search_fields = ('email',)
    ordering = ('id',)
    filter_horizontal = ()


class EmployeeAdmin(admin.ModelAdmin):
    list_display = ['user', 'department']
    list_filter = ['shift', 'department']
    search_fields = ['user__email', 'department']


class ScheduleAdmin(admin.ModelAdmin):
    list_display = ['id', 'employee', 'shift', 'start_date', 'end_date']
    ordering = ['id']
    list_filter = ['shift']
    search_fields = ['employee', 'shift']


class ShiftAdmin(admin.ModelAdmin):
    list_display = ['id', 'start_time', 'end_time']
    search_fields = ['start_time', 'end_time']
    list_filter = ['start_time', 'end_time']
    ordering = ['id']


class MedicineCategoryAdmin(admin.ModelAdmin):
    list_display = ['id', 'name']
    search_fields = ['name']
    list_filter = ['name']
    ordering = ['id']


class MedicineAdmin(admin.ModelAdmin):
    list_display = ['id', 'name', 'unit', 'category']
    search_fields = ['name', 'category__name']
    list_filter = ['name', 'unit', 'category']
    ordering = ['id']


admin_site.register(User, UserAdmin)
admin_site.register(Employee, EmployeeAdmin)
admin_site.register(Shift, ShiftAdmin)
admin_site.register(Schedule, ScheduleAdmin)
admin_site.register(Medicine, MedicineAdmin)
admin_site.register(MedicineCategory, MedicineCategoryAdmin)
admin_site.register(Group, GroupAdmin)
