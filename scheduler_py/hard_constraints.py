import random
from typing import List, Dict, Any, Tuple

from .models import Cabin, ActivityArea, Period, Assignment, DoubleBookingLikelihood
from .utils import (
    get_area_utilization,
    get_last_cabin_area,
    calculate_travel_time,
    has_cabin_used_area_recently,
)

def check_hard_constraints(
    cabin: Cabin,
    area: ActivityArea,
    period: Period,
    assignments: List[Assignment],
    config: Dict[str, Any],
    periods: List[Period]
) -> Tuple[bool, str]:
    """
    Check if a cabin can be assigned to an area during a period based on all hard constraints.
    Returns a tuple of (isValid, reason).
    """
    if is_cabin_already_assigned(cabin.id, period.day, period.id, assignments):
        return False, "Cabin already assigned during this period"

    if not check_area_capacity(area, period.day, period.id, assignments):
        return False, "Area at maximum capacity"

    if not check_area_conflicts(area, period.day, period.id, assignments):
        return False, "Area conflict detected"

    if not check_travel_time_constraints(cabin, area, period, assignments, config, periods):
        return False, "Excessive travel time between areas"

    if not check_fixed_area_closures(area, period):
        return False, "Area closed during this period"

    if not check_no_repeats_rule(cabin.id, area.id, period.day, assignments, config):
        return False, "Cabin used this area too recently"

    if not check_buffer_periods(area, period.day, period.id, assignments):
        return False, "Buffer period required after previous use"

    if not check_cabin_blackout_periods(cabin, period):
        return False, "Cabin blacked out during this period"

    if not check_cabin_blackout_areas(cabin, area):
        return False, "Cabin blacked out from this area"

    return True, "All hard constraints satisfied"

def is_cabin_already_assigned(cabin_id: str, day: int, period_id: str, assignments: List[Assignment]) -> bool:
    """Check if a cabin is already assigned during a specific period."""
    return any(a.cabin_id == cabin_id and a.day == day and a.period_id == period_id for a in assignments)

def check_area_capacity(area: ActivityArea, day: int, period_id: str, assignments: List[Assignment]) -> bool:
    """Check if area capacity constraints are satisfied."""
    current_utilization = get_area_utilization(area.id, assignments, day, period_id)
    return current_utilization < area.max_capacity

def check_area_conflicts(area: ActivityArea, day: int, period_id: str, assignments: List[Assignment]) -> bool:
    """Check for area conflicts (mutually exclusive areas)."""
    if not area.linked_areas:
        return True
    for linked_area_id in area.linked_areas:
        if get_area_utilization(linked_area_id, assignments, day, period_id) > 0:
            return False
    return True

def check_travel_time_constraints(cabin: Cabin, area: ActivityArea, period: Period, assignments: List[Assignment], config: Dict[str, Any], all_periods: List[Period]) -> bool:
    """Check travel time constraints between consecutive periods."""
    last_area_id = get_last_cabin_area(cabin.id, assignments, period.day, period.id, all_periods)
    if not last_area_id:
        return True

    last_area = next((a for a in config.get("areas", []) if a.id == last_area_id), None)
    if not last_area:
        return True

    travel_time = calculate_travel_time(last_area, area)
    max_allowed_time = config.get("allowedTransitionTime", 30)
    return travel_time <= max_allowed_time

def check_fixed_area_closures(area: ActivityArea, period: Period) -> bool:
    """Check if area is closed during the period."""
    return area.id not in period.blackout_areas

def check_no_repeats_rule(cabin_id: str, area_id: str, day: int, assignments: List[Assignment], config: Dict[str, Any]) -> bool:
    """Check no repeats rule."""
    no_repeats_days = config.get("noRepeatsDays", 3)
    return not has_cabin_used_area_recently(cabin_id, area_id, assignments, day, no_repeats_days)

def check_buffer_periods(area: ActivityArea, day: int, period_id: str, assignments: List[Assignment]) -> bool:
    """Check buffer periods after area use."""
    if area.buffer_periods == 0:
        return True
    return not any(a.area_id == area.id and a.day == day and a.period_id != period_id for a in assignments)

def check_cabin_blackout_periods(cabin: Cabin, period: Period) -> bool:
    """Check if cabin is blacked out during the period."""
    return period.id not in cabin.restrictions.blackout_periods

def check_cabin_blackout_areas(cabin: Cabin, area: ActivityArea) -> bool:
    """Check if cabin is blacked out from the area."""
    return area.id not in cabin.restrictions.blackout_areas

def is_double_booking_allowed(area: ActivityArea) -> bool:
    """Check if double booking is allowed for an area."""
    if area.double_booking.likelihood == DoubleBookingLikelihood.NEVER:
        return False
    if area.double_booking.likelihood == DoubleBookingLikelihood.ALWAYS:
        return True
    if area.double_booking.likelihood == DoubleBookingLikelihood.SOMETIMES:
        return random.random() < 0.3  # 30% chance
    return False

def is_area_alternating_days(area: ActivityArea) -> bool:
    """Check if area alternates days and is exempt from other rules."""
    return area.alternates_days
