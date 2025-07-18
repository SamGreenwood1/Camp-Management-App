// pages/index.tsx

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import ScheduleDisplay from '../components/ScheduleDisplay';
import ProgramSheetUpload from '../components/ProgramSheetUpload';
// import UserManagement from '../components/UserManagement'; // Placeholder for future
// import AdminDashboard from '../components/AdminDashboard'; // Placeholder for future

// TODO: Replace with real data source or API
import {
  cabins_data,
  units_data,
  age_sub_groups_data,
  activity_areas_data,
  session_dates_data,
  scheduling_config_data
} from '../data/testData';

const queryClient = new QueryClient();

const HomePage: React.FC = () => {
  const mockCabins = [...cabins_data];
  const mockUnits = [...units_data];
  const mockAgeSubGroups = [...age_sub_groups_data];
  const mockActivityAreas = [...activity_areas_data];
  const mockSessionDates = { ...session_dates_data };
  const mockSchedulingConfig = { ...scheduling_config_data };

  return (
    <QueryClientProvider client={queryClient}>
      <div style={{
        minHeight: '100vh',
        background: '#f7fafc',
        fontFamily: 'Inter, Arial, sans-serif',
        padding: '0',
        margin: '0',
      }}>
        <header style={{
          background: '#2b6cb0',
          color: 'white',
          padding: '32px 0 16px 0',
          textAlign: 'center',
          boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
        }}>
          <h1 style={{ fontSize: '2.5rem', margin: 0 }}>Camp Programming Management App</h1>
          <p style={{ fontSize: '1.2rem', margin: '8px 0 0 0' }}>
            Centralized dashboard for scheduling, program management, and staff roles.
          </p>
        </header>
        <main style={{
          maxWidth: '1200px',
          margin: '32px auto',
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '32px',
        }}>
          {/* Daily Schedule Section */}
          <section style={{
            background: 'white',
            borderRadius: '12px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
            padding: '24px',
            gridColumn: '1 / 3',
          }}>
            <h2 style={{ marginTop: 0 }}>Daily Schedule</h2>
            <ScheduleDisplay
              cabins={mockCabins}
              units={mockUnits}
              ageSubGroups={mockAgeSubGroups}
              activityAreas={mockActivityAreas}
              sessionDates={mockSessionDates}
              schedulingConfig={mockSchedulingConfig}
            />
          </section>

          {/* Program Bank Section */}
          <section style={{
            background: 'white',
            borderRadius: '12px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
            padding: '24px',
          }}>
            <h2 style={{ marginTop: 0 }}>Program Bank</h2>
            <p>Upload and manage camp program sheets. Extract details with AI.</p>
            <ProgramSheetUpload />
          </section>

          {/* User/Role Management Section (Placeholder) */}
          <section style={{
            background: 'white',
            borderRadius: '12px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
            padding: '24px',
          }}>
            <h2 style={{ marginTop: 0 }}>User & Role Management</h2>
            <p>Manage staff accounts, roles, and permissions. (Coming soon)</p>
          </section>

          {/* Technical Admin Dashboard Section (Placeholder) */}
          <section style={{
            background: 'white',
            borderRadius: '12px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
            padding: '24px',
          }}>
            <h2 style={{ marginTop: 0 }}>Technical Admin Dashboard</h2>
            <p>System health, logs, and integrations.</p>
            <div style={{ marginTop: 24 }}>
              <h3 style={{ color: '#2b6cb0', fontSize: '1.1rem' }}>Camp Administration App Integrations</h3>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                {[
                  { name: 'CampInTouch', status: 'Not Connected' },
                  { name: 'CampMinder', status: 'Not Connected' },
                  { name: 'CampDoc', status: 'Not Connected' },
                  { name: 'Campwise', status: 'Not Connected' },
                ].map((integration) => (
                  <li key={integration.name} style={{ marginBottom: 16, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span><strong>{integration.name}</strong> <span style={{ color: '#718096', fontWeight: 400 }}>({integration.status})</span></span>
                    <button style={{ background: '#2b6cb0', color: 'white', border: 'none', borderRadius: 4, padding: '6px 18px', fontWeight: 600, cursor: 'pointer' }} disabled>
                      Connect
                    </button>
                  </li>
                ))}
              </ul>
            </div>
            <p style={{ color: '#718096', fontSize: '0.95rem', marginTop: 24 }}>
              (Integration setup coming soon. Contact your admin for details.)
            </p>
          </section>
        </main>
        <footer style={{
          textAlign: 'center',
          color: '#718096',
          fontSize: '0.95rem',
          padding: '24px 0 12px 0',
        }}>
          &copy; {new Date().getFullYear()} Camp Programming Management App
        </footer>
      </div>
    </QueryClientProvider>
  );
};

export default HomePage;