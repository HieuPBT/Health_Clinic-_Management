from django.shortcuts import render
from rest_framework import viewsets, generics
from .models import CustomUser, Patient, Employee
from healthclinic import serializers, paginators
# Create your views here.


class UserViewSet(viewsets.ModelViewSet, generics.ListAPIView):
    queryset = CustomUser.objects.all()
    serializer_class = serializers.UserSerializer
    pagination_class = paginators.UserPagination
