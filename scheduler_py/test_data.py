from .models import (
    Period, ActivityArea, Cabin, Preferences, Restrictions,
    DoubleBooking, DoubleBookingLikelihood, DoubleBookingScope, Accessibility
)

def get_test_data():
    """Returns a dictionary with test data for the scheduler."""

    periods = [
        Period(id="p1", name="Period 1", start_time=900, end_time=1000, day=1, is_choice_period=False),
        Period(id="p2", name="Period 2", start_time=1000, end_time=1100, day=1, is_choice_period=False),
        Period(id="p3", name="Period 3", start_time=1100, end_time=1200, day=1, is_choice_period=True, blackout_areas=["area-art"]),
        Period(id="p1", name="Period 1", start_time=900, end_time=1000, day=2, is_choice_period=False),
        Period(id="p2", name="Period 2", start_time=1000, end_time=1100, day=2, is_choice_period=False),
        Period(id="p3", name="Period 3", start_time=1100, end_time=1200, day=2, is_choice_period=False),
    ]

    areas = [
        ActivityArea(
            id="area-waterfront", name="Waterfront", max_capacity=20, category="Aquatics",
            weather_sensitive=True, travel_time=15
        ),
        ActivityArea(
            id="area-archery", name="Archery", max_capacity=10, category="Sports",
            weather_sensitive=True, travel_time=10, alternates_days=True
        ),
        ActivityArea(
            id="area-art", name="Arts & Crafts", max_capacity=15, category="Arts",
            weather_sensitive=False, travel_time=5
        ),
        ActivityArea(
            id="area-field", name="Sports Field", max_capacity=30, category="Sports",
            weather_sensitive=False, travel_time=10,
            double_booking=DoubleBooking(DoubleBookingLikelihood.SOMETIMES, DoubleBookingScope.ANY_UNIT)
        ),
        ActivityArea(
            id="area-ropes", name="Ropes Course", max_capacity=12, category="Adventure",
            weather_sensitive=True, travel_time=20, linked_areas=["area-wall"]
        ),
        ActivityArea(
            id="area-wall", name="Climbing Wall", max_capacity=8, category="Adventure",
            weather_sensitive=True, travel_time=20, linked_areas=["area-ropes"]
        ),
    ]

    cabins = [
        Cabin(
            id="cabin-a", name="Eagles", age_group="Seniors", unit="U1", size=10, priority=1,
            preferences=Preferences(favorite_areas=["area-ropes"]),
            restrictions=Restrictions(blackout_periods=["p3"])
        ),
        Cabin(
            id="cabin-b", name="Bears", age_group="Seniors", unit="U1", size=8,
            preferences=Preferences(avoid_areas=["area-art"])
        ),
        Cabin(
            id="cabin-c", name="Lions", age_group="Juniors", unit="U2", size=12,
            social_groups=["cabin-d"]
        ),
        Cabin(
            id="cabin-d", name="Tigers", age_group="Juniors", unit="U2", size=10,
            social_groups=["cabin-c"]
        ),
        Cabin(
            id="cabin-e", name="Panthers", age_group="Intermediates", unit="U3", size=14
        ),
    ]

    config = {
        "cabins": cabins,
        "areas": areas,
        "periods": periods,
        "manualOverrides": [
            {"cabinId": "cabin-e", "areaId": "area-field", "periodId": "p1", "day": 1}
        ],
        "choicePeriods": [
            {"cabinId": "cabin-a", "areaId": "area-waterfront", "periodId": "p3", "day": 1}
        ],
        "allowedTransitionTime": 20,
        "noRepeatsDays": 2,
        "ageGroupPriorities": [
            {"ageGroup": "Seniors", "areaId": "area-ropes", "priority": 5}
        ],
        "areaUtilizationGoals": [
            {"areaId": "area-waterfront", "targetUtilization": 15}
        ]
    }

    return config
