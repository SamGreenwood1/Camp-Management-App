/**
 * Main entry point for the camp scheduling algorithm
 * Exports all key components for external use
 */

// Export the main scheduler class
export { CampScheduler } from './scheduler/CampScheduler.js';

// Export configuration and utilities
export { config, applyEnvironmentOverrides, validateConfig } from './config.js';

// Export constraint functions
export { 
  checkHardConstraints, 
  isDoubleBookingAllowed, 
  isAreaAlternatingDays 
} from './constraints/hardConstraints.js';

export { 
  rankCandidateAreas, 
  getCabinMergeInstructions, 
  applyCabinMerging 
} from './constraints/softConstraints.js';

// Export utility functions
export {
  getPeriodsPerDay,
  getPeriodsForDay,
  getPeriodsAcrossDays,
  arePeriodsConsecutive,
  calculateTravelTime,
  getLastCabinArea,
  hasCabinUsedAreaRecently,
  getAreaUtilization,
  isAreaAvailable,
  getCandidateAreas
} from './constraints/utilities.js';

// Export type definitions (JSDoc)
export * from './models/index.js';
