from django.db.models import Count, Sum, functions
from datetime import datetime
from .models import *


def count_patient_appointments_by_period(period, year=None):
    if year is None:
        year = datetime.now().year

    if period == 'month':
        annotations = {
            'period': functions.ExtractMonth('booking_date'),
        }
    elif period == 'quarter':
        annotations = {
            'period': functions.ExtractQuarter('booking_date'),
        }
    elif period == 'year':
        annotations = {
            'period': functions.ExtractYear('booking_date'),
        }
    else:
        raise ValueError("Invalid period. Choose from 'month', 'quarter', or 'year'.")

    appointments_by_period = (
        Appointment.objects
        .filter(booking_date__year=year)
        .annotate(**annotations)
        .values('period')
        .annotate(count=Count('id'))
        .order_by('period')
    )

    # Format results into a dictionary
    results = {item['period']: item['count'] for item in appointments_by_period}

    return results


def calculate_revenue_by_period(period, year=None):
    if year is None:
        year = datetime.now().year

    if period == 'month':
        annotations = {
            'period': functions.ExtractMonth('prescription__appointment__booking_date'),
        }
    elif period == 'quarter':
        annotations = {
            'period': functions.ExtractQuarter('prescription__appointment__booking_date'),
        }
    elif period == 'year':
        annotations = {
            'period': functions.ExtractYear('prescription__appointment__booking_date'),
        }
    else:
        raise ValueError("Invalid period. Choose from 'month', 'quarter', or 'year'.")

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
