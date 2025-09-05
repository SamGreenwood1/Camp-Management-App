import { useState, useEffect } from 'react';
import { CampScheduler } from '../algorithm/scheduler/CampScheduler.js';
import { config } from '../algorithm/config.js';
import { Assignment, Cabin, ActivityArea, Period } from '../scheduling/types';

interface UseCampScheduleProps {
  cabins: Cabin[];
  areas: ActivityArea[];
  periods: Period[];
  customConfig?: Partial<typeof config>;
}

interface UseCampScheduleReturn {
  data: Assignment[] | null;
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
  statistics: any;
}

export function useCampSchedule(props: UseCampScheduleProps): UseCampScheduleReturn {
  const [data, setData] = useState<Assignment[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [statistics, setStatistics] = useState<any>(null);

  const generateSchedule = async () => {
    try {
      setIsLoading(true);
      setIsError(false);
      setError(null);

      // Merge custom config with default config
      const mergedConfig = {
        ...config,
        ...props.customConfig,
        cabins: props.cabins,
        areas: props.areas,
        periods: props.periods,
      };

      // Create scheduler instance
      const scheduler = new CampScheduler(mergedConfig);
      
      // Generate schedule
      const assignments = await scheduler.schedule();
      
      // Get statistics
      const stats = scheduler.getStatistics();
      
      setData(assignments);
      setStatistics(stats);
    } catch (err) {
      setIsError(true);
      setError(err instanceof Error ? err : new Error('Unknown error occurred'));
    } finally {
      setIsLoading(false);
    }
  };

  const refetch = async () => {
    await generateSchedule();
  };

  useEffect(() => {
    if (props.cabins.length > 0 && props.areas.length > 0 && props.periods.length > 0) {
      generateSchedule();
    }
  }, [props.cabins, props.areas, props.periods]);

  return {
    data,
    isLoading,
    isError,
    error,
    refetch,
    statistics,
  };
}
