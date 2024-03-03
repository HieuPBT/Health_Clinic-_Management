from rest_framework.pagination import PageNumberPagination

"""
set number of results per page
"""


class UserPagination(PageNumberPagination):
    page_size = 3


class AppointmentPagination(PageNumberPagination):
    page_size = 10


class PrescriptionPagination(PageNumberPagination):
    page_size = 10


class InvoicePagination(PageNumberPagination):
    page_size = 10
