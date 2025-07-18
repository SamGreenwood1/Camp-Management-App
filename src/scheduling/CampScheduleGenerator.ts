// src/scheduling/CampScheduleGenerator.ts
import {
    TimeSlot,
    ActivityArea,
    Cabin,
    Unit,
    AgeSubGroup,
    SessionDates,
    SchedulingConfig,
    ScheduledEntry
  } from './types'; // Import from the new types file
  
  // Internal representation for cabin groups, including merged ones
  interface InternalCabinGroup {
    id: string; // Unique ID for the group (e.g., 'c1' or 'c1_c2_c3')
    name: string;
    displayName: string; // For UI display (e.g., "Nitzotzot M2 & Nitzotzot M3")
    unitId: string;
    gender: 'male' | 'female';
    ageSubGroupId: string | null;
    size: number;
    originalCabinIds: string[]; // List of original cabin IDs that form this group
    isMerged: boolean;
  }
  
  /**
   * CampScheduleGenerator
   *
   * A class for programmatically generating a daily activity schedule for summer camp cabins.
   * It focuses purely on assigning cabin groups to activity areas and time slots,
   * handling merged cabins and equitable activity area rotation.
   *
   * Staffing and specific program assignments are assumed to be handled in separate processes
   * after this core schedule is generated. Capacity checks for areas are omitted
   * as cabins are assumed to generally fit.
   */
  export class CampScheduleGenerator {
    private cabins: Cabin[];
    private units: Unit[];
    private ageSubGroups: AgeSubGroup[];
    private activityAreas: ActivityArea[];
    private sessionDates: SessionDates;
    private schedulingConfig: SchedulingConfig;
  
    private rawSchedule: ScheduledEntry[] = [];
    private currentDate: Date;
  
    // Internal maps for quick lookups
    private cabinMap: Map<string, Cabin>;
    private activityAreaMap: Map<string, ActivityArea>;
  
    // Prepared active cabin groups (handles merging logic)
    private activeCabinGroups: InternalCabinGroup[];
  
    // Track weekly visits for each cabin group to ensure rotation
    // Map<cabinGroupId, Map<areaId, count>>
    private weeklyAreaVisits: Map<string, Map<string, number>>;
    // Map<cabinGroupId, Map<areaId, lastVisitDate_str>>
    private lastVisitDate: Map<string, Map<string, string | null>>;
  
    // Track daily area usage (to prevent double booking of areas within a time slot)
    // Map<dateString, Map<timeSlotId, Set<areaId>>>
    private dailyAreaUsageTracker: Map<string, Map<string, Set<string>>>;
  
    constructor(
      cabins: Cabin[],
      units: Unit[],
      ageSubGroups: AgeSubGroup[],
      activityAreas: ActivityArea[],
      sessionDates: SessionDates,
      schedulingConfig: SchedulingConfig
    ) {
      this.cabins = cabins;
      this.units = units;
      this.ageSubGroups = ageSubGroups;
      this.activityAreas = activityAreas;
      this.sessionDates = sessionDates;
      this.schedulingConfig = schedulingConfig;
  
      this.currentDate = new Date(this.sessionDates.startDate);
  
      this.cabinMap = new Map(cabins.map((c) => [c.id, c]));
      this.activityAreaMap = new Map(activityAreas.map((a) => [a.id, a]));
  
      this.activeCabinGroups = this.prepareCabinGroups();
  
      this.weeklyAreaVisits = new Map();
      this.lastVisitDate = new Map();
      this.activeCabinGroups.forEach((group) => {
        this.weeklyAreaVisits.set(group.id, new Map());
        this.activityAreas.forEach((area) => {
          this.weeklyAreaVisits.get(group.id)?.set(area.id, 0);
        });
      });
  
      this.dailyAreaUsageTracker = new Map();
    }
  
    /**
     * Prepares the list of active cabin groups, handling merged cabins.
     * Merged cabins are represented as a single entity for scheduling.
     * @returns {InternalCabinGroup[]} List of active scheduling entities.
     * @private
     */
    private prepareCabinGroups(): InternalCabinGroup[] {
      const groups: InternalCabinGroup[] = [];
      const processedCabinIds = new Set<string>();
  
      this.cabins.forEach((cabin) => {
        if (!processedCabinIds.has(cabin.id)) {
          if (
            this.schedulingConfig.allowCabinMerging &&
            cabin.mergedWith &&
            cabin.mergedWith.length > 0
          ) {
            const mergedCabinIds = [...new Set([cabin.id, ...cabin.mergedWith])]
              .sort(); // Ensure unique and sorted for consistent ID
  
            const validMergedCabins = mergedCabinIds.filter((cId) =>
              this.cabinMap.has(cId)
            );
  
            if (validMergedCabins.length === 0) {
              console.warn(
                `Warning: Skipping merged group initiated by ${cabin.id} as no valid cabins found.`
              );
              return;
            }
  
            const primaryCabinForGroup = this.cabinMap.get(validMergedCabins[0])!;
  
            const mergedGroupName = validMergedCabins
              .map((cId) => this.cabinMap.get(cId)?.name || 'Unknown Cabin')
              .join(' & ');
            const mergedGroupId = validMergedCabins.join('_');
            let totalSize = 0;
            validMergedCabins.forEach((cId) => {
              totalSize += this.cabinMap.get(cId)?.size || 0;
              processedCabinIds.add(cId);
            });
  
            groups.push({
              id: mergedGroupId,
              name: mergedGroupName,
              displayName: mergedGroupName,
              unitId: primaryCabinForGroup.unitId,
              gender: primaryCabinForGroup.gender,
              ageSubGroupId: primaryCabinForGroup.ageSubGroupId,
              size: totalSize,
              originalCabinIds: validMergedCabins,
              isMerged: true,
            });
          } else {
            groups.push({
              id: cabin.id,
              name: cabin.name,
              displayName: cabin.name,
              unitId: cabin.unitId,
              gender: cabin.gender,
              ageSubGroupId: cabin.ageSubGroupId,
              size: cabin.size,
              originalCabinIds: [cabin.id],
              isMerged: false,
            });
            processedCabinIds.add(cabin.id);
          }
        }
      });
  
      // Sort cabin groups for consistent output and potentially better scheduling distribution
      // Hierarchy: Unit -> gender -> (optionally) age sub -> cabin name
      groups.sort((a, b) => {
        if (a.unitId !== b.unitId) return a.unitId.localeCompare(b.unitId);
        if (a.gender !== b.gender) return a.gender.localeCompare(b.gender);
        const aAge = a.ageSubGroupId || '';
        const bAge = b.ageSubGroupId || '';
        if (aAge !== bAge) return aAge.localeCompare(bAge);
        return a.name.localeCompare(b.name);
      });
  
      return groups;
    }
  
    /**
     * Generates the core schedule assignments (cabin groups to areas/slots).
     * @returns {ScheduledEntry[]} The generated raw schedule.
     */
    public generateRawSchedule(): ScheduledEntry[] {
      this.rawSchedule = []; // Clear previous schedule if run multiple times
      this.currentDate = new Date(this.sessionDates.startDate); // Reset current date
  
      const endDate = new Date(this.sessionDates.endDate);
  
      while (this.currentDate <= endDate) {
        const dateString = this.currentDate.toISOString().split('T')[0];
        this.dailyAreaUsageTracker.set(dateString, new Map()); // Reset daily usage for areas
  
        // Reset weekly visit counts if it's the start of a new 'week' for rotation tracking.
        const sessionStartDateObj = new Date(this.sessionDates.startDate);
        if (
          this.currentDate.getDay() === sessionStartDateObj.getDay() ||
          dateString === sessionStartDateObj.toISOString().split('T')[0]
        ) {
          this.activeCabinGroups.forEach((group) => {
            this.activityAreas.forEach((area) => {
              this.weeklyAreaVisits.get(group.id)?.set(area.id, 0);
            });
          });
        }
  
        // List of all active cabin groups, shuffled once per day for fairness across periods
        const groupsForDay = [...this.activeCabinGroups];
        this.shuffleArray(groupsForDay);
  
        // Shuffle activity areas once per day (optional, but helps distribute)
        const shuffledActivityAreas = [...this.activityAreas];
        this.shuffleArray(shuffledActivityAreas);
  
        for (const timeSlot of this.schedulingConfig.dailyTimeSlots) {
          const timeSlotId = timeSlot.id;
  
          if (!this.dailyAreaUsageTracker.get(dateString)) {
            this.dailyAreaUsageTracker.set(dateString, new Map());
          }
          if (!this.dailyAreaUsageTracker.get(dateString)?.has(timeSlotId)) {
            this.dailyAreaUsageTracker.get(dateString)?.set(timeSlotId, new Set());
          }
          const areasUsedInCurrentSlot = this.dailyAreaUsageTracker.get(dateString)?.get(timeSlotId)!;
  
          // Tracks which specific cabin groups have been scheduled IN THIS CURRENT PERIOD
          const groupsScheduledInCurrentPeriod = new Set<string>(); 
          
          // Iterate through each cabin group to try and schedule them for this period
          for (const cabinGroup of groupsForDay) {
            // If this group has already been scheduled in this *specific period*, skip it.
            if (groupsScheduledInCurrentPeriod.has(cabinGroup.id)) {
              continue;
            }
            
            // Prioritize areas: Unvisited this week first, then least visited overall.
            const areasToConsider = [...shuffledActivityAreas].sort((a, b) => {
              const aVisitsThisWeek =
                this.weeklyAreaVisits.get(cabinGroup.id)?.get(a.id) || 0;
              const bVisitsThisWeek =
                this.weeklyAreaVisits.get(cabinGroup.id)?.get(b.id) || 0;
  
              if (this.schedulingConfig.ensureEveryAreaPerWeek) {
                if (aVisitsThisWeek === 0 && bVisitsThisWeek > 0) return -1;
                if (bVisitsThisWeek === 0 && aVisitsThisWeek > 0) return 1;
              }
              return aVisitsThisWeek - bVisitsThisWeek;
            });
  
            for (const area of areasToConsider) {
              // Check if area is already booked for this specific time slot on this date
              if (areasUsedInCurrentSlot.has(area.id)) {
                continue;
              }
  
              // Check if this area is available during this time slot based on its own configuration
              if (!area.availableTimeSlots.includes(timeSlotId)) {
                continue;
              }
  
              // Successfully found a slot for the cabin group in this area!
              this.rawSchedule.push({
                date: dateString,
                timeSlotId: timeSlotId,
                activityAreaId: area.id,
                assignedCabinGroupIds: cabinGroup.originalCabinIds,
              });
  
              // Update trackers
              areasUsedInCurrentSlot.add(area.id); // Mark area as used for THIS slot
              groupsScheduledInCurrentPeriod.add(cabinGroup.id); // Mark group scheduled for THIS period
  
              // Update weekly visits for this group and area
              this.weeklyAreaVisits
                .get(cabinGroup.id)
                ?.set(area.id, (this.weeklyAreaVisits.get(cabinGroup.id)?.get(area.id) || 0) + 1);
              
              // lastVisitDate is not strictly needed for current logic but kept as it was in original thoughts
              // this.lastVisitDate.get(cabinGroup.id)?.set(area.id, dateString);
  
              break; // Move to the next cabin group to try and schedule in this period
            }
          }
        }
  
        // Advance to the next day
        this.currentDate.setDate(this.currentDate.getDate() + 1);
      }
      return this.rawSchedule;
    }
  
    /**
     * Helper function to shuffle an array (Fisher-Yates algorithm).
     * @param {Array} array - The array to shuffle.
     * @private
     */
    private shuffleArray<T>(array: T[]): void {
      for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
      }
    }
  }