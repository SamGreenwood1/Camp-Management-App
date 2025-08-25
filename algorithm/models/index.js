/**
 * @typedef {Object} Period
 * @description Represents a time period in the camp schedule
 * @property {string} id - Unique identifier for the period
 * @property {string} name - Human-readable name (e.g., "Morning", "Afternoon")
 * @property {number} startTime - Start time in 24-hour format (e.g., 900 for 9:00 AM)
 * @property {number} endTime - End time in 24-hour format (e.g., 1200 for 12:00 PM)
 * @property {number} day - Day number (1-based)
 * @property {boolean} isChoicePeriod - Whether this period allows user choice
 * @property {string[]} blackoutAreas - Areas that are closed during this period
 */

/**
 * @typedef {Object} ActivityArea
 * @description Represents an activity area at the camp
 * @property {string} id - Unique identifier for the area
 * @property {string} name - Human-readable name
 * @property {string[]} aliases - Alternative names for the area
 * @property {string} category - Category type (e.g., "active", "creative", "educational")
 * @property {number} maxCapacity - Maximum number of cabins that can use this area
 * @property {number} [minCapacity] - Minimum number of cabins (optional)
 * @property {boolean} weatherSensitive - Whether the area is affected by weather
 * @property {string[]} linkedAreas - Areas that must be used together or are mutually exclusive
 * @property {number} bufferPeriods - Number of periods needed after use before reuse
 * @property {Object} accessibility - Age group accessibility rules
 * @property {string[]} accessibility.allowed - Allowed age groups/units
 * @property {string[]} accessibility.forbidden - Forbidden age groups/units
 * @property {Object} doubleBooking - Double booking configuration
 * @property {string} doubleBooking.likelihood - 'always', 'sometimes', or 'never'
 * @property {string} doubleBooking.scope - 'sameUnit' or 'anyUnit'
 * @property {boolean} alternatesDays - Whether this area alternates days
 * @property {number} [alternateDayOffset] - Offset for alternating days
 * @property {number} travelTime - Travel time in minutes from camp center
 */

/**
 * @typedef {Object} Cabin
 * @description Represents a cabin/unit at the camp
 * @property {string} id - Unique identifier for the cabin
 * @property {string} name - Human-readable name
 * @property {string} ageGroup - Age group classification
 * @property {string} unit - Unit classification
 * @property {number} size - Number of campers in the cabin
 * @property {string[]} socialGroups - Other cabins this cabin must/must not be with
 * @property {Object} preferences - Cabin-specific preferences
 * @property {string[]} preferences.favoriteAreas - Preferred activity areas
 * @property {string[]} preferences.avoidAreas - Areas to avoid
 * @property {Object} restrictions - Scheduling restrictions
 * @property {string[]} restrictions.blackoutPeriods - Periods when cabin cannot be scheduled
 * @property {string[]} restrictions.blackoutAreas - Areas the cabin cannot use
 * @property {number} priority - Priority level for area assignments (higher = more priority)
 */

/**
 * @typedef {Object} Assignment
 * @description Represents a cabin assignment to an activity area during a period
 * @property {string} cabinId - ID of the assigned cabin
 * @property {string} areaId - ID of the assigned activity area
 * @property {string} periodId - ID of the period
 * @property {number} day - Day number
 * @property {boolean} isManualOverride - Whether this was manually assigned
 * @property {boolean} isChoicePeriod - Whether this was a choice period assignment
 */

/**
 * @typedef {Object} SchedulingContext
 * @description Context information for scheduling decisions
 * @property {Assignment[]} currentAssignments - All current assignments
 * @property {Object} cabinHistory - History of area usage per cabin
 * @property {Object} areaUtilization - Current utilization of each area
 * @property {Object} dayAssignments - Assignments grouped by day
 * @property {number} currentDay - Current day being scheduled
 * @property {string} currentPeriod - Current period being scheduled
 */

export {};
