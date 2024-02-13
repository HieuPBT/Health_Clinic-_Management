from django.shortcuts import render
from rest_framework import viewsets, generics, status, views
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.views import APIView

from healthclinic import serializers, paginators, models
# Create your views here.


class UserViewSet(viewsets.ModelViewSet):
    queryset = models.CustomUser.objects.all()
    #permission_classes = [IsAuthenticated]
    serializer_class = serializers.UserSerializer
    pagination_class = paginators.UserPagination


class PatientViewSet(viewsets.ModelViewSet):
    queryset = models.CustomUser.objects.all()
    serializer_class = serializers.PatientSerializer


class CreateUserWithPatient(views.APIView):
    def post(self, request, format=None):
        serializer = serializers.CreateUserWithPatientSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class AppointmentListCreate(generics.ListCreateAPIView):
    queryset = models.Appointment.objects.all()
    serializer_class = serializers.AppointmentSerializer


class AppointmentConfirm(generics.RetrieveUpdateDestroyAPIView):
    queryset = models.Appointment.objects.all()

    def get_serializer_class(self):
        if self.request.method == 'PATCH':
            return serializers.AppointmentConfirmSerializer
        return serializers.AppointmentSerializer

    def confirm(self, serializer):
        serializer.save(confirmed_by=self.request.user)
