from rest_framework import serializers
from .models import User, Patient, Employee


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['email', 'password', 'avatar', 'date_of_birth']

    def create(self, validated_data):
        user = User
        data = validated_data.copy()
        user = User(**data)
        user.set_password(data['password'])
        user.save()
        return user
