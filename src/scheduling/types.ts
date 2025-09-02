/**
 * Type definitions for the camp scheduling system
 * These types align with the algorithm implementation
 */

export interface Period {
  id: string;
  name: string;
  startTime: number;
  endTime: number;
  day: number;
  isChoicePeriod: boolean;
  blackoutAreas: string[];
}

export interface ActivityArea {
  id: string;
  name: string;
  aliases: string[];
  category: string;
  maxCapacity: number;
  minCapacity?: number;
  weatherSensitive: boolean;
  linkedAreas: string[];
  bufferPeriods: number;
  accessibility: {
    allowed: string[];
    forbidden: string[];
  };
  doubleBooking: {
    likelihood: 'always' | 'sometimes' | 'never';
    scope: 'sameUnit' | 'anyUnit';
  };
  alternatesDays: boolean;
  alternateDayOffset?: number;
  travelTime: number;
}

export interface Cabin {
  id: string;
  name: string;
  ageGroup: string;
  unit: string;
  size: number;
  socialGroups: string[];
  preferences: {
    favoriteAreas: string[];
    avoidAreas: string[];
  };
  restrictions: {
    blackoutPeriods: string[];
    blackoutAreas: string[];
  };
  priority: number;
}

export interface Assignment {
  cabinId: string;
  areaId: string;
  periodId: string;
  day: number;
  isManualOverride: boolean;
  isChoicePeriod: boolean;
}

export interface SchedulingContext {
  currentAssignments: Assignment[];
  cabinHistory: Record<string, Record<string, number>>;
  areaUtilization: Record<string, number>;
  dayAssignments: Record<number, Assignment[]>;
  currentDay: number;
  currentPeriod: string;
}

// Legacy types for backward compatibility
export interface TimeSlot {
  id: string;
  name: string;
  time: string;
}

export interface Unit {
  id: string;
  name: string;
}

export interface AgeSubGroup {
  id: string;
  name: string;
  minAge: number;
  maxAge: number;
}

export interface SessionDates {
  startDate: string;
  endDate: string;
}

export interface SchedulingConfig {
  dailyTimeSlots: TimeSlot[];
  allowCabinMerging: boolean;
  ensureEveryAreaPerWeek: boolean;
}

export interface ScheduledEntry {
  date: string;
  timeSlotId: string;
  activityAreaId: string;
  assignedCabinGroupIds: string[];
}
