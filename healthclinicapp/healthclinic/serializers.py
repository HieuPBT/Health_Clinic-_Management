from django.contrib.auth.models import Group
from rest_framework import serializers
from healthclinic import models
from healthclinicapp import settings


class PatientSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Patient
        fields = ['health_insurance',]


class UserSerializer(serializers.ModelSerializer):
    patient = PatientSerializer(required=False)

    class Meta:
        model = models.User
        fields = ['email', 'password', 'full_name', 'role', 'avatar', 'gender', 'date_of_birth', 'phone_number', 'address', 'patient']
        extra_kwargs = {'password': {'write_only': True}} # Ensure password is write-only

    def create(self, validated_data):
        patient_data = validated_data.pop('patient', None) # Extract patient data if exists
        user = models.User.objects.create_user(**validated_data) # Create the user
         # require account verification to login
        if patient_data:
            models.Patient.objects.create(user=user, **patient_data) # Create associated patient if data exists

        user.groups.add(Group.objects.get(name='PATIENT'))
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
                models.Patient.objects.create(user=user, **patient_data) # Create associated patient if data exists
        return user


class UserListSerializer(serializers.ModelSerializer):
    avatar = serializers.SerializerMethodField(source='avatar')
    patient = PatientSerializer(required=False)

    class Meta:
        model = models.User
        fields = ['id','email', 'password', 'full_name', 'role', 'avatar', 'gender', 'date_of_birth', 'phone_number', 'address', 'patient']
        extra_kwargs = {'password': {'write_only': True}} # Ensure password is write-only

    # return avatar absolute url
    def get_avatar(self, customuser):
        if customuser.avatar:
            request = self.context.get('request')
            if request: # url -> uri
                return request.build_absolute_uri(settings.CLOUDINARY_BASE_URL % customuser.avatar)
            return settings.CLOUDINARY_BASE_URL % customuser.avatar


class UserAppointmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.User
        fields = ['id', 'email', 'full_name']


class NurseAppointmentSerializer(serializers.ModelSerializer):
    patient = UserAppointmentSerializer()

    class Meta:
        model = models.Appointment
        exclude = ['updated_date', 'confirmed_by', 'created_date']


class AppointmentSerializer(serializers.ModelSerializer):
    # create appointment
    class Meta:
        model = models.Appointment
        exclude = ['patient', 'confirmed_by', 'updated_date']


class AppointmentCreateSerializer(serializers.ModelSerializer):
    # create appointment

    class Meta:
        model = models.Appointment
        fields =['department', 'booking_date', 'booking_time']


class AppointmentListSerializer(serializers.ModelSerializer):
    # list appointment
    patient = serializers.SerializerMethodField()

    class Meta:
        model = models.Appointment
        fields = '__all__'

    def get_patient(self, appointment):
        patient_data = UserListSerializer(appointment.patient, context=self.context).data
        patient_data.pop('role', None)  # Loại bỏ trường role nếu tồn tại
        return patient_data


class AppointmentCancelSerializer(serializers.ModelSerializer):
    # nurse confirm appointment
    class Meta:
        model = models.Appointment
        fields = ['status']


class MedicineSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Medicine
        fields = ['id', 'name', 'unit']


class PrescriptionMedicineSerializer(serializers.ModelSerializer):
    medicine = MedicineSerializer()
    quantity = serializers.IntegerField(min_value=1)

    class Meta:
        model = models.PrescriptionMedicine
        fields = ['medicine', 'quantity', 'note']


class PrescriptionSerializer(serializers.ModelSerializer):
    medicine_list = PrescriptionMedicineSerializer(many=True, source='prescriptionmedicine_set')

    class Meta:
        model = models.Prescription
        fields = ['id', 'doctor', 'appointment', 'description', 'conclusion', 'created_date', 'medicine_list']


class PrescriptionMedicineCreateSerializer(serializers.ModelSerializer):
    quantity = serializers.IntegerField(min_value=1)

    class Meta:
        model = models.PrescriptionMedicine
        fields = ['medicine', 'quantity', 'note']


class PrescriptionCreateSerializer(serializers.ModelSerializer):
    medicine_list = PrescriptionMedicineCreateSerializer(many=True, source='prescriptionmedicine_set')

    class Meta:
        model = models.Prescription
        fields = ['id', 'appointment', 'description', 'conclusion', 'medicine_list']

    def validate_medicine_list(self, value):
        medicine_ids = [item['medicine'].id for item in value]
        medicines_exist = models.Medicine.objects.filter(id__in=medicine_ids).count() == len(medicine_ids)

        if not medicines_exist:
            raise serializers.ValidationError("One or more medicines do not exist in the database.")

        return value

    def create(self, validated_data):
        medicine_list_data = validated_data.pop('prescriptionmedicine_set')
        prescription = models.Prescription.objects.create(**validated_data)
        for medicine_data in medicine_list_data:
            models.PrescriptionMedicine.objects.create(prescription=prescription, **medicine_data)
        return prescription


class TodayPrescriptionSerializer(serializers.ModelSerializer):
    medicine_list = PrescriptionMedicineCreateSerializer(many=True, source='prescriptionmedicine_set')
    appointment = NurseAppointmentSerializer()

    class Meta:
        model = models.Prescription
        fields = ['id', 'appointment', 'description', 'conclusion', 'medicine_list']


class InvoiceSerializer(serializers.ModelSerializer):

    class Meta:
        model = models.Invoice
        exclude = ['nurse', 'prescription']
