/**
 * Configuration file for the camp scheduling algorithm
 * Contains all periods, areas, cabins, and scheduler settings
 */

/**
 * Main configuration object for the camp scheduler
 */
export const config = {
  // Environment variable integration
  useEnvVars: false, // Default to false, can be overridden by process.env
  
  // Core scheduling parameters
  noRepeatsDays: 3, // Number of days before a cabin can repeat an area
  allowedTransitionTime: 30, // Maximum travel time between consecutive areas (minutes)
  
  // Periods configuration
  periods: [
    {
      id: 'morning',
      name: 'Morning',
      startTime: 900, // 9:00 AM
      endTime: 1200,  // 12:00 PM
      day: 1,
      isChoicePeriod: false,
      blackoutAreas: []
    },
    {
      id: 'afternoon',
      name: 'Afternoon',
      startTime: 1300, // 1:00 PM
      endTime: 1600,  // 4:00 PM
      day: 1,
      isChoicePeriod: false,
      blackoutAreas: []
    },
    {
      id: 'evening',
      name: 'Evening',
      startTime: 1900, // 7:00 PM
      endTime: 2100,  // 9:00 PM
      day: 1,
      isChoicePeriod: false,
      blackoutAreas: []
    },
    {
      id: 'morning',
      name: 'Morning',
      startTime: 900,
      endTime: 1200,
      day: 2,
      isChoicePeriod: false,
      blackoutAreas: []
    },
    {
      id: 'afternoon',
      name: 'Afternoon',
      startTime: 1300,
      endTime: 1600,
      day: 2,
      isChoicePeriod: false,
      blackoutAreas: []
    },
    {
      id: 'evening',
      name: 'Evening',
      startTime: 1900,
      endTime: 2100,
      day: 2,
      isChoicePeriod: false,
      blackoutAreas: []
    },
    {
      id: 'morning',
      name: 'Morning',
      startTime: 900,
      endTime: 1200,
      day: 3,
      isChoicePeriod: false,
      blackoutAreas: []
    },
    {
      id: 'afternoon',
      name: 'Afternoon',
      startTime: 1300,
      endTime: 1600,
      day: 3,
      isChoicePeriod: false,
      blackoutAreas: []
    },
    {
      id: 'evening',
      name: 'Evening',
      startTime: 1900,
      endTime: 2100,
      day: 3,
      isChoicePeriod: false,
      blackoutAreas: []
    }
  ],

  // Activity areas configuration
  areas: [
    {
      id: 'swimming',
      name: 'Swimming Pool',
      aliases: ['pool', 'aquatics'],
      category: 'active',
      maxCapacity: 2,
      minCapacity: 1,
      weatherSensitive: true,
      linkedAreas: [],
      bufferPeriods: 0,
      accessibility: {
        allowed: ['junior', 'senior'],
        forbidden: ['toddler']
      },
      doubleBooking: {
        likelihood: 'sometimes',
        scope: 'anyUnit'
      },
      alternatesDays: false,
      travelTime: 10
    },
    {
      id: 'archery',
      name: 'Archery Range',
      aliases: ['shooting', 'target'],
      category: 'active',
      maxCapacity: 1,
      minCapacity: 1,
      weatherSensitive: true,
      linkedAreas: [],
      bufferPeriods: 1,
      accessibility: {
        allowed: ['senior'],
        forbidden: ['toddler', 'junior']
      },
      doubleBooking: {
        likelihood: 'never',
        scope: 'sameUnit'
      },
      alternatesDays: false,
      travelTime: 15
    },
    {
      id: 'crafts',
      name: 'Crafts Center',
      aliases: ['arts', 'creative'],
      category: 'creative',
      maxCapacity: 3,
      minCapacity: 1,
      weatherSensitive: false,
      linkedAreas: [],
      bufferPeriods: 0,
      accessibility: {
        allowed: ['toddler', 'junior', 'senior'],
        forbidden: []
      },
      doubleBooking: {
        likelihood: 'always',
        scope: 'anyUnit'
      },
      alternatesDays: false,
      travelTime: 5
    },
    {
      id: 'nature',
      name: 'Nature Trail',
      aliases: ['hiking', 'outdoor'],
      category: 'active',
      maxCapacity: 2,
      minCapacity: 1,
      weatherSensitive: true,
      linkedAreas: [],
      bufferPeriods: 0,
      accessibility: {
        allowed: ['junior', 'senior'],
        forbidden: ['toddler']
      },
      doubleBooking: {
        likelihood: 'sometimes',
        scope: 'sameUnit'
      },
      alternatesDays: true,
      alternateDayOffset: 0,
      travelTime: 20
    },
    {
      id: 'dining',
      name: 'Dining Hall',
      aliases: ['cafeteria', 'mess'],
      category: 'facility',
      maxCapacity: 4,
      minCapacity: 2,
      weatherSensitive: false,
      linkedAreas: [],
      bufferPeriods: 0,
      accessibility: {
        allowed: ['toddler', 'junior', 'senior'],
        forbidden: []
      },
      doubleBooking: {
        likelihood: 'always',
        scope: 'anyUnit'
      },
      alternatesDays: false,
      travelTime: 0
    },
    {
      id: 'library',
      name: 'Library',
      aliases: ['reading', 'quiet'],
      category: 'educational',
      maxCapacity: 2,
      minCapacity: 1,
      weatherSensitive: false,
      linkedAreas: [],
      bufferPeriods: 0,
      accessibility: {
        allowed: ['junior', 'senior'],
        forbidden: ['toddler']
      },
      doubleBooking: {
        likelihood: 'sometimes',
        scope: 'sameUnit'
      },
      alternatesDays: false,
      travelTime: 8
    }
  ],

  // Cabins configuration
  cabins: [
    {
      id: 'cabin1',
      name: 'Cabin 1',
      ageGroup: 'junior',
      unit: 'unitA',
      size: 8,
      socialGroups: ['cabin2'],
      preferences: {
        favoriteAreas: ['swimming', 'crafts'],
        avoidAreas: ['library']
      },
      restrictions: {
        blackoutPeriods: [],
        blackoutAreas: []
      },
      priority: 5
    },
    {
      id: 'cabin2',
      name: 'Cabin 2',
      ageGroup: 'junior',
      unit: 'unitA',
      size: 8,
      socialGroups: ['cabin1'],
      preferences: {
        favoriteAreas: ['archery', 'nature'],
        avoidAreas: []
      },
      restrictions: {
        blackoutPeriods: [],
        blackoutAreas: []
      },
      priority: 5
    },
    {
      id: 'cabin3',
      name: 'Cabin 3',
      ageGroup: 'senior',
      unit: 'unitB',
      size: 10,
      socialGroups: ['cabin4'],
      preferences: {
        favoriteAreas: ['archery', 'nature'],
        avoidAreas: ['crafts']
      },
      restrictions: {
        blackoutPeriods: [],
        blackoutAreas: []
      },
      priority: 3
    },
    {
      id: 'cabin4',
      name: 'Cabin 4',
      ageGroup: 'senior',
      unit: 'unitB',
      size: 10,
      socialGroups: ['cabin3'],
      preferences: {
        favoriteAreas: ['swimming', 'library'],
        avoidAreas: []
      },
      restrictions: {
        blackoutPeriods: [],
        blackoutAreas: []
      },
      priority: 3
    },
    {
      id: 'cabin5',
      name: 'Cabin 5',
      ageGroup: 'toddler',
      unit: 'unitC',
      size: 6,
      socialGroups: ['cabin6'],
      preferences: {
        favoriteAreas: ['crafts', 'dining'],
        avoidAreas: ['archery', 'nature']
      },
      restrictions: {
        blackoutPeriods: ['evening'],
        blackoutAreas: ['archery', 'nature']
      },
      priority: 8
    },
    {
      id: 'cabin6',
      name: 'Cabin 6',
      ageGroup: 'toddler',
      unit: 'unitC',
      size: 6,
      socialGroups: ['cabin5'],
      preferences: {
        favoriteAreas: ['crafts', 'dining'],
        avoidAreas: ['archery', 'nature']
      },
      restrictions: {
        blackoutPeriods: ['evening'],
        blackoutAreas: ['archery', 'nature']
      },
      priority: 8
    }
  ],

  // Choice periods configuration
  choicePeriods: [
    {
      cabinId: 'cabin1',
      areaId: 'swimming',
      periodId: 'morning',
      day: 1
    },
    {
      cabinId: 'cabin3',
      areaId: 'archery',
      periodId: 'afternoon',
      day: 2
    }
  ],

  // Manual overrides configuration
  manualOverrides: [
    {
      cabinId: 'cabin5',
      areaId: 'dining',
      periodId: 'morning',
      day: 1
    }
  ],

  // Blackout periods configuration
  blackoutPeriods: [
    {
      cabinId: 'cabin5',
      periodId: 'evening',
      day: 1
    },
    {
      cabinId: 'cabin6',
      periodId: 'evening',
      day: 1
    }
  ],

  // Age group priorities configuration
  ageGroupPriorities: [
    {
      ageGroup: 'toddler',
      areaId: 'crafts',
      priority: 10
    },
    {
      ageGroup: 'senior',
      areaId: 'archery',
      priority: 8
    },
    {
      ageGroup: 'junior',
      areaId: 'swimming',
      priority: 6
    }
  ],

  // Cabin merging model configuration
  cabinMergingModel: 'none', // Options: 'none', 'sessionSpecific', 'mutableIdentity', 'hierarchical'
  
  // Merge instructions for cabin merging
  mergeInstructions: [
    // Example merge instruction (not used with 'none' model)
    // {
    //   cabinId: 'cabin1',
    //   mergeWith: 'cabin2',
    //   mergeType: 'temporary'
    // }
  ],

  // Area utilization goals
  areaUtilizationGoals: [
    {
      areaId: 'swimming',
      targetUtilization: 1.5 // Target 1.5 cabins per period on average
    },
    {
      areaId: 'crafts',
      targetUtilization: 2.0
    },
    {
      areaId: 'nature',
      targetUtilization: 1.0
    }
  ],

  // Scheduler-specific settings
  scheduler: {
    maxIterations: 1000,
    timeoutMs: 30000, // 30 seconds
    enableBacktracking: false, // Set to true for more robust but slower scheduling
    constraintViolationThreshold: 5, // Maximum allowed constraint violations
    enableParallelProcessing: false // Set to true for multi-threaded processing
  }
};

/**
 * Apply environment variable overrides if useEnvVars is true
 * @param {Object} config - Configuration object
 * @returns {Object} Configuration with environment overrides applied
 */
export function applyEnvironmentOverrides(config) {
  if (!config.useEnvVars) {
    return config;
  }

  const overriddenConfig = { ...config };

  // Override noRepeatsDays if environment variable is set
  if (process.env.NO_REPEATS_DAYS) {
    const noRepeatsDays = parseInt(process.env.NO_REPEATS_DAYS, 10);
    if (!isNaN(noRepeatsDays)) {
      overriddenConfig.noRepeatsDays = noRepeatsDays;
      console.log(`Environment override: NO_REPEATS_DAYS = ${noRepeatsDays}`);
    }
  }

  // Override allowedTransitionTime if environment variable is set
  if (process.env.ALLOWED_TRANSITION_TIME) {
    const allowedTransitionTime = parseInt(process.env.ALLOWED_TRANSITION_TIME, 10);
    if (!isNaN(allowedTransitionTime)) {
      overriddenConfig.allowedTransitionTime = allowedTransitionTime;
      console.log(`Environment override: ALLOWED_TRANSITION_TIME = ${allowedTransitionTime}`);
    }
  }

  return overriddenConfig;
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
    config.areas.forEach((area, index) => {
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
