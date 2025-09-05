/**
 * Utility functions for constraint checking and scheduling operations
 */

/**
 * Get the number of periods per day
 * @param {Array} periods - Array of all periods
 * @returns {number} Number of periods per day
 */
export function getPeriodsPerDay(periods) {
  const uniqueDays = new Set(periods.map(p => p.day));
  return periods.length / uniqueDays.size;
}

/**
 * Get all periods for a specific day
 * @param {Array} periods - Array of all periods
 * @param {number} day - Day number
 * @returns {Array} Array of periods for the specified day
 */
export function getPeriodsForDay(periods, day) {
  return periods.filter(p => p.day === day);
}

/**
 * Get all periods for a specific time slot across all days
 * @param {Array} periods - Array of all periods
 * @param {string} periodId - Period ID to find across days
 * @returns {Array} Array of periods with the same ID across all days
 */
export function getPeriodsAcrossDays(periods, periodId) {
  return periods.filter(p => p.id === periodId);
}

/**
 * Check if two periods are consecutive
 * @param {Object} period1 - First period
 * @param {Object} period2 - Second period
 * @returns {boolean} True if periods are consecutive
 */
export function arePeriodsConsecutive(period1, period2) {
  if (period1.day !== period2.day) return false;
  return period1.endTime === period2.startTime;
}

/**
 * Get the last area a cabin was assigned to
 * @param {string} cabinId - Cabin ID
 * @param {Array} assignments - Current assignments
 * @param {number} currentDay - Current day
 * @param {string} currentPeriod - Current period
 * @returns {string|null} Area ID or null if no previous assignment
 */
export function getLastCabinArea(cabinId, assignments, currentDay, currentPeriod) {
  const cabinAssignments = assignments.filter(a => a.cabinId === cabinId);

  // Find the most recent assignment before current period
  let lastAssignment = null;
  for (const assignment of cabinAssignments) {
    if (assignment.day < currentDay ||
        (assignment.day === currentDay && assignment.periodId !== currentPeriod)) {
      if (!lastAssignment ||
          assignment.day > lastAssignment.day ||
          (assignment.day === lastAssignment.day &&
           assignment.periodId !== currentPeriod)) {
        lastAssignment = assignment;
      }
    }
  }

  return lastAssignment ? lastAssignment.areaId : null;
}

/**
 * Check if a cabin has been assigned to an area recently
 * @param {string} cabinId - Cabin ID
 * @param {string} areaId - Area ID
 * @param {Array} assignments - Current assignments
 * @param {number} days - Number of days to check back
 * @returns {boolean} True if cabin used area within specified days
 */
export function hasCabinUsedAreaRecently(cabinId, areaId, assignments, days) {
  const cutoffDay = Math.max(1, days);
  const recentAssignments = assignments.filter(a =>
    a.cabinId === cabinId &&
    a.areaId === areaId &&
    a.day >= cutoffDay
  );
  return recentAssignments.length > 0;
}

/**
 * Get current utilization count for an area
 * @param {string} areaId - Area ID
 * @param {Array} assignments - Current assignments
 * @param {number} day - Day number
 * @param {string} periodId - Period ID
 * @returns {number} Current number of cabins assigned to the area
 */
export function getAreaUtilization(areaId, assignments, day, periodId) {
  return assignments.filter(a =>
    a.areaId === areaId &&
    a.day === day &&
    a.periodId === periodId
  ).length;
}

/**
 * Check if an area is available during a specific period
 * @param {Object} area - Activity area
 * @param {Array} periods - Array of periods
 * @param {number} day - Day number
 * @param {string} periodId - Period ID
 * @returns {boolean} True if area is available
 */
export function isAreaAvailable(area, periods, day, periodId) {
  const period = periods.find(p => p.id === periodId && p.day === day);
  if (!period) return false;

  // Check if area is in blackout areas for this period
  if (period.blackoutAreas && period.blackoutAreas.includes(area.id)) {
    return false;
  }

  // Check if area alternates days
  if (area.alternatesDays) {
    const dayOffset = area.alternateDayOffset || 0;
    return (day + dayOffset) % 2 === 0;
  }

  return true;
}

/**
 * Get candidate areas for a cabin during a specific period
 * @param {Object} cabin - Cabin object
 * @param {Array} areas - Array of activity areas
 * @param {Array} periods - Array of periods
 * @param {number} day - Day number
 * @param {string} periodId - Period ID
 * @returns {Array} Array of available areas
 */
export function getCandidateAreas(cabin, areas, periods, day, periodId) {
  console.log('Areas in getCandidateAreas:', JSON.stringify(areas, null, 2));
  return areas.filter(area => {
    // Check basic availability
    if (!isAreaAvailable(area, periods, day, periodId)) {
      return false;
    }

    // Check accessibility
    if (area.accessibility) {
      if (area.accessibility.forbidden &&
          area.accessibility.forbidden.includes(cabin.ageGroup)) {
        return false;
      }
      if (area.accessibility.allowed &&
          !area.accessibility.allowed.includes(cabin.ageGroup)) {
        return false;
      }
    }

    // Check cabin restrictions
    if (cabin.restrictions &&
        cabin.restrictions.blackoutAreas &&
        cabin.restrictions.blackoutAreas.includes(area.id)) {
      return false;
    }

    return true;
  });
}
