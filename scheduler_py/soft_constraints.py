from typing import List, Dict, Any
from .models import ActivityArea, Cabin, Period, Assignment
from .utils import (
    get_last_cabin_area,
    calculate_travel_time,
    get_area_utilization,
)

def rank_candidate_areas(
    candidate_areas: List[ActivityArea],
    cabin: Cabin,
    period: Period,
    assignments: List[Assignment],
    config: Dict[str, Any],
    all_periods: List[Period]
) -> List[ActivityArea]:
    """Rank candidate areas based on soft constraints."""
    scored_areas = [
        (area, calculate_area_score(area, cabin, period, assignments, config, all_periods))
        for area in candidate_areas
    ]
    scored_areas.sort(key=lambda x: x[1], reverse=True)
    return [area for area, score in scored_areas]

def calculate_area_score(
    area: ActivityArea,
    cabin: Cabin,
    period: Period,
    assignments: List[Assignment],
    config: Dict[str, Any],
    all_periods: List[Period]
) -> float:
    """Calculate a score for an area based on soft constraints."""
    score = 100.0  # Base score

    score += calculate_age_group_priority_score(area, cabin, config)
    score += calculate_area_variety_score(area, cabin, period, assignments, config)
    score += calculate_social_grouping_score(area, cabin, period, assignments)
    score += calculate_preference_score(area, cabin)
    score += calculate_travel_time_score(area, cabin, period, assignments, config, all_periods)
    score += calculate_utilization_goal_score(area, period, assignments, config)
    score += calculate_weather_score(area, config)

    return max(0, score)

def calculate_age_group_priority_score(area: ActivityArea, cabin: Cabin, config: Dict[str, Any]) -> float:
    """Calculate score based on age group priority."""
    age_group_priorities = config.get("ageGroupPriorities", [])
    for priority in age_group_priorities:
        if priority.get("ageGroup") == cabin.age_group and priority.get("areaId") == area.id:
            return priority.get("priority", 0) * 10
    return 0

def calculate_area_variety_score(area: ActivityArea, cabin: Cabin, period: Period, assignments: List[Assignment], config: Dict[str, Any]) -> float:
    """Calculate score based on area variety."""
    score = 0.0
    cabin_assignments = [a for a in assignments if a.cabin_id == cabin.id]
    recent_assignments = [a for a in cabin_assignments if period.day - 2 <= a.day <= period.day]

    if recent_assignments:
        last_assignment = recent_assignments[-1]
        last_area = next((a for a in config.get("areas", []) if a.id == last_assignment.area_id), None)
        if last_area and last_area.category == area.category:
            score -= 20

    used_categories = {
        next((a.category for a in config.get("areas", []) if a.id == asgn.area_id), None)
        for asgn in recent_assignments
    }
    if area.category not in used_categories:
        score += 15

    return score

def calculate_social_grouping_score(area: ActivityArea, cabin: Cabin, period: Period, assignments: List[Assignment]) -> float:
    """Calculate score based on social grouping preferences."""
    if not cabin.social_groups:
        return 0.0

    score = 0.0
    current_period_assignments = [a for a in assignments if a.day == period.day and a.period_id == period.id]

    for social_group_id in cabin.social_groups:
        if any(a.cabin_id == social_group_id and a.area_id == area.id for a in current_period_assignments):
            score += 25

    return score

def calculate_preference_score(area: ActivityArea, cabin: Cabin) -> float:
    """Calculate score based on cabin preferences."""
    score = 0.0
    if area.id in cabin.preferences.favorite_areas:
        score += 30
    if area.id in cabin.preferences.avoid_areas:
        score -= 50
    return score

def calculate_travel_time_score(area: ActivityArea, cabin: Cabin, period: Period, assignments: List[Assignment], config: Dict[str, Any], all_periods: List[Period]) -> float:
    """Calculate score based on travel time optimization."""
    last_area_id = get_last_cabin_area(cabin.id, assignments, period.day, period.id, all_periods)
    if not last_area_id:
        return 0.0

    last_area = next((a for a in config.get("areas", []) if a.id == last_area_id), None)
    if not last_area:
        return 0.0

    travel_time = calculate_travel_time(last_area, area)
    max_allowed_time = config.get("allowedTransitionTime", 30)

    return 10 if travel_time <= max_allowed_time else -15

def calculate_utilization_goal_score(area: ActivityArea, period: Period, assignments: List[Assignment], config: Dict[str, Any]) -> float:
    """Calculate score based on area utilization goals."""
    utilization_goals = config.get("areaUtilizationGoals", [])
    goal = next((g for g in utilization_goals if g.get("areaId") == area.id), None)
    if not goal:
        return 0.0

    current_utilization = get_area_utilization(area.id, assignments, period.day, period.id)
    target_utilization = goal.get("targetUtilization", area.max_capacity * 0.8)

    if current_utilization < target_utilization:
        return 20
    elif current_utilization >= area.max_capacity:
        return -30
    return 0

def calculate_weather_score(area: ActivityArea, config: Dict[str, Any]) -> float:
    """Calculate score based on weather considerations."""
    if not area.weather_sensitive:
        return 0.0
    # Placeholder for weather integration
    return 0.0

# Cabin merging logic is not included in the soft constraints for ranking,
# but would be applied before the scheduling loop begins.
# These functions are placeholders for that logic.

def get_cabin_merge_instructions(cabin: Cabin, config: Dict[str, Any]) -> Any:
    """Check if cabin merging should be applied."""
    if not config.get("cabinMergingModel") or not config.get("mergeInstructions"):
        return None
    return next((inst for inst in config["mergeInstructions"] if inst.get("cabinId") == cabin.id), None)

def apply_cabin_merging(cabins: List[Cabin], config: Dict[str, Any]) -> List[Cabin]:
    """Apply cabin merging logic."""
    if config.get("cabinMergingModel") == "none":
        return cabins
    # Placeholder for more complex merging logic
    return cabins
