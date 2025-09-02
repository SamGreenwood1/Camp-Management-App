from __future__ import annotations
from dataclasses import dataclass, field
from typing import List, Optional
from enum import Enum

@dataclass
class Period:
    """Represents a single time period in a day."""
    id: str
    name: str
    start_time: int
    end_time: int
    day: int
    is_choice_period: bool
    blackout_areas: List[str] = field(default_factory=list)

class DoubleBookingLikelihood(Enum):
    ALWAYS = 'always'
    SOMETIMES = 'sometimes'
    NEVER = 'never'

class DoubleBookingScope(Enum):
    SAME_UNIT = 'sameUnit'
    ANY_UNIT = 'anyUnit'

@dataclass
class DoubleBooking:
    """Configuration for double booking an area."""
    likelihood: DoubleBookingLikelihood
    scope: DoubleBookingScope

@dataclass
class Accessibility:
    """Configuration for area accessibility."""
    allowed: List[str] = field(default_factory=list)
    forbidden: List[str] = field(default_factory=list)

@dataclass
class ActivityArea:
    """Represents a single activity area."""
    id: str
    name: str
    max_capacity: int
    category: str
    weather_sensitive: bool
    aliases: List[str] = field(default_factory=list)
    min_capacity: Optional[int] = None
    linked_areas: List[str] = field(default_factory=list)
    buffer_periods: int = 0
    accessibility: Accessibility = field(default_factory=Accessibility)
    double_booking: DoubleBooking = field(default_factory=lambda: DoubleBooking(DoubleBookingLikelihood.NEVER, DoubleBookingScope.ANY_UNIT))
    alternates_days: bool = False
    alternate_day_offset: Optional[int] = None
    travel_time: int = 0

@dataclass
class Preferences:
    """Cabin preferences for activities."""
    favorite_areas: List[str] = field(default_factory=list)
    avoid_areas: List[str] = field(default_factory=list)

@dataclass
class Restrictions:
    """Cabin restrictions for scheduling."""
    blackout_periods: List[str] = field(default_factory=list)
    blackout_areas: List[str] = field(default_factory=list)

@dataclass
class Cabin:
    """Represents a single cabin of campers."""
    id: str
    name: str
    age_group: str
    unit: str
    size: int
    priority: int = 0
    social_groups: List[str] = field(default_factory=list)
    preferences: Preferences = field(default_factory=Preferences)
    restrictions: Restrictions = field(default_factory=Restrictions)

@dataclass
class Assignment:
    """Represents a single assignment of a cabin to an area for a period."""
    cabin_id: str
    area_id: str
    period_id: str
    day: int
    is_manual_override: bool = False
    is_choice_period: bool = False
    is_double_booked: bool = False
