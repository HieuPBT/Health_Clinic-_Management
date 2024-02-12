from django.shortcuts import render
from rest_framework import viewsets, generics
from .models import CustomUser, Patient, Employee, Appointment
from healthclinic import serializers, paginators
# Create your views here.


class UserViewSet(viewsets.ModelViewSet, generics.ListAPIView):
    queryset = CustomUser.objects.all()
    serializer_class = serializers.UserSerializer
    pagination_class = paginators.UserPagination


class AppointmentListCreate(generics.ListCreateAPIView):
    queryset = Appointment.objects.all()
    serializer_class = serializers.AppointmentSerializer


class AppointmentConfirm(generics.RetrieveUpdateDestroyAPIView):
    queryset = Appointment.objects.all()

    def get_serializer_class(self):
        if self.request.method == 'PATCH':
            return serializers.AppointmentConfirmSerializer
        return serializers.AppointmentSerializer

    def confirm(self, serializer):
        serializer.save(confirmed_by=self.request.user)
