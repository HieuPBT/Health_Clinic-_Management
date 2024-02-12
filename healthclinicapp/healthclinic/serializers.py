from rest_framework import serializers
from .models import CustomUser, Patient, Employee, Appointment


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['email', 'password', 'avatar', 'date_of_birth']

    def create(self, validated_data):
        # create new user - POST request
        user = CustomUser
        data = validated_data.copy()
        user = CustomUser(**data)
        user.set_password(data['password'])
        user.save()
        return user

    def update(self, instance, validated_data):
        # change password - PUT request
        password = validated_data.get('password')
        if not password:
            raise serializers.ValidationError("Password must be set")

        instance.set_password(password)
        instance.save()
        return instance


class AppointmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Appointment
        fields = '__all__'


class AppointmentConfirmSerializer(serializers.ModelSerializer):
    class Meta:
        model = Appointment
        fields = ['is_confirm', 'confirmed_by']