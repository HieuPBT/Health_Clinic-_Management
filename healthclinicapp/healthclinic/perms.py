from rest_framework import permissions


class OwnerAuthenticated(permissions.IsAuthenticated):
    def has_object_permission(self, request, view, obj):
        return self.has_permission(request, view) and request.user == obj.user


class IsNurse(permissions.BasePermission):
    def has_permission(self, request, view):
        # Kiểm tra xem người dùng đã xác thực chưa
        if request.user.is_authenticated:
            # Kiểm tra vai trò của người dùng là 'NURSE' hay không
            return request.user.role == 'NURSE'
        return False


class IsDocotor(permissions.BasePermission):
    def has_permission(self, request, view):
        # Kiểm tra xem người dùng đã xác thực chưa
        if request.user.is_authenticated:
            # Kiểm tra vai trò của người dùng là 'Doctor' hay không
            return request.user.role == 'DOCTOR'
        return False


class IsEmployee(permissions.BasePermission):
    def has_permission(self, request, view):
        # Kiểm tra xem người dùng đã xác thực chưa
        if request.user.is_authenticated:
            # Kiểm tra vai trò của người dùng là 'Doctor' hay không
            return request.user.role in ['NURSE', 'DOCTOR']
        return False
