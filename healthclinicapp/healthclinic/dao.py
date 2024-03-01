from django.db.models import Count, Sum
from datetime import datetime
from .models import *


def count_patient_appointments_by_period(period, year=None):
    """
    Count patient appointments by period (month, quarter, year).

    :param period: 'month', 'quarter', or 'year'
    :param year: specific year (optional, default to current year)
    :return: Dictionary containing counts for each period
    """
    # Get current year if year is not provided
    if year is None:
        year = datetime.now().year

    # Define period annotations based on input period
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

    # Aggregate appointments based on period and count
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
    """
    Calculate revenue by period (month, quarter, year).

    :param period: 'month', 'quarter', or 'year'
    :param year: specific year (optional, default to current year)
    :return: Dictionary containing revenue for each period
    """
    # Get current year if year is not provided
    if year is None:
        year = datetime.now().year

    # Define period annotations based on input period
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

    # Aggregate revenue based on period and sum
    revenue_by_period = (
        Invoice.objects
        .filter(prescription__appointment__booking_date__year=year)
        .annotate(**annotations)
        .values('period')
        .annotate(revenue=Sum('appointment_fee') + Sum('prescription_fee'))
        .order_by('period')
    )

    # Format results into a dictionary
    results = {item['period']: item['revenue'] for item in revenue_by_period}

    return results
