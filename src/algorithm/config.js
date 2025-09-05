/**
 * Configuration file for the camp scheduling algorithm
 * Contains all periods, areas, cabins, and scheduler settings
 */

/**
 * Main configuration object for the camp scheduler
 */
export let config = {
  // Core scheduling parameters
  noRepeatsDays: 3, // Number of days before a cabin can repeat an area

  // Periods configuration - to be loaded from .env
  periods: [],

  // Activity areas configuration - to be loaded from .env
  areas: [],

  // Cabins configuration - to be loaded from .env
  cabins: [],

  // Choice periods configuration
  choicePeriods: [],

  // Manual overrides configuration
  manualOverrides: [],

  // Blackout periods configuration
  blackoutPeriods: [],

  // Age group priorities configuration
  ageGroupPriorities: [],

  // Cabin merging model configuration
  cabinMergingModel: 'none',

  // Merge instructions for cabin merging
  mergeInstructions: [],

  // Area utilization goals
  areaUtilizationGoals: [],

  // Scheduler-specific settings
  scheduler: {
    maxIterations: 1000,
    timeoutMs: 30000, // 30 seconds
    enableBacktracking: false,
    constraintViolationThreshold: 5,
    enableParallelProcessing: false
  }
};

/**
 * Load configuration from environment variables
 */
export function loadConfigFromEnv() {
  const newConfig = { ...config };

  // Load number of periods from .env
  const numberOfPeriods = parseInt(process.env.NUMBER_OF_PERIODS, 10) || 9;
  const periodTemplates = [
    { id: 'morning', name: 'Morning', startTime: 900, endTime: 1200 },
    { id: 'afternoon', name: 'Afternoon', startTime: 1300, endTime: 1600 },
    { id: 'evening', name: 'Evening', startTime: 1900, endTime: 2100 },
  ];
  newConfig.periods = Array.from({ length: numberOfPeriods }, (_, i) => {
    const day = Math.floor(i / 3) + 1;
    const template = periodTemplates[i % 3];
    return {
      ...template,
      day,
      isChoicePeriod: false,
      blackoutAreas: []
    };
  });

  // Load units from .env
  const units = (process.env.UNITS || '').split(',').map(u => u.trim());

  // Generate cabins from units
  newConfig.cabins = units.map((unit, i) => ({
    id: `cabin${i + 1}`,
    name: `Cabin ${i + 1}`, // Default name, to be overridden
    ageGroup: 'default', // Default age group
    unit: unit,
    size: 10, // Default size
    socialGroups: [],
    preferences: { favoriteAreas: [], avoidAreas: [] },
    restrictions: { blackoutPeriods: [], blackoutAreas: [] },
    priority: 5
  }));

  // Load activity areas from .env
  const activityAreasStr = process.env.ACTIVITY_AREAS || '';
  newConfig.areas = activityAreasStr.split(';').map(deptStr => {
    const [dept, areasStr] = deptStr.split(':');
    const areas = areasStr.split(',').map(areaName => ({
      id: areaName,
      name: areaName.charAt(0).toUpperCase() + areaName.slice(1),
      maxCapacity: 2, // Default capacity
    }));
    return [dept, areas];
  });


  // Load cabin naming template from .env
  newConfig.cabinNameTemplate = process.env.CABIN_NAME_TEMPLATE || 'existing';

  config = newConfig;
}


/**
 * Validate configuration object for required fields and data integrity
 * @param {Object} config - Configuration object to validate
 * @returns {Object} Validation result with isValid boolean and errors array
 */
export function validateConfig(config) {
  const errors = [];

  // Check required top-level properties
  if (!config.periods || !Array.isArray(config.periods) || config.periods.length === 0) {
    errors.push('Configuration must include non-empty periods array');
  }

  if (!config.areas || !Array.isArray(config.areas) || config.areas.length === 0) {
    errors.push('Configuration must include non-empty areas array');
  }

  if (!config.cabins || !Array.isArray(config.cabins) || config.cabins.length === 0) {
    errors.push('Configuration must include non-empty cabins array');
  }

  // Validate periods
  if (config.periods) {
    config.periods.forEach((period, index) => {
      if (!period.id || !period.name || !period.startTime || !period.endTime || !period.day) {
        errors.push(`Period at index ${index} is missing required fields`);
      }
      if (period.startTime >= period.endTime) {
        errors.push(`Period ${period.id} has invalid time range`);
      }
    });
  }

  // Validate areas
  if (config.areas) {
    // Flatten 2D array for validation
    const flatAreas = config.areas.flat();
    flatAreas.forEach((area, index) => {
      if(typeof area === 'string') return; // Skip department names
      if (!area.id || !area.name || !area.maxCapacity) {
        errors.push(`Area at index ${index} is missing required fields`);
      }
      if (area.maxCapacity <= 0) {
        errors.push(`Area ${area.id} has invalid maxCapacity`);
      }
    });
  }

  // Validate cabins
  if (config.cabins) {
    config.cabins.forEach((cabin, index) => {
      if (!cabin.id || !cabin.name || !cabin.ageGroup || !cabin.unit) {
        errors.push(`Cabin at index ${index} is missing required fields`);
      }
      if (cabin.size <= 0) {
        errors.push(`Cabin ${cabin.id} has invalid size`);
      }
    });
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}
