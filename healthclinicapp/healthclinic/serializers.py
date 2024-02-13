from rest_framework import serializers
from .models import CustomUser, Patient, Appointment


# class UserSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = CustomUser
#         fields = ['email', 'password', 'avatar', 'date_of_birth']
#
#     def create(self, validated_data):
#         # create new user - POST request
#         user = CustomUser
#         data = validated_data.copy()
#         user = CustomUser(**data)
#         user.set_password(data['password'])
#         user.save()
#         return user
#
#     def update(self, instance, validated_data):
#         # change password - PUT request
#         password = validated_data.get('password')
#         if not password:
#             raise serializers.ValidationError("Password must be set")
#
#         instance.set_password(password)
#         instance.save()
#         return instance


class PatientSerializer(serializers.ModelSerializer):
    class Meta:
        model = Patient
        fields = '__all__'


class UserSerializer(serializers.ModelSerializer):
    patient = PatientSerializer(required=False)

    class Meta:
        model = CustomUser
        fields = ['email', 'password', 'date_of_birth', 'patient']
        #extra_kwargs = {'password': {'write_only': True}} # Ensure password is write-only

    def create(self, validated_data):
        patient_data = validated_data.pop('patient', None) # Extract patient data if exists
        user = CustomUser.objects.create_user(**validated_data) # Create the user
        if patient_data:
            Patient.objects.create(user=user, **patient_data) # Create associated patient if data exists
        return user

    def update(self, instance, validated_data):
        patient_data = validated_data.pop('patient', None) # Extract patient data if exists
        patient = instance.patient
        user = super().update(instance, validated_data) # Update user fields
        if patient_data:
            if patient:
                for attr, value in patient_data.items():
                    setattr(patient, attr, value)
                patient.save()
            else:
                Patient.objects.create(user=user, **patient_data) # Create associated patient if data exists
        return user


class AppointmentSerializer(serializers.ModelSerializer):
    # create appointment
    class Meta:
        model = Appointment
        fields = '__all__'


class AppointmentConfirmSerializer(serializers.ModelSerializer):
    # nurse confirm appointment
    class Meta:
        model = Appointment
        fields = ['is_confirm', 'confirmed_by']