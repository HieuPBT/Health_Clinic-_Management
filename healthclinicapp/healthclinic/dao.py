from django.db.models import Count, Sum
from datetime import datetime
from .models import *


def count_patient_appointments_by_period(period, year=None):
    # lấy năm hiện tại
    if year is None:
        year = datetime.now().year

    if period == 'month':
        annotations = {
            'period': models.functions.ExtractMonth('booking_date'),
        }
    elif period == 'quarter':
        annotations = {
            'period': models.functions.ExtractQuarter('booking_date'),
        }
    elif period == 'year':
        annotations = {
            'period': models.functions.ExtractYear('booking_date'),
        }
    else:
        raise ValueError("Invalid period. Choose from 'month', 'quarter', or 'year'.")

    # count
    appointments_by_period = (
        Appointment.objects
        .filter(booking_date__year=year)
        .annotate(**annotations)
        .values('period')
        .annotate(count=Count('id'))
        .order_by('period')
    )

    results = {item['period']: item['count'] for item in appointments_by_period}

    return results


def calculate_revenue_by_period(period, year=None):
    # lấy năm hiện tại
    if year is None:
        year = datetime.now().year

    if period == 'month':
        annotations = {
            'period': models.functions.ExtractMonth('prescription__appointment__booking_date'),
        }
    elif period == 'quarter':
        annotations = {
            'period': models.functions.ExtractQuarter('prescription__appointment__booking_date'),
        }
    elif period == 'year':
        annotations = {
            'period': models.functions.ExtractYear('prescription__appointment__booking_date'),
        }
    else:
        raise ValueError("Invalid period. Choose from 'month', 'quarter', or 'year'.")

    # sum
    revenue_by_period = (
        Invoice.objects
        .filter(prescription__appointment__booking_date__year=year)
        .annotate(**annotations)
        .values('period')
        .annotate(revenue=Sum('appointment_fee') + Sum('prescription_fee'))
        .order_by('period')
    )

    results = {item['period']: item['revenue'] for item in revenue_by_period}

    return results
