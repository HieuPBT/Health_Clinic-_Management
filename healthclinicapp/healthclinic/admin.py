from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.utils.safestring import mark_safe
from .forms import CustomUserChangeForm, CustomUserCreationForm
from .models import CustomUser, Patient, Employee
# Register your models here.


class UserAdmin(BaseUserAdmin):
    # The forms to add and change user instances
    form = CustomUserChangeForm
    add_form = CustomUserCreationForm

    # The fields to be used in displaying the User model.
    # These override the definitions on the base UserAdmin
    # that reference specific fields on auth.User.
    list_display = ('id','email', 'role','last_login', 'date_joined')
    list_filter = ('id', 'email', 'role')
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
    ordering = ('email',)
    filter_horizontal = ()


class PatientAdmin(admin.ModelAdmin):
    list_display = []
    readonly_fields = ['avatar']

    def avatar(self, obj):
        if obj:
            return mark_safe(
                '<img src="/static/{url}" width="120" />'\
                    .format(url=obj.image.name)
            )


admin.site.register(CustomUser, UserAdmin)
admin.site.register(Patient)
admin.site.register(Employee)
