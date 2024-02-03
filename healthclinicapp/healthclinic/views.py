from django.shortcuts import render
from rest_framework import viewsets, generics
from .models import User, Patient, Employee
from healthclinic import serializers
# Create your views here.


class UserViewSet(viewsets.ModelViewSet, generics.ListAPIView):
    queryset = User.objects.all()
    serializer_class = serializers.UserSerializer
