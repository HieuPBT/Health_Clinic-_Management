from rest_framework import serializers
from healthclinic.models import User

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['first_name', 'last_name', 'username','password', 'email', 'role']
        extra_kwargs = {
            'password': {
                'write_only': True
            }
        }

        def create(self, validated_data):
            data = validated_data.copy()
            user = User(**data)
            user.set_password(data['passwprd'])
            user.save()
            return user