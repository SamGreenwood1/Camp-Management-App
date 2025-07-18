// src/components/ScheduleDisplay.tsx
import React from 'react';
import { useCampSchedule } from '../hooks/useCampSchedule';
import {
  Cabin,
  ActivityArea,
  SessionDates,
  SchedulingConfig,
  Unit,
  AgeSubGroup,
  ScheduledEntry,
  TimeSlot // Import all necessary types for props and rendering
} from '../scheduling/types';

interface ScheduleDisplayProps {
  cabins: Cabin[];
  units: Unit[];
  ageSubGroups: AgeSubGroup[];
  activityAreas: ActivityArea[];
  sessionDates: SessionDates;
  schedulingConfig: SchedulingConfig;
}

const ScheduleDisplay: React.FC<ScheduleDisplayProps> = (props) => {
  // Use the custom hook to get schedule data and its status
  const { data: schedule, isLoading, isError, error, refetch } = useCampSchedule(props);

  // --- Derived data for rendering ---
  // Create a map for quick lookup of activity area names by ID
  const activityAreaNameMap = React.useMemo(() => {
    return new Map(props.activityAreas.map(area => [area.id, area.name]));
  }, [props.activityAreas]);

  // Create a map for quick lookup of time slot display names by ID
  const timeSlotNameMap = React.useMemo(() => {
    return new Map(props.schedulingConfig.dailyTimeSlots.map(ts => [ts.id, ts.name]));
  }, [props.schedulingConfig.dailyTimeSlots]);

  // Create a map for cabin group display names, handling merged groups
  const cabinGroupDisplayNameMap = React.useMemo(() => {
    const displayMap = new Map<string, string>();
    const processedMergedGroups = new Set<string>();

    props.cabins.forEach(cabin => {
      if (cabin.mergedWith && cabin.mergedWith.length > 0) {
        const mergedIds = [...new Set([cabin.id, ...cabin.mergedWith])].sort();
        const mergedGroupId = mergedIds.join('_');
        if (!processedMergedGroups.has(mergedGroupId)) {
          const mergedName = mergedIds.map(id => props.cabins.find(c => c.id === id)?.name || 'Unknown').join(' & ');
          displayMap.set(mergedGroupId, mergedName);
          mergedIds.forEach(id => processedMergedGroups.add(id)); // Mark as processed
        }
      } else if (!displayMap.has(cabin.id)) { // Only add if not part of a processed merged group
        displayMap.set(cabin.id, cabin.name);
      }
    });
    return displayMap;
  }, [props.cabins]);


  // Helper function to get a consistent group ID from assignedCabinGroupIds
  const getDisplayGroupId = (assignedIds: string[]): string => {
    return assignedIds.sort().join('_');
  };

  // Group schedule entries by date and then by internal cabin group ID
  const scheduleByDateAndGroup = React.useMemo(() => {
    const result: Record<string, Record<string, Record<string, string>>> = {}; // date -> groupID -> timeSlotID -> activityAreaName

    if (schedule) {
      schedule.forEach(entry => {
        const date = entry.date;
        const groupId = getDisplayGroupId(entry.assignedCabinGroupIds); // Consistent group ID
        const timeSlotId = entry.timeSlotId;
        const areaName = activityAreaNameMap.get(entry.activityAreaId) || 'N/A';

        if (!result[date]) {
          result[date] = {};
        }
        if (!result[date][groupId]) {
          result[date][groupId] = {};
        }
        result[date][groupId][timeSlotId] = areaName;
      });
    }
    return result;
  }, [schedule, activityAreaNameMap]);


  // Get the ordered list of unique cabin groups for rendering rows
  // Re-derive from original props, apply same sorting as generator for consistency
  const sortedCabinGroupsForDisplay = React.useMemo(() => {
    const groups: { id: string; displayName: string; originalCabinIds: string[] }[] = [];
    const processedCabinIds = new Set<string>();

    props.cabins.forEach((cabin) => {
      if (!processedCabinIds.has(cabin.id)) {
        if (props.schedulingConfig.allowCabinMerging && cabin.mergedWith && cabin.mergedWith.length > 0) {
          const mergedCabinIds = [...new Set([cabin.id, ...cabin.mergedWith])].sort();
          const validMergedCabins = mergedCabinIds.filter(cId => props.cabins.some(c => c.id === cId));

          if (validMergedCabins.length > 0) {
            const mergedName = validMergedCabins.map(cId => props.cabins.find(c => c.id === cId)?.name || 'Unknown').join(' & ');
            groups.push({
              id: mergedCabinIds.join('_'),
              displayName: mergedName,
              originalCabinIds: validMergedCabins
            });
            validMergedCabins.forEach(id => processedCabinIds.add(id));
          }
        } else if (!processedCabinIds.has(cabin.id)) {
          groups.push({
            id: cabin.id,
            displayName: cabin.name,
            originalCabinIds: [cabin.id]
          });
          processedCabinIds.add(cabin.id);
        }
      }
    });

    // Re-apply the same hierarchical sorting as in the generator
    // This is important to ensure row order matches what the user expects from input sorting
    groups.sort((a, b) => {
      const cabinA = props.cabins.find(c => c.id === a.originalCabinIds[0]);
      const cabinB = props.cabins.find(c => c.id === b.originalCabinIds[0]);
      
      if (!cabinA || !cabinB) return 0; // Should not happen with valid data

      if (cabinA.unitId !== cabinB.unitId) return cabinA.unitId.localeCompare(cabinB.unitId);
      if (cabinA.gender !== cabinB.gender) return cabinA.gender.localeCompare(cabinB.gender);
      const aAge = cabinA.ageSubGroupId || '';
      const bAge = cabinB.ageSubGroupId || '';
      if (aAge !== bAge) return aAge.localeCompare(bAge);
      return cabinA.name.localeCompare(cabinB.name);
    });

    return groups;
  }, [props.cabins, props.schedulingConfig.allowCabinMerging, props.units, props.ageSubGroups]);


  if (isLoading) return <div>Loading schedule...</div>;
  if (isError) return <div>Error loading schedule: {(error as Error)?.message}</div>;
  if (!schedule || schedule.length === 0) return <div>No schedule generated or available.</div>;

  const sortedDates = Object.keys(scheduleByDate).sort();

  return (
    <div className="schedule-container">
      <h2>Camp Schedule</h2>
      <button onClick={() => refetch()} style={{ marginBottom: '20px', padding: '10px 15px' }}>
        Regenerate Schedule
      </button>

      {sortedDates.map((date) => (
        <div key={date} style={{ marginBottom: '30px', border: '1px solid #eee', padding: '15px' }}>
          <h3>Date: {date}</h3>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#f2f2f2' }}>
                <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left' }}>Cabin/Group</th>
                {props.schedulingConfig.dailyTimeSlots.map(ts => (
                  <th key={ts.id} style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left' }}>
                    {ts.name} ({ts.time})
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {sortedCabinGroupsForDisplay.map(group => (
                <tr key={group.id}>
                  <td style={{ border: '1px solid #ddd', padding: '8px' }}>{group.displayName}</td>
                  {props.schedulingConfig.dailyTimeSlots.map(ts => (
                    <td key={ts.id} style={{ border: '1px solid #ddd', padding: '8px' }}>
                      {scheduleByDateAndGroup[date]?.[group.id]?.[ts.id] || 'UNSCHEDULED'}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  );
};

export default ScheduleDisplay;