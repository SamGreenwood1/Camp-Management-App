/**
 * Soft constraint functions for camp scheduling
 * These functions implement the "Conditionals" (soft rules) for ranking candidate areas
 */

import {
  getLastCabinArea,
  getAreaUtilization,
  hasCabinUsedAreaRecently
} from './utilities.js';

/**
 * Rank candidate areas based on soft constraints
 * @param {Array} candidateAreas - Array of available areas
 * @param {Object} cabin - Cabin object
 * @param {Object} period - Period object
 * @param {Array} assignments - Current assignments
 * @param {Object} config - Configuration object
 * @param {Array} flatAreas - Flattened array of all areas
 * @returns {Array} Sorted array of areas with scores
 */
export function rankCandidateAreas(candidateAreas, cabin, period, assignments, config, flatAreas) {
  const scoredAreas = candidateAreas.map(area => {
    const score = calculateAreaScore(area, cabin, period, assignments, config, flatAreas);
    return { area, score };
  });

  // Sort by score (higher is better) and return areas
  return scoredAreas
    .sort((a, b) => b.score - a.score)
    .map(item => item.area);
}

/**
 * Calculate a score for an area based on soft constraints
 * @param {Object} area - Activity area
 * @param {Object} cabin - Cabin object
 * @param {Object} period - Period object
 * @param {Array} assignments - Current assignments
 * @param {Object} config - Configuration object
 * @param {Array} flatAreas - Flattened array of all areas
 * @returns {number} Score (higher is better)
 */
function calculateAreaScore(area, cabin, period, assignments, config, flatAreas) {
  let score = 100; // Base score

  // Age group priority scoring
  score += calculateAgeGroupPriorityScore(area, cabin, config);

  // Area variety scoring
  score += calculateAreaVarietyScore(area, cabin, period, assignments, config, flatAreas);

  // Social grouping scoring
  score += calculateSocialGroupingScore(area, cabin, period, assignments, config);

  // Preference scoring
  score += calculatePreferenceScore(area, cabin);

  // Area utilization goals
  score += calculateUtilizationGoalScore(area, period, assignments, config);

  // Weather considerations
  score += calculateWeatherScore(area, config);

  return Math.max(0, score); // Ensure non-negative score
}

/**
 * Calculate score based on age group priority
 * @param {Object} area - Activity area
 * @param {Object} cabin - Cabin object
 * @param {Object} config - Configuration object
 * @returns {number} Score adjustment
 */
function calculateAgeGroupPriorityScore(area, cabin, config) {
  if (!config.ageGroupPriorities) return 0;

  const priority = config.ageGroupPriorities.find(p =>
    p.ageGroup === cabin.ageGroup && p.areaId === area.id
  );

  if (priority) {
    return priority.priority * 10; // Multiply by 10 for significant impact
  }

  return 0;
}

/**
 * Calculate score based on area variety
 * @param {Object} area - Activity area
 * @param {Object} cabin - Cabin object
 * @param {Object} period - Period object
 * @param {Array} assignments - Current assignments
 * @param {Object} config - Configuration object
 * @param {Array} flatAreas - Flattened array of all areas
 * @returns {number} Score adjustment
 */
function calculateAreaVarietyScore(area, cabin, period, assignments, config, flatAreas) {
  let score = 0;

  // Get cabin's recent area history
  const cabinAssignments = assignments.filter(a => a.cabinId === cabin.id);
  const recentAssignments = cabinAssignments.filter(a =>
    a.day >= period.day - 2 && a.day <= period.day
  );

  // Check for back-to-back similar categories
  const lastAssignment = recentAssignments[recentAssignments.length - 1];
  if (lastAssignment) {
    const lastArea = flatAreas.find(a => a.id === lastAssignment.areaId);
    if (lastArea && lastArea.category === area.category) {
      score -= 20; // Penalty for consecutive similar activities
    }
  }

  // Bonus for variety
  const usedCategories = new Set(recentAssignments.map(assignment => {
    const assignedArea = flatAreas.find(ar => ar.id === assignment.areaId);
    return assignedArea ? assignedArea.category : null;
  }).filter(Boolean));

  if (!usedCategories.has(area.category)) {
    score += 15; // Bonus for new category
  }

  return score;
}

/**
 * Calculate score based on social grouping preferences
 * @param {Object} area - Activity area
 * @param {Object} cabin - Cabin object
 * @param {Object} period - Period object
 * @param {Array} assignments - Current assignments
 * @param {Object} config - Configuration object
 * @returns {number} Score adjustment
 */
function calculateSocialGroupingScore(area, cabin, period, assignments, config) {
  if (!cabin.socialGroups || cabin.socialGroups.length === 0) {
    return 0;
  }

  let score = 0;
  const currentPeriodAssignments = assignments.filter(a =>
    a.day === period.day && a.periodId === period.id
  );

  // Check if social group cabins are assigned to this area
  for (const socialGroupId of cabin.socialGroups) {
    const socialCabinAssignment = currentPeriodAssignments.find(a =>
      a.cabinId === socialGroupId && a.areaId === area.id
    );

    if (socialCabinAssignment) {
      score += 25; // Bonus for being with social group
    }
  }

  return score;
}

/**
 * Calculate score based on cabin preferences
 * @param {Object} area - Activity area
 * @param {Object} cabin - Cabin object
 * @returns {number} Score adjustment
 */
function calculatePreferenceScore(area, cabin) {
  let score = 0;

  if (cabin.preferences) {
    // Favorite areas bonus
    if (cabin.preferences.favoriteAreas &&
        cabin.preferences.favoriteAreas.includes(area.id)) {
      score += 30;
    }

    // Avoid areas penalty
    if (cabin.preferences.avoidAreas &&
        cabin.preferences.avoidAreas.includes(area.id)) {
      score -= 50;
    }
  }

  return score;
}

/**
 * Calculate score based on area utilization goals
 * @param {Object} area - Activity area
 * @param {Object} period - Period object
 * @param {Array} assignments - Current assignments
 * @param {Object} config - Configuration object
 * @returns {number} Score adjustment
 */
function calculateUtilizationGoalScore(area, period, assignments, config) {
  if (!config.areaUtilizationGoals) return 0;

  const goal = config.areaUtilizationGoals.find(g => g.areaId === area.id);
  if (!goal) return 0;

  const currentUtilization = getAreaUtilization(area.id, assignments, period.day, period.id);
  const targetUtilization = goal.targetUtilization || area.maxCapacity * 0.8;

  if (currentUtilization < targetUtilization) {
    return 20; // Bonus for helping meet utilization goals
  } else if (currentUtilization >= area.maxCapacity) {
    return -30; // Penalty for over-utilization
  }

  return 0;
}

/**
 * Calculate score based on weather considerations
 * @param {Object} area - Activity area
 * @param {Object} config - Configuration object
 * @returns {number} Score adjustment
 */
function calculateWeatherScore(area, config) {
  if (!area.weatherSensitive) return 0;

  // This would typically integrate with actual weather data
  // For now, return a neutral score
  return 0;
}

/**
 * Check if cabin merging should be applied
 * @param {Object} cabin - Cabin object
 * @param {Object} config - Configuration object
 * @returns {Object|null} Merge instructions or null
 */
export function getCabinMergeInstructions(cabin, config) {
  if (!config.cabinMergingModel || !config.mergeInstructions) {
    return null;
  }

  return config.mergeInstructions.find(instruction =>
    instruction.cabinId === cabin.id
  );
}

/**
 * Apply cabin merging logic
 * @param {Array} cabins - Array of cabins
 * @param {Object} config - Configuration object
 * @returns {Array} Processed cabins with merging applied
 */
export function applyCabinMerging(cabins, config) {
  if (!config.cabinMergingModel || config.cabinMergingModel === 'none') {
    return cabins;
  }

  // This is a placeholder for cabin merging logic
  // Implementation would depend on the specific merging model
  return cabins;
}
