import React from 'react';
import { createRoot } from 'react-dom/client';
import ScheduleDisplay from './components/ScheduleDisplay';

const rootElement = document.getElementById('root');
if (rootElement) {
  const root = createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <ScheduleDisplay />
    </React.StrictMode>
  );
} else {
  console.error("Root element not found. Please ensure your HTML contains <div id='root'></div>");
} 