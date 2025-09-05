// src/components/ScheduleDisplay.tsx
import React from 'react';
import { useCampSchedule } from '../hooks/useCampSchedule';
import { Cabin, ActivityArea, Period, Assignment } from '../scheduling/types';

interface ScheduleDisplayProps {
  cabins: Cabin[];
  areas: ActivityArea[];
  periods: Period[];
}

const ScheduleDisplay: React.FC<ScheduleDisplayProps> = (props) => {
  // Use the custom hook to get schedule data and its status
  const { data: assignments, isLoading, isError, error, refetch, statistics } = useCampSchedule({
    cabins: props.cabins,
    areas: props.areas,
    periods: props.periods,
  });

  // Create maps for quick lookups
  const areaNameMap = React.useMemo(() => {
    return new Map(props.areas.map(area => [area.id, area.name]));
  }, [props.areas]);

  const periodNameMap = React.useMemo(() => {
    return new Map(props.periods.map(period => [period.id, period.name]));
  }, [props.periods]);

  const cabinNameMap = React.useMemo(() => {
    return new Map(props.cabins.map(cabin => [cabin.id, cabin.name]));
  }, [props.cabins]);

  // Group assignments by day and period
  const scheduleByDay = React.useMemo(() => {
    if (!assignments) return {};

    const result: Record<number, Record<string, Record<string, string>>> = {};
    
    assignments.forEach(assignment => {
      const day = assignment.day;
      const periodId = assignment.periodId;
      const cabinId = assignment.cabinId;
      const areaName = areaNameMap.get(assignment.areaId) || 'Unknown Area';

      if (!result[day]) {
        result[day] = {};
      }
      if (!result[day][periodId]) {
        result[day][periodId] = {};
      }
      result[day][periodId][cabinId] = areaName;
    });

    return result;
  }, [assignments, areaNameMap]);

  // Get unique days and periods for display
  const uniqueDays = React.useMemo(() => {
    if (!assignments) return [];
    return [...new Set(assignments.map(a => a.day))].sort();
  }, [assignments]);

  const uniquePeriods = React.useMemo(() => {
    return props.periods.sort((a, b) => a.startTime - b.startTime);
  }, [props.periods]);

  if (isLoading) return (
    <div style={{ textAlign: 'center', padding: '2rem' }}>
      <div>Generating schedule...</div>
    </div>
  );

  if (isError) return (
    <div style={{ textAlign: 'center', padding: '2rem', color: 'red' }}>
      <div>Error generating schedule: {error?.message}</div>
      <button onClick={() => refetch()} style={{ marginTop: '1rem', padding: '0.5rem 1rem' }}>
        Try Again
      </button>
    </div>
  );

  if (!assignments || assignments.length === 0) return (
    <div style={{ textAlign: 'center', padding: '2rem' }}>
      <div>No schedule generated. Click the button below to generate one.</div>
      <button onClick={() => refetch()} style={{ marginTop: '1rem', padding: '0.5rem 1rem' }}>
        Generate Schedule
      </button>
    </div>
  );

  return (
    <div className="schedule-container" style={{ 
      fontFamily: 'Segoe UI, Arial, sans-serif', 
      background: '#f9f9fb', 
      minHeight: '100vh', 
      padding: '32px' 
    }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <h1 style={{ 
          textAlign: 'center', 
          color: '#2d3748', 
          marginBottom: '8px', 
          fontWeight: 700, 
          fontSize: '36px', 
          letterSpacing: '1px' 
        }}>
          Camp Schedule
        </h1>
        <p style={{ 
          textAlign: 'center', 
          color: '#4a5568', 
          marginBottom: '32px', 
          fontSize: '18px' 
        }}>
          Daily activity schedule for all cabins
        </p>

        {/* Statistics Display */}
        {statistics && (
          <div style={{ 
            background: '#fff', 
            borderRadius: '8px', 
            padding: '16px', 
            marginBottom: '24px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}>
            <h3 style={{ margin: '0 0 12px 0', color: '#2d3748' }}>Schedule Statistics</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
              <div>
                <strong>Total Assignments:</strong> {statistics.totalAssignments || 0}
              </div>
              <div>
                <strong>Days Scheduled:</strong> {statistics.daysScheduled || 0}
              </div>
              <div>
                <strong>Cabins Scheduled:</strong> {statistics.cabinsScheduled || 0}
              </div>
              <div>
                <strong>Areas Used:</strong> {statistics.areasUsed || 0}
              </div>
            </div>
          </div>
        )}

        {/* Regenerate Button */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '24px' }}>
          <button onClick={() => refetch()} style={{ 
            background: '#3182ce', 
            color: '#fff', 
            border: 'none', 
            borderRadius: '6px', 
            padding: '12px 28px', 
            fontSize: '16px', 
            fontWeight: 600, 
            cursor: 'pointer', 
            boxShadow: '0 2px 8px rgba(49,130,206,0.08)', 
            transition: 'background 0.2s' 
          }}>
            Regenerate Schedule
          </button>
        </div>

        {/* Schedule Display */}
        {uniqueDays.map(day => (
          <div key={day} style={{ 
            marginBottom: '36px', 
            background: '#fff', 
            borderRadius: '12px', 
            boxShadow: '0 2px 12px rgba(0,0,0,0.06)', 
            padding: '24px 20px' 
          }}>
            <h3 style={{ 
              color: '#2b6cb0', 
              fontSize: '22px', 
              marginBottom: '18px', 
              fontWeight: 600 
            }}>
              Day {day}
            </h3>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '16px' }}>
                <thead>
                  <tr style={{ background: '#ebf8ff' }}>
                    <th style={{ 
                      border: '1px solid #cbd5e0', 
                      padding: '10px 14px', 
                      textAlign: 'left', 
                      fontWeight: 700 
                    }}>
                      Cabin
                    </th>
                    {uniquePeriods.map(period => (
                      <th key={period.id} style={{ 
                        border: '1px solid #cbd5e0', 
                        padding: '10px 14px', 
                        textAlign: 'left', 
                        fontWeight: 700 
                      }}>
                        {period.name}
                        <br />
                        <span style={{ color: '#718096', fontWeight: 400, fontSize: '14px' }}>
                          {period.startTime.toString().padStart(4, '0').replace(/(\d{2})(\d{2})/, '$1:$2')} - 
                          {period.endTime.toString().padStart(4, '0').replace(/(\d{2})(\d{2})/, '$1:$2')}
                        </span>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {props.cabins.map(cabin => (
                    <tr key={cabin.id} style={{ 
                      background: '#f7fafc', 
                      borderBottom: '1px solid #e2e8f0' 
                    }}>
                      <td style={{ 
                        border: '1px solid #cbd5e0', 
                        padding: '10px 14px', 
                        fontWeight: 600 
                      }}>
                        {cabin.name}
                        <br />
                        <span style={{ color: '#718096', fontSize: '14px' }}>
                          {cabin.unit} • {cabin.ageGroup} • {cabin.size} campers
                        </span>
                      </td>
                      {uniquePeriods.map(period => {
                        const areaName = scheduleByDay[day]?.[period.id]?.[cabin.id];
                        return (
                          <td key={period.id} style={{ 
                            border: '1px solid #cbd5e0', 
                            padding: '10px 14px', 
                            color: '#2d3748', 
                            background: '#fff' 
                          }}>
                            {areaName || (
                              <span style={{ color: '#e53e3e', fontWeight: 500 }}>
                                UNSCHEDULED
                              </span>
                            )}
                        </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ScheduleDisplay;