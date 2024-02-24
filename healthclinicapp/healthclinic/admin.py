from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.utils.safestring import mark_safe
from .forms import CustomUserChangeForm, CustomUserCreationForm, AppointmentForm
from .models import *
# Register your models here.


class UserAdmin(BaseUserAdmin):
    # The forms to add and change user instances
    form = CustomUserChangeForm
    add_form = CustomUserCreationForm

    # The fields to be used in displaying the User model.
    # These override the definitions on the base UserAdmin
    # that reference specific fields on auth.User.
    list_display = ('id', 'email', 'role', 'is_active', 'is_staff', 'is_superuser', 'last_login', 'date_joined')
    list_filter = ('role',)
    fieldsets = (
        (None, {'fields': ('email', 'password', 'role')}),
        ('Permission', {'fields': ('is_staff', 'is_active', 'is_superuser', 'groups', 'user_permissions')}),
        ('Personal info', {'fields': ('full_name', 'gender', 'date_of_birth', 'phone_number', 'address', 'avatar')}),
    )
    # add_fieldsets is not a standard ModelAdmin attribute. UserAdmin
    # overrides get_fieldsets to use this attribute when creating a user.
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


class PatientAdmin(admin.ModelAdmin):
    list_display = ['id', 'patient__full_name']
    readonly_fields = ['avatar']

    def avatar(self, obj):
        if obj:
            return mark_safe(
                '<img src="/static/{url}" width="120" />'\
                    .format(url=obj.image.name)
            )


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


class AppointmentAdmin(admin.ModelAdmin):
    list_display = ['id', 'patient', 'department', 'booking_date', 'booking_time',  'status', 'confirmed_by']
    search_fields = ['patient']
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


class PrescriptionAdmin(admin.ModelAdmin):
    list_display = ['id', 'appointment', 'doctor']
    search_fields = ['id']
    ordering = ['id']


admin.site.register(User, UserAdmin)
admin.site.register(Patient)
admin.site.register(Employee, EmployeeAdmin)
admin.site.register(Shift, ShiftAdmin)
admin.site.register(Schedule, ScheduleAdmin)
admin.site.register(Appointment, AppointmentAdmin)
admin.site.register(Medicine, MedicineAdmin)
admin.site.register(MedicineCategory, MedicineCategoryAdmin)
admin.site.register(Prescription, PrescriptionAdmin)
admin.site.register(PrescriptionMedicine)
admin.site.register(Invoice)
