from typing import List, Optional
from .models import Period, ActivityArea, Cabin, Assignment

def get_periods_per_day(periods: List[Period]) -> float:
    """Get the number of periods per day."""
    if not periods:
        return 0
    unique_days = len(set(p.day for p in periods))
    return len(periods) / unique_days if unique_days > 0 else 0

def get_periods_for_day(periods: List[Period], day: int) -> List[Period]:
    """Get all periods for a specific day."""
    return [p for p in periods if p.day == day]

def get_periods_across_days(periods: List[Period], period_id: str) -> List[Period]:
    """Get all periods for a specific time slot across all days."""
    return [p for p in periods if p.id == period_id]

def are_periods_consecutive(period1: Period, period2: Period) -> bool:
    """Check if two periods are consecutive."""
    if period1.day != period2.day:
        return False
    return period1.end_time == period2.start_time

def calculate_travel_time(area1: ActivityArea, area2: ActivityArea) -> int:
    """Calculate travel time between two areas."""
    base_travel_time = abs(area1.travel_time - area2.travel_time)
    return max(base_travel_time, 5)  # Minimum 5 minutes

def get_last_cabin_area(cabin_id: str, assignments: List[Assignment], current_day: int, current_period_id: str, periods: List[Period]) -> Optional[str]:
    """Get the last area a cabin was assigned to."""
    cabin_assignments = sorted(
        [a for a in assignments if a.cabin_id == cabin_id],
        key=lambda a: (a.day, [p.start_time for p in periods if p.id == a.period_id and p.day == a.day][0])
    )

    last_assignment = None
    for assignment in cabin_assignments:
        if assignment.day < current_day:
            last_assignment = assignment
        elif assignment.day == current_day:
            # Find the period objects to compare their start times
            current_period_start_time = next((p.start_time for p in periods if p.id == current_period_id and p.day == current_day), None)
            assignment_period_start_time = next((p.start_time for p in periods if p.id == assignment.period_id and p.day == assignment.day), None)

            if current_period_start_time is not None and assignment_period_start_time is not None:
                if assignment_period_start_time < current_period_start_time:
                    last_assignment = assignment

    return last_assignment.area_id if last_assignment else None


def has_cabin_used_area_recently(cabin_id: str, area_id: str, assignments: List[Assignment], day: int, days_to_check: int) -> bool:
    """Check if a cabin has been assigned to an area recently."""
    cutoff_day = max(1, day - days_to_check)
    return any(
        a.cabin_id == cabin_id and a.area_id == area_id and a.day >= cutoff_day and a.day < day
        for a in assignments
    )

def get_area_utilization(area_id: str, assignments: List[Assignment], day: int, period_id: str) -> int:
    """Get current utilization count for an area."""
    return sum(
        1
        for a in assignments
        if a.area_id == area_id and a.day == day and a.period_id == period_id
    )

def is_area_available(area: ActivityArea, periods: List[Period], day: int, period_id: str) -> bool:
    """Check if an area is available during a specific period."""
    period = next((p for p in periods if p.id == period_id and p.day == day), None)
    if not period:
        return False

    if area.id in period.blackout_areas:
        return False

    if area.alternates_days:
        day_offset = area.alternate_day_offset or 0
        return (day + day_offset) % 2 == 0

    return True

def get_candidate_areas(cabin: Cabin, areas: List[ActivityArea], periods: List[Period], day: int, period_id: str) -> List[ActivityArea]:
    """Get candidate areas for a cabin during a specific period."""
    candidate_areas = []
    for area in areas:
        if not is_area_available(area, periods, day, period_id):
            continue

        if area.id in cabin.restrictions.blackout_areas:
            continue

        # Accessibility checks
        if area.accessibility.forbidden and cabin.age_group in area.accessibility.forbidden:
            continue
        if area.accessibility.allowed and cabin.age_group not in area.accessibility.allowed:
            continue

        candidate_areas.append(area)
    return candidate_areas
