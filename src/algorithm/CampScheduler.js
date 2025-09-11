import dotenv from 'dotenv';
import path from 'path';

export class CampScheduler {
  constructor() {
    dotenv.config({ path: path.resolve(process.cwd(), '.envvars/.algo.env') });
    this.config = this.#generateConfig();
    this.assignments = [];
    this.cabinHistory = {};
    this.areaUtilization = {};
    this.dayAssignments = {};
    this.schedulingStats = {
      totalAssignments: 0,
      failedAssignments: 0,
      constraintViolations: 0,
      startTime: null,
      endTime: null
    };
  }

  // Configuration generation
  #generateConfig() {
    const config = {
      units: process.env.UNITS.split(','),
      activityAreas: JSON.parse(process.env.ACTIVITY_AREAS),
      cabinNamingTemplate: process.env.CABIN_NAMING_TEMPLATE,
      numberOfDays: parseInt(process.env.NUMBER_OF_DAYS, 10),
      numberOfPeriods: parseInt(process.env.NUMBER_OF_PERIODS, 10),
      baseScore: parseInt(process.env.BASE_SCORE, 10),
      areaVarietyPenalty: parseInt(process.env.AREA_VARIETY_PENALTY, 10),
      areaVarietyBonus: parseInt(process.env.AREA_VARIETY_BONUS, 10),
      socialGroupingBonus: parseInt(process.env.SOCIAL_GROUPING_BONUS, 10),
      favoriteAreaBonus: parseInt(process.env.FAVORITE_AREA_BONUS, 10),
      avoidAreaPenalty: parseInt(process.env.AVOID_AREA_PENALTY, 10),
      utilizationBonus: parseInt(process.env.UTILIZATION_BONUS, 10),
      utilizationPenalty: parseInt(process.env.UTILIZATION_PENALTY, 10),
      minimumTravelTime: parseInt(process.env.MINIMUM_TRAVEL_TIME, 10),
      noRepeatsDays: 3,
      choicePeriods: [],
      manualOverrides: [],
      blackoutPeriods: [],
      ageGroupPriorities: [],
      cabinMergingModel: 'none',
      mergeInstructions: [],
      areaUtilizationGoals: [],
      scheduler: {
        maxIterations: 1000,
        timeoutMs: 30000,
        enableBacktracking: false,
        constraintViolationThreshold: 5,
        enableParallelProcessing: false
      }
    };
    config.periods = this.#generatePeriods(config);
    config.areas = this.#generateAreas(config);
    config.cabins = this.#generateCabins(config);
    return config;
  }

  #generateCabins(config) {
    const cabins = [];
    let cabinId = 1;
    config.units.forEach(unit => {
      for (let i = 0; i < 2; i++) {
        const cabinName = config.cabinNamingTemplate
          .replace('{unit_initial}', unit.charAt(0))
          .replace('{unit_name}', unit)
          .replace('{cabin_id}', cabinId);
        cabins.push({
          id: `cabin${cabinId}`,
          name: cabinName,
          ageGroup: unit.toLowerCase().replace(/s$/, ''),
          unit: unit,
          size: 8,
          socialGroups: [],
          preferences: { favoriteAreas: [], avoidAreas: [] },
          restrictions: { blackoutPeriods: [], blackoutAreas: [] },
          priority: 5
        });
        cabinId++;
      }
    });
    return cabins;
  }

  #generateAreas(config) {
    const areas = [];
    config.activityAreas.forEach(([department, areaNames]) => {
      areaNames.forEach(name => {
        areas.push({
          id: name.toLowerCase().replace(/ /g, ''),
          name: name,
          aliases: [],
          category: department.toLowerCase(),
          maxCapacity: 2,
          minCapacity: 1,
          weatherSensitive: false,
          linkedAreas: [],
          bufferPeriods: 0,
          accessibility: { allowed: ['junior', 'senior', 'toddler'], forbidden: [] },
          doubleBooking: { likelihood: 'sometimes', scope: 'anyUnit' },
          alternatesDays: name === 'Archery' || name === 'Canoeing',
          alternateDayOffset: name === 'Archery' ? 1 : 0,
          travelTime: 10
        });
      });
    });
    return areas;
  }

  #generatePeriods(config) {
    const periods = [];
    const periodNames = ['Morning', 'Afternoon', 'Evening', 'Night', 'Late Night'];
    for (let day = 1; day <= config.numberOfDays; day++) {
      for (let i = 0; i < config.numberOfPeriods; i++) {
        periods.push({
          id: periodNames[i].toLowerCase(),
          name: periodNames[i],
          startTime: 900 + i * 400,
          endTime: 1200 + i * 400,
          day: day,
          isChoicePeriod: false,
          blackoutAreas: []
        });
      }
    }
    return periods;
  }

  // Main scheduling logic
  async schedule() {
    console.log('Starting camp scheduling...');
    this.schedulingStats.startTime = new Date();
    try {
      const processedCabins = this.#applyCabinMerging(this.config.cabins);
      this.#processManualOverrides();
      this.#processChoicePeriods();
      await this.#runSchedulingLoop(processedCabins);
      this.#validateFinalSchedule();
      this.schedulingStats.endTime = new Date();
      this.schedulingStats.totalAssignments = this.assignments.length;
      console.log(`Scheduling completed. Total assignments: ${this.assignments.length}`);
      return {
        assignments: this.assignments,
        statistics: this.schedulingStats,
        success: true
      };
    } catch (error) {
      console.error('Scheduling failed:', error);
      this.schedulingStats.endTime = new Date();
      return {
        assignments: this.assignments,
        statistics: this.schedulingStats,
        success: false,
        error: error.message
      };
    }
  }

  #processManualOverrides() {
    if (!this.config.manualOverrides) return;
    for (const override of this.config.manualOverrides) {
      const assignment = {
        cabinId: override.cabinId,
        areaId: override.areaId,
        periodId: override.periodId,
        day: override.day,
        isManualOverride: true,
        isChoicePeriod: false
      };
      this.assignments.push(assignment);
      this.#updateSchedulingState(assignment);
    }
    console.log(`Processed ${this.config.manualOverrides.length} manual overrides`);
  }

  #processChoicePeriods() {
    if (!this.config.choicePeriods) return;
    for (const choicePeriod of this.config.choicePeriods) {
      const assignment = {
        cabinId: choicePeriod.cabinId,
        areaId: choicePeriod.areaId,
        periodId: choicePeriod.periodId,
        day: choicePeriod.day,
        isManualOverride: false,
        isChoicePeriod: true
      };
      this.assignments.push(assignment);
      this.#updateSchedulingState(assignment);
    }
    console.log(`Processed ${this.config.choicePeriods.length} choice periods`);
  }

  async #runSchedulingLoop(cabins) {
    const sortedPeriods = this.#sortPeriodsChronologically();
    for (const period of sortedPeriods) {
      console.log(`Scheduling period: ${period.name} (Day ${period.day})`);
      if (this.#isPeriodFullyAssigned(period)) {
        console.log(`Period ${period.name} already fully assigned, skipping`);
        continue;
      }
      const availableCabins = this.#getAvailableCabinsForPeriod(cabins, period);
      const prioritizedCabins = this.#sortCabinsByPriority(availableCabins);
      for (const cabin of prioritizedCabins) {
        const assignment = await this.#assignCabinToArea(cabin, period);
        if (assignment) {
          this.assignments.push(assignment);
          this.#updateSchedulingState(assignment);
          console.log(`Assigned ${cabin.name} to ${assignment.areaId} for ${period.name}`);
        } else {
          this.schedulingStats.failedAssignments++;
          console.warn(`Failed to assign ${cabin.name} for ${period.name}`);
        }
      }
    }
  }

  #sortPeriodsChronologically() {
    return [...this.config.periods].sort((a, b) => {
      if (a.day !== b.day) return a.day - b.day;
      return a.startTime - b.startTime;
    });
  }

  #isPeriodFullyAssigned(period) {
    const assignedCabins = this.assignments.filter(a => a.day === period.day && a.periodId === period.id).length;
    return assignedCabins >= this.config.cabins.length;
  }

  #getAvailableCabinsForPeriod(cabins, period) {
    return cabins.filter(cabin => {
      const isAssigned = this.assignments.some(a => a.cabinId === cabin.id && a.day === period.day && a.periodId === period.id);
      const isBlackedOut = this.#isCabinBlackedOut(cabin, period);
      return !isAssigned && !isBlackedOut;
    });
  }

  #isCabinBlackedOut(cabin, period) {
    if (!this.config.blackoutPeriods) return false;
    return this.config.blackoutPeriods.some(blackout => blackout.cabinId === cabin.id && blackout.periodId === period.id && blackout.day === period.day);
  }

  #sortCabinsByPriority(cabins) {
    return [...cabins].sort((a, b) => {
      const priorityDiff = (b.priority || 0) - (a.priority || 0);
      if (priorityDiff !== 0) return priorityDiff;
      return a.size - b.size;
    });
  }

  async #assignCabinToArea(cabin, period) {
    let candidateAreas = this.#getCandidateAreas(cabin, this.config.areas, this.config.periods, period.day, period.id);
    if (candidateAreas.length === 0) {
      console.warn(`No candidate areas available for ${cabin.name} during ${period.name}`);
      return null;
    }
    candidateAreas = candidateAreas.filter(area => {
      const constraintResult = this.#checkHardConstraints(cabin, area, period, this.assignments);
      return constraintResult.isValid;
    });
    if (candidateAreas.length === 0) {
      console.warn(`No areas satisfy hard constraints for ${cabin.name} during ${period.name}`);
      this.schedulingStats.constraintViolations++;
      return null;
    }
    const rankedAreas = this.#rankCandidateAreas(candidateAreas, cabin, period, this.assignments);
    for (const area of rankedAreas) {
      if (this.#canAssignCabinToArea(cabin, area, period)) {
        return { cabinId: cabin.id, areaId: area.id, periodId: period.id, day: period.day, isManualOverride: false, isChoicePeriod: false };
      }
    }
    for (const area of rankedAreas) {
      if (this.#isDoubleBookingAllowed(area, cabin.id, this.assignments, period.day, period.id)) {
        if (this.#canAssignCabinToArea(cabin, area, period, true)) {
          return { cabinId: cabin.id, areaId: area.id, periodId: period.id, day: period.day, isManualOverride: false, isChoicePeriod: false, isDoubleBooked: true };
        }
      }
    }
    return null;
  }

  #canAssignCabinToArea(cabin, area, period, allowDoubleBooking = false) {
    const currentUtilization = this.#getAreaUtilization(area.id, this.assignments, period.day, period.id);
    if (allowDoubleBooking) {
      return currentUtilization < area.maxCapacity * 1.5;
    } else {
      return currentUtilization < area.maxCapacity;
    }
  }

  #updateSchedulingState(assignment) {
    if (!this.cabinHistory[assignment.cabinId]) this.cabinHistory[assignment.cabinId] = [];
    this.cabinHistory[assignment.cabinId].push(assignment);
    const key = `${assignment.areaId}_${assignment.day}_${assignment.periodId}`;
    this.areaUtilization[key] = (this.areaUtilization[key] || 0) + 1;
    if (!this.dayAssignments[assignment.day]) this.dayAssignments[assignment.day] = [];
    this.dayAssignments[assignment.day].push(assignment);
  }

  #validateFinalSchedule() {
    console.log('Validating final schedule...');
    let violations = 0;
    for (const assignment of this.assignments) {
      const duplicates = this.assignments.filter(a => a.cabinId === assignment.cabinId && a.day === assignment.day && a.periodId === assignment.periodId);
      if (duplicates.length > 1) {
        console.error(`Double assignment detected for cabin ${assignment.cabinId} on day ${assignment.day}, period ${assignment.periodId}`);
        violations++;
      }
    }
    for (const area of this.config.areas) {
      for (const period of this.config.periods) {
        const utilization = this.#getAreaUtilization(area.id, this.assignments, period.day, period.id);
        if (utilization > area.maxCapacity) {
          console.error(`Area ${area.name} over capacity: ${utilization}/${area.maxCapacity} on day ${period.day}, period ${period.id}`);
          violations++;
        }
      }
    }
    if (violations > 0) {
      console.warn(`Schedule validation found ${violations} violations`);
    } else {
      console.log('Schedule validation passed');
    }
  }

  // Hard constraints
  #checkHardConstraints(cabin, area, period, assignments) {
    if (this.#isCabinAlreadyAssigned(cabin.id, period.day, period.id, assignments)) return { isValid: false, reason: 'Cabin already assigned' };
    if (!this.#checkAreaCapacity(area, period.day, period.id, assignments)) return { isValid: false, reason: 'Area at capacity' };
    if (!this.#checkAreaConflicts(area, period.day, period.id, assignments)) return { isValid: false, reason: 'Area conflict' };
    if (!this.#checkFixedAreaClosures(area, period)) return { isValid: false, reason: 'Area closed' };
    if (!this.#checkNoRepeatsRule(cabin.id, area.id, period.day, assignments)) return { isValid: false, reason: 'Cabin repeat' };
    if (!this.#checkBufferPeriods(area, period.day, period.id, assignments)) return { isValid: false, reason: 'Buffer period' };
    if (!this.#checkCabinBlackoutPeriods(cabin, period)) return { isValid: false, reason: 'Cabin blackout period' };
    if (!this.#checkCabinBlackoutAreas(cabin, area)) return { isValid: false, reason: 'Cabin blackout area' };
    return { isValid: true, reason: 'All hard constraints satisfied' };
  }

  #isCabinAlreadyAssigned(cabinId, day, periodId, assignments) {
    return assignments.some(a => a.cabinId === cabinId && a.day === day && a.periodId === periodId);
  }

  #checkAreaCapacity(area, day, periodId, assignments) {
    return this.#getAreaUtilization(area.id, assignments, day, periodId) < area.maxCapacity;
  }

  #checkAreaConflicts(area, day, periodId, assignments) {
    if (!area.linkedAreas || area.linkedAreas.length === 0) return true;
    for (const linkedAreaId of area.linkedAreas) {
      if (this.#getAreaUtilization(linkedAreaId, assignments, day, periodId) > 0) return false;
    }
    return true;
  }

  #checkFixedAreaClosures(area, period) {
    return !(period.blackoutAreas && period.blackoutAreas.includes(area.id));
  }

  #checkNoRepeatsRule(cabinId, areaId, day, assignments) {
    return !this.#hasCabinUsedAreaRecently(cabinId, areaId, assignments, this.config.noRepeatsDays);
  }

  #checkBufferPeriods(area, day, periodId, assignments) {
    if (!area.bufferPeriods || area.bufferPeriods === 0) return true;
    return assignments.filter(a => a.areaId === area.id && a.day === day && a.periodId !== periodId).length === 0;
  }

  #checkCabinBlackoutPeriods(cabin, period) {
    return !(cabin.restrictions && cabin.restrictions.blackoutPeriods && cabin.restrictions.blackoutPeriods.includes(period.id));
  }

  #checkCabinBlackoutAreas(cabin, area) {
    return !(cabin.restrictions && cabin.restrictions.blackoutAreas && cabin.restrictions.blackoutAreas.includes(area.id));
  }

  #isDoubleBookingAllowed(area, cabinId, assignments, day, periodId) {
    if (!area.doubleBooking) return false;
    const { likelihood } = area.doubleBooking;
    if (likelihood === 'never') return false;
    if (likelihood === 'always') return true;
    if (likelihood === 'sometimes') return Math.random() < 0.3;
    return false;
  }

  // Soft constraints
  #rankCandidateAreas(candidateAreas, cabin, period, assignments) {
    const scoredAreas = candidateAreas.map(area => {
      const score = this.#calculateAreaScore(area, cabin, period, assignments);
      return { area, score };
    });
    return scoredAreas.sort((a, b) => b.score - a.score).map(item => item.area);
  }

  #calculateAreaScore(area, cabin, period, assignments) {
    let score = this.config.baseScore;
    score += this.#calculateAgeGroupPriorityScore(area, cabin);
    score += this.#calculateAreaVarietyScore(area, cabin, period, assignments);
    score += this.#calculateSocialGroupingScore(area, cabin, period, assignments);
    score += this.#calculatePreferenceScore(area, cabin);
    score += this.#calculateUtilizationGoalScore(area, period, assignments);
    score += this.#calculateWeatherScore(area);
    return Math.max(0, score);
  }

  #calculateAgeGroupPriorityScore(area, cabin) {
    if (!this.config.ageGroupPriorities) return 0;
    const priority = this.config.ageGroupPriorities.find(p => p.ageGroup === cabin.ageGroup && p.areaId === area.id);
    return priority ? priority.priority * 10 : 0;
  }

  #calculateAreaVarietyScore(area, cabin, period, assignments) {
    let score = 0;
    const cabinAssignments = assignments.filter(a => a.cabinId === cabin.id);
    const recentAssignments = cabinAssignments.filter(a => a.day >= period.day - 2 && a.day <= period.day);
    const lastAssignment = recentAssignments[recentAssignments.length - 1];
    if (lastAssignment) {
      const lastArea = this.config.areas.find(a => a.id === lastAssignment.areaId);
      if (lastArea && lastArea.category === area.category) score += this.config.areaVarietyPenalty;
    }
    const usedCategories = new Set(recentAssignments.map(assignment => {
      const areaObj = this.config.areas.find(area => area.id === assignment.areaId);
      return areaObj ? areaObj.category : null;
    }).filter(Boolean));
    if (!usedCategories.has(area.category)) score += this.config.areaVarietyBonus;
    return score;
  }

  #calculateSocialGroupingScore(area, cabin, period, assignments) {
    if (!cabin.socialGroups || cabin.socialGroups.length === 0) return 0;
    let score = 0;
    const currentPeriodAssignments = assignments.filter(a => a.day === period.day && a.periodId === period.id);
    for (const socialGroupId of cabin.socialGroups) {
      if (currentPeriodAssignments.find(a => a.cabinId === socialGroupId && a.areaId === area.id)) {
        score += this.config.socialGroupingBonus;
      }
    }
    return score;
  }

  #calculatePreferenceScore(area, cabin) {
    let score = 0;
    if (cabin.preferences) {
      if (cabin.preferences.favoriteAreas && cabin.preferences.favoriteAreas.includes(area.id)) score += this.config.favoriteAreaBonus;
      if (cabin.preferences.avoidAreas && cabin.preferences.avoidAreas.includes(area.id)) score += this.config.avoidAreaPenalty;
    }
    return score;
  }

  #calculateUtilizationGoalScore(area, period, assignments) {
    if (!this.config.areaUtilizationGoals) return 0;
    const goal = this.config.areaUtilizationGoals.find(g => g.areaId === area.id);
    if (!goal) return 0;
    const currentUtilization = this.#getAreaUtilization(area.id, assignments, period.day, period.id);
    const targetUtilization = goal.targetUtilization || area.maxCapacity * 0.8;
    if (currentUtilization < targetUtilization) return this.config.utilizationBonus;
    if (currentUtilization >= area.maxCapacity) return this.config.utilizationPenalty;
    return 0;
  }

  #calculateWeatherScore(area) {
    if (!area.weatherSensitive) return 0;
    return 0;
  }

  #applyCabinMerging(cabins) {
    if (!this.config.cabinMergingModel || this.config.cabinMergingModel === 'none') return cabins;
    return cabins;
  }

  // Utilities
  #getAreaUtilization(areaId, assignments, day, periodId) {
    return assignments.filter(a => a.areaId === areaId && a.day === day && a.periodId === periodId).length;
  }

  #getLastCabinArea(cabinId, assignments, currentDay, currentPeriod) {
    const cabinAssignments = assignments.filter(a => a.cabinId === cabinId);
    let lastAssignment = null;
    for (const assignment of cabinAssignments) {
      if (assignment.day < currentDay || (assignment.day === currentDay && assignment.periodId !== currentPeriod)) {
        if (!lastAssignment || assignment.day > lastAssignment.day || (assignment.day === lastAssignment.day && assignment.periodId !== currentPeriod)) {
          lastAssignment = assignment;
        }
      }
    }
    return lastAssignment ? lastAssignment.areaId : null;
  }

  #hasCabinUsedAreaRecently(cabinId, areaId, assignments, days) {
    const cutoffDay = Math.max(1, days);
    return assignments.some(a => a.cabinId === cabinId && a.areaId === areaId && a.day >= cutoffDay);
  }

  #isAreaAvailable(area, periods, day, periodId) {
    const period = periods.find(p => p.id === periodId && p.day === day);
    if (!period) return false;
    if (period.blackoutAreas && period.blackoutAreas.includes(area.id)) return false;
    if (area.alternatesDays) {
      const dayOffset = area.alternateDayOffset || 0;
      return (day + dayOffset) % 2 === 0;
    }
    return true;
  }

  #getCandidateAreas(cabin, areas, periods, day, periodId) {
    return areas.filter(area => {
      if (!this.#isAreaAvailable(area, periods, day, periodId)) return false;
      if (area.accessibility) {
        if (area.accessibility.forbidden && area.accessibility.forbidden.includes(cabin.ageGroup)) return false;
        if (area.accessibility.allowed && !area.accessibility.allowed.includes(cabin.ageGroup)) return false;
      }
      if (cabin.restrictions && cabin.restrictions.blackoutAreas && cabin.restrictions.blackoutAreas.includes(area.id)) return false;
      return true;
    });
  }
}
