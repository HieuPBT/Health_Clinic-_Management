from rest_framework.permissions import BasePermission


class IsPatient(BasePermission):
    def has_permission(self, request, view):
        # Kiểm tra xem người dùng đã xác thực chưa
        if request.user.is_authenticated:
            # Kiểm tra vai trò của người dùng là 'PATIENT' hay không
            return request.user.role == 'PATIENT'
        return False


class PatientOwner(IsPatient):
    def has_object_permission(self, request, view, obj):
        return self.has_permission(request, view) and request.user == obj.patient


class IsNurse(BasePermission):
    def has_permission(self, request, view):
        # Kiểm tra xem người dùng đã xác thực chưa
        if request.user.is_authenticated:
            # Kiểm tra vai trò của người dùng là 'NURSE' hay không
            return request.user.role == 'NURSE'
        return False


class IsDoctor(BasePermission):
    def has_permission(self, request, view):
        # Kiểm tra xem người dùng đã xác thực chưa
        if request.user.is_authenticated:
            # Kiểm tra vai trò của người dùng là 'NURSE' hay không
            return request.user.role == 'DOCTOR'
        return False