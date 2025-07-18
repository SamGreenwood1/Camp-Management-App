// pages/index.tsx

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import ScheduleDisplay from '../src/components/ScheduleDisplay'; // Adjust path if your structure differs
import {
  cabins_data,
  units_data,
  age_sub_groups_data,
  activity_areas_data,
  session_dates_data,
  scheduling_config_data
} from '../src/data/testData'; // Adjust path if your structure differs

// Create a client for TanStack Query.
// This client holds the cache and configuration for all your queries.
const queryClient = new QueryClient();

/**
 * Main page component for the Camp Schedule Application.
 * It sets up the TanStack Query provider and renders the ScheduleDisplay component.
 */
const HomePage: React.FC = () => {
  // In a real application, this data might come from API calls,
  // server-side props (getServerSideProps), or a global state manager.
  // For this independent test, we're using the mock data.

  // Using spread syntax (...) to create copies of array/object data.
  // This helps ensure immutability if any part of your UI or logic
  // were to accidentally modify the original test data.
  const mockCabins = [...cabins_data];
  const mockUnits = [...units_data];
  const mockAgeSubGroups = [...age_sub_groups_data];
  const mockActivityAreas = [...activity_areas_data];
  const mockSessionDates = { ...session_dates_data };
  const mockSchedulingConfig = { ...scheduling_config_data };

  return (
    // QueryClientProvider must wrap any components that use TanStack Query hooks.
    <QueryClientProvider client={queryClient}>
      <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto', fontFamily: 'Arial, sans-serif' }}>
        <h1>Camp Programming Management App</h1>
        <p>This is a demonstration of the daily activity scheduling component.</p>
        <ScheduleDisplay
          cabins={mockCabins}
          units={mockUnits}
          ageSubGroups={mockAgeSubGroups}
          activityAreas={mockActivityAreas}
          sessionDates={mockSessionDates}
          schedulingConfig={mockSchedulingConfig}
        />
      </div>
    </QueryClientProvider>
  );
};

export default HomePage;