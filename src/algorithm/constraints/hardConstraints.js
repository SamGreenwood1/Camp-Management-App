/**
 * Hard constraint functions for camp scheduling
 * These functions implement the "Programmatic Rules" and hard aspects of "Conditionals"
 */

import { 
  getAreaUtilization, 
  getLastCabinArea, 
  calculateTravelTime,
  hasCabinUsedAreaRecently
} from './utilities.js';

/**
 * Check if a cabin can be assigned to an area during a period
 * @param {Object} cabin - Cabin object
 * @param {Object} area - Activity area object
 * @param {Object} period - Period object
 * @param {Array} assignments - Current assignments
 * @param {Object} config - Configuration object
 * @returns {Object} Result with isValid boolean and reason string
 */
export function checkHardConstraints(cabin, area, period, assignments, config) {
  // Check if cabin is already assigned during this period
  if (isCabinAlreadyAssigned(cabin.id, period.day, period.id, assignments)) {
    return { isValid: false, reason: 'Cabin already assigned during this period' };
  }

  // Check area capacity
  if (!checkAreaCapacity(area, period.day, period.id, assignments)) {
    return { isValid: false, reason: 'Area at maximum capacity' };
  }

  // Check area conflicts
  if (!checkAreaConflicts(area, period.day, period.id, assignments)) {
    return { isValid: false, reason: 'Area conflict detected' };
  }

  // Check travel time constraints
  if (!checkTravelTimeConstraints(cabin, area, period.day, period.id, assignments, config)) {
    return { isValid: false, reason: 'Excessive travel time between areas' };
  }

  // Check fixed area closures
  if (!checkFixedAreaClosures(area, period)) {
    return { isValid: false, reason: 'Area closed during this period' };
  }

  // Check no repeats rule
  if (!checkNoRepeatsRule(cabin.id, area.id, period.day, assignments, config)) {
    return { isValid: false, reason: 'Cabin used this area too recently' };
  }

  // Check buffer periods
  if (!checkBufferPeriods(area, period.day, period.id, assignments)) {
    return { isValid: false, reason: 'Buffer period required after previous use' };
  }

  // Check cabin blackout periods
  if (!checkCabinBlackoutPeriods(cabin, period)) {
    return { isValid: false, reason: 'Cabin blacked out during this period' };
  }

  // Check cabin blackout areas
  if (!checkCabinBlackoutAreas(cabin, area)) {
    return { isValid: false, reason: 'Cabin blacked out from this area' };
  }

  return { isValid: true, reason: 'All hard constraints satisfied' };
}

/**
 * Check if a cabin is already assigned during a specific period
 * @param {string} cabinId - Cabin ID
 * @param {number} day - Day number
 * @param {string} periodId - Period ID
 * @param {Array} assignments - Current assignments
 * @returns {boolean} True if cabin is already assigned
 */
function isCabinAlreadyAssigned(cabinId, day, periodId, assignments) {
  return assignments.some(a => 
    a.cabinId === cabinId && 
    a.day === day && 
    a.periodId === periodId
  );
}

/**
 * Check if area capacity constraints are satisfied
 * @param {Object} area - Activity area
 * @param {number} day - Day number
 * @param {string} periodId - Period ID
 * @param {Array} assignments - Current assignments
 * @returns {boolean} True if capacity constraints are satisfied
 */
function checkAreaCapacity(area, day, periodId, assignments) {
  const currentUtilization = getAreaUtilization(area.id, assignments, day, periodId);
  
  // Check max capacity
  if (currentUtilization >= area.maxCapacity) {
    return false;
  }
  
  return true;
}

/**
 * Check for area conflicts (mutually exclusive areas)
 * @param {Object} area - Activity area
 * @param {number} day - Day number
 * @param {string} periodId - Period ID
 * @param {Array} assignments - Current assignments
 * @returns {boolean} True if no conflicts
 */
function checkAreaConflicts(area, day, periodId, assignments) {
  if (!area.linkedAreas || area.linkedAreas.length === 0) {
    return true;
  }

  // Check if any linked areas are currently in use
  for (const linkedAreaId of area.linkedAreas) {
    const linkedAreaUtilization = getAreaUtilization(linkedAreaId, assignments, day, periodId);
    if (linkedAreaUtilization > 0) {
      return false;
    }
  }

  return true;
}

/**
 * Check travel time constraints between consecutive periods
 * @param {Object} cabin - Cabin object
 * @param {Object} area - Target activity area
 * @param {number} day - Day number
 * @param {string} periodId - Period ID
 * @param {Array} assignments - Current assignments
 * @param {Object} config - Configuration object
 * @returns {boolean} True if travel time is acceptable
 */
function checkTravelTimeConstraints(cabin, area, day, periodId, assignments, config) {
  const lastAreaId = getLastCabinArea(cabin.id, assignments, day, periodId);
  if (!lastAreaId) {
    return true; // No previous assignment to compare
  }

  // Find the last area object
  const lastArea = config.areas.find(a => a.id === lastAreaId);
  if (!lastArea) {
    return true;
  }

  const travelTime = calculateTravelTime(lastArea, area);
  const maxAllowedTime = config.allowedTransitionTime || 30; // Default 30 minutes

  return travelTime <= maxAllowedTime;
}

/**
 * Check if area is closed during the period
 * @param {Object} area - Activity area
 * @param {Object} period - Period object
 * @returns {boolean} True if area is open
 */
function checkFixedAreaClosures(area, period) {
  // Check if area is in period's blackout areas
  if (period.blackoutAreas && period.blackoutAreas.includes(area.id)) {
    return false;
  }

  return true;
}

/**
 * Check no repeats rule
 * @param {string} cabinId - Cabin ID
 * @param {string} areaId - Area ID
 * @param {number} day - Day number
 * @param {Array} assignments - Current assignments
 * @param {Object} config - Configuration object
 * @returns {boolean} True if no repeats rule is satisfied
 */
function checkNoRepeatsRule(cabinId, areaId, day, assignments, config) {
  const noRepeatsDays = config.noRepeatsDays || 3; // Default 3 days
  
  return !hasCabinUsedAreaRecently(cabinId, areaId, assignments, noRepeatsDays);
}

/**
 * Check buffer periods after area use
 * @param {Object} area - Activity area
 * @param {number} day - Day number
 * @param {string} periodId - Period ID
 * @param {Array} assignments - Current assignments
 * @returns {boolean} True if buffer period requirement is satisfied
 */
function checkBufferPeriods(area, day, periodId, assignments) {
  if (!area.bufferPeriods || area.bufferPeriods === 0) {
    return true;
  }

  // Check if area was used recently and needs buffer
  const recentAssignments = assignments.filter(a => 
    a.areaId === area.id && 
    a.day === day && 
    a.periodId !== periodId
  );

  // Simple buffer check - could be enhanced with actual period timing
  return recentAssignments.length === 0;
}

/**
 * Check if cabin is blacked out during the period
 * @param {Object} cabin - Cabin object
 * @param {Object} period - Period object
 * @returns {boolean} True if cabin can be scheduled during this period
 */
function checkCabinBlackoutPeriods(cabin, period) {
  if (!cabin.restrictions || !cabin.restrictions.blackoutPeriods) {
    return true;
  }

  return !cabin.restrictions.blackoutPeriods.includes(period.id);
}

/**
 * Check if cabin is blacked out from the area
 * @param {Object} cabin - Cabin object
 * @param {Object} area - Activity area
 * @returns {boolean} True if cabin can use this area
 */
function checkCabinBlackoutAreas(cabin, area) {
  if (!cabin.restrictions || !cabin.restrictions.blackoutAreas) {
    return true;
  }

  return !cabin.restrictions.blackoutAreas.includes(area.id);
}

/**
 * Check if double booking is allowed for an area
 * @param {Object} area - Activity area
 * @param {string} cabinId - Cabin ID
 * @param {Array} assignments - Current assignments
 * @param {number} day - Day number
 * @param {string} periodId - Period ID
 * @returns {boolean} True if double booking is allowed
 */
export function isDoubleBookingAllowed(area, cabinId, assignments, day, periodId) {
  if (!area.doubleBooking) {
    return false;
  }

  const { likelihood, scope } = area.doubleBooking;
  
  if (likelihood === 'never') {
    return false;
  }

  if (likelihood === 'always') {
    return true;
  }

  if (likelihood === 'sometimes') {
    // Simple probability check - could be enhanced with more sophisticated logic
    return Math.random() < 0.3; // 30% chance
  }

  return false;
}

/**
 * Check if area alternates days and is exempt from other rules
 * @param {Object} area - Activity area
 * @returns {boolean} True if area alternates days
 */
export function isAreaAlternatingDays(area) {
  return area.alternatesDays === true;
}
