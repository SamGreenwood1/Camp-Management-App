/**
 * Main CampScheduler class for orchestrating the camp scheduling algorithm
 * Implements a greedy assignment approach with clear hooks for advanced solvers
 */

import { checkHardConstraints, isDoubleBookingAllowed, isAreaAlternatingDays } from '../constraints/hardConstraints.js';
import { rankCandidateAreas, getCabinMergeInstructions, applyCabinMerging } from '../constraints/softConstraints.js';
import { getCandidateAreas, getAreaUtilization } from '../constraints/utilities.js';

/**
 * Main scheduler class for camp activity assignments
 */
export class CampScheduler {
  /**
   * Create a new CampScheduler instance
   * @param {Object} config - Configuration object
   */
  constructor(config) {
    this.config = config;
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

  /**
   * Main scheduling method - orchestrates the entire scheduling process
   * @returns {Object} Scheduling result with assignments and statistics
   */
  async schedule() {
    console.log('Starting camp scheduling...');
    this.schedulingStats.startTime = new Date();

    try {
      // Apply cabin merging if configured
      const processedCabins = applyCabinMerging(this.config.cabins, this.config);
      
      // Process manual overrides first
      this.processManualOverrides();
      
      // Process choice periods
      this.processChoicePeriods();
      
      // Main scheduling loop
      await this.runSchedulingLoop(processedCabins);
      
      // Final validation and cleanup
      this.validateFinalSchedule();
      
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

  /**
   * Process manual overrides from configuration
   */
  processManualOverrides() {
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
      this.updateSchedulingState(assignment);
    }

    console.log(`Processed ${this.config.manualOverrides.length} manual overrides`);
  }

  /**
   * Process choice periods from configuration
   */
  processChoicePeriods() {
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
      this.updateSchedulingState(assignment);
    }

    console.log(`Processed ${this.config.choicePeriods.length} choice periods`);
  }

  /**
   * Main scheduling loop - assigns cabins to areas for each period
   * @param {Array} cabins - Array of cabins to schedule
   */
  async runSchedulingLoop(cabins) {
    // Sort periods by day and time for chronological processing
    const sortedPeriods = this.sortPeriodsChronologically();
    
    for (const period of sortedPeriods) {
      console.log(`Scheduling period: ${period.name} (Day ${period.day})`);
      
      // Skip if this period is already fully assigned
      if (this.isPeriodFullyAssigned(period)) {
        console.log(`Period ${period.name} already fully assigned, skipping`);
        continue;
      }

      // Get available cabins for this period
      const availableCabins = this.getAvailableCabinsForPeriod(cabins, period);
      
      // Sort cabins by priority for fair assignment
      const prioritizedCabins = this.sortCabinsByPriority(availableCabins);
      
      // Assign each available cabin to an area
      for (const cabin of prioritizedCabins) {
        const assignment = await this.assignCabinToArea(cabin, period);
        
        if (assignment) {
          this.assignments.push(assignment);
          this.updateSchedulingState(assignment);
          console.log(`Assigned ${cabin.name} to ${assignment.areaId} for ${period.name}`);
        } else {
          this.schedulingStats.failedAssignments++;
          console.warn(`Failed to assign ${cabin.name} for ${period.name}`);
        }
      }
    }
  }

  /**
   * Sort periods chronologically by day and start time
   * @returns {Array} Sorted periods
   */
  sortPeriodsChronologically() {
    return [...this.config.periods].sort((a, b) => {
      if (a.day !== b.day) return a.day - b.day;
      return a.startTime - b.startTime;
    });
  }

  /**
   * Check if a period is already fully assigned
   * @param {Object} period - Period object
   * @returns {boolean} True if period is fully assigned
   */
  isPeriodFullyAssigned(period) {
    const assignedCabins = this.assignments.filter(a => 
      a.day === period.day && a.periodId === period.id
    ).length;
    
    return assignedCabins >= this.config.cabins.length;
  }

  /**
   * Get available cabins for a specific period
   * @param {Array} cabins - Array of all cabins
   * @param {Object} period - Period object
   * @returns {Array} Array of available cabins
   */
  getAvailableCabinsForPeriod(cabins, period) {
    return cabins.filter(cabin => {
      // Check if cabin is already assigned during this period
      const isAssigned = this.assignments.some(a => 
        a.cabinId === cabin.id && 
        a.day === period.day && 
        a.periodId === period.id
      );

      // Check if cabin is blacked out during this period
      const isBlackedOut = this.isCabinBlackedOut(cabin, period);

      return !isAssigned && !isBlackedOut;
    });
  }

  /**
   * Check if a cabin is blacked out during a period
   * @param {Object} cabin - Cabin object
   * @param {Object} period - Period object
   * @returns {boolean} True if cabin is blacked out
   */
  isCabinBlackedOut(cabin, period) {
    if (!this.config.blackoutPeriods) return false;
    
    return this.config.blackoutPeriods.some(blackout => 
      blackout.cabinId === cabin.id && 
      blackout.periodId === period.id && 
      blackout.day === period.day
    );
  }

  /**
   * Sort cabins by priority for fair assignment
   * @param {Array} cabins - Array of cabins
   * @returns {Array} Sorted cabins
   */
  sortCabinsByPriority(cabins) {
    return [...cabins].sort((a, b) => {
      // Higher priority first
      const priorityDiff = (b.priority || 0) - (a.priority || 0);
      if (priorityDiff !== 0) return priorityDiff;
      
      // Then by size (smaller cabins first for flexibility)
      return a.size - b.size;
    });
  }

  /**
   * Assign a cabin to an area during a specific period
   * @param {Object} cabin - Cabin object
   * @param {Object} period - Period object
   * @returns {Object|null} Assignment object or null if assignment failed
   */
  async assignCabinToArea(cabin, period) {
    // Get candidate areas for this cabin and period
    let candidateAreas = getCandidateAreas(cabin, this.config.areas, this.config.periods, period.day, period.id);
    
    if (candidateAreas.length === 0) {
      console.warn(`No candidate areas available for ${cabin.name} during ${period.name}`);
      return null;
    }

    // Apply hard constraints to filter out invalid areas
    candidateAreas = candidateAreas.filter(area => {
      const constraintResult = checkHardConstraints(cabin, area, period, this.assignments, this.config);
      return constraintResult.isValid;
    });

    if (candidateAreas.length === 0) {
      console.warn(`No areas satisfy hard constraints for ${cabin.name} during ${period.name}`);
      this.schedulingStats.constraintViolations++;
      return null;
    }

    // Rank candidate areas by soft constraints
    const rankedAreas = rankCandidateAreas(candidateAreas, cabin, period, this.assignments, this.config);
    
    // Try to assign to the best area
    for (const area of rankedAreas) {
      if (this.canAssignCabinToArea(cabin, area, period)) {
        return {
          cabinId: cabin.id,
          areaId: area.id,
          periodId: period.id,
          day: period.day,
          isManualOverride: false,
          isChoicePeriod: false
        };
      }
    }

    // If no area works, try double booking if allowed
    for (const area of rankedAreas) {
      if (isDoubleBookingAllowed(area, cabin.id, this.assignments, period.day, period.id)) {
        if (this.canAssignCabinToArea(cabin, area, period, true)) {
          return {
            cabinId: cabin.id,
            areaId: area.id,
            periodId: period.id,
            day: period.day,
            isManualOverride: false,
            isChoicePeriod: false,
            isDoubleBooked: true
          };
        }
      }
    }

    return null;
  }

  /**
   * Check if a cabin can be assigned to an area
   * @param {Object} cabin - Cabin object
   * @param {Object} area - Activity area
   * @param {Object} period - Period object
   * @param {boolean} allowDoubleBooking - Whether to allow double booking
   * @returns {boolean} True if assignment is possible
   */
  canAssignCabinToArea(cabin, area, period, allowDoubleBooking = false) {
    // Check if area is at capacity
    const currentUtilization = getAreaUtilization(area.id, this.assignments, period.day, period.id);
    
    if (allowDoubleBooking) {
      // For double booking, check if it's within reasonable limits
      return currentUtilization < area.maxCapacity * 1.5; // Allow 50% overage
    } else {
      // Normal capacity check
      return currentUtilization < area.maxCapacity;
    }
  }

  /**
   * Update internal scheduling state after an assignment
   * @param {Object} assignment - Assignment object
   */
  updateSchedulingState(assignment) {
    // Update cabin history
    if (!this.cabinHistory[assignment.cabinId]) {
      this.cabinHistory[assignment.cabinId] = [];
    }
    this.cabinHistory[assignment.cabinId].push(assignment);

    // Update area utilization
    const key = `${assignment.areaId}_${assignment.day}_${assignment.periodId}`;
    this.areaUtilization[key] = (this.areaUtilization[key] || 0) + 1;

    // Update day assignments
    if (!this.dayAssignments[assignment.day]) {
      this.dayAssignments[assignment.day] = [];
    }
    this.dayAssignments[assignment.day].push(assignment);
  }

  /**
   * Validate the final schedule for consistency
   */
  validateFinalSchedule() {
    console.log('Validating final schedule...');
    
    let violations = 0;
    
    // Check for double assignments
    for (const assignment of this.assignments) {
      const duplicates = this.assignments.filter(a => 
        a.cabinId === assignment.cabinId && 
        a.day === assignment.day && 
        a.periodId === assignment.periodId
      );
      
      if (duplicates.length > 1) {
        console.error(`Double assignment detected for cabin ${assignment.cabinId} on day ${assignment.day}, period ${assignment.periodId}`);
        violations++;
      }
    }

    // Check area capacity violations
    for (const area of this.config.areas) {
      for (const period of this.config.periods) {
        const utilization = getAreaUtilization(area.id, this.assignments, period.day, period.id);
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

  /**
   * Get scheduling statistics
   * @returns {Object} Statistics object
   */
  getStatistics() {
    return {
      ...this.schedulingStats,
      duration: this.schedulingStats.endTime && this.schedulingStats.startTime 
        ? this.schedulingStats.endTime - this.schedulingStats.startTime 
        : null,
      successRate: this.schedulingStats.totalAssignments > 0 
        ? (this.schedulingStats.totalAssignments - this.schedulingStats.failedAssignments) / this.schedulingStats.totalAssignments 
        : 0
    };
  }

  /**
   * Export schedule to various formats
   * @param {string} format - Export format ('json', 'csv', 'html')
   * @returns {string} Exported schedule
   */
  exportSchedule(format = 'json') {
    switch (format.toLowerCase()) {
      case 'json':
        return JSON.stringify(this.assignments, null, 2);
      case 'csv':
        return this.exportToCSV();
      case 'html':
        return this.exportToHTML();
      default:
        throw new Error(`Unsupported export format: ${format}`);
    }
  }

  /**
   * Export schedule to CSV format
   * @returns {string} CSV string
   */
  exportToCSV() {
    const headers = ['Day', 'Period', 'Cabin', 'Area', 'Type'];
    const rows = this.assignments.map(a => [
      a.day,
      a.periodId,
      a.cabinId,
      a.areaId,
      a.isManualOverride ? 'Manual' : a.isChoicePeriod ? 'Choice' : 'Auto'
    ]);
    
    return [headers, ...rows]
      .map(row => row.map(cell => `"${cell}"`).join(','))
      .join('\n');
  }

  /**
   * Export schedule to HTML format
   * @returns {string} HTML string
   */
  exportToHTML() {
    const tableRows = this.assignments.map(a => `
      <tr>
        <td>${a.day}</td>
        <td>${a.periodId}</td>
        <td>${a.cabinId}</td>
        <td>${a.areaId}</td>
        <td>${a.isManualOverride ? 'Manual' : a.isChoicePeriod ? 'Choice' : 'Auto'}</td>
      </tr>
    `).join('');

    return `
      <html>
        <head><title>Camp Schedule</title></head>
        <body>
          <h1>Camp Schedule</h1>
          <table border="1">
            <tr><th>Day</th><th>Period</th><th>Cabin</th><th>Area</th><th>Type</th></tr>
            ${tableRows}
          </table>
        </body>
      </html>
    `;
  }
}
