import { CampScheduler } from './src/algorithm/index.js';

async function runTest() {
  console.log('Starting test...');

  try {
    const scheduler = new CampScheduler();
    const { assignments, statistics } = await scheduler.schedule();

    console.log('Scheduling complete.');
    console.log('Statistics:', statistics);

    if (assignments.length > 0) {
      displayScheduleAsTable(assignments, scheduler.config.cabins, scheduler.config.periods);
    } else {
      console.log('No assignments were made.');
    }

  } catch (error) {
    console.error('Test failed:', error);
  }
}

function displayScheduleAsTable(assignments, cabins, periods) {
  const schedule = {};
  cabins.forEach(cabin => {
    schedule[cabin.name] = {};
  });

  assignments.forEach(assignment => {
    const cabin = cabins.find(c => c.id === assignment.cabinId);
    const period = periods.find(p => p.id === assignment.periodId && p.day === assignment.day);
    if (cabin && period) {
      const periodKey = `Day ${period.day} - ${period.name}`;
      schedule[cabin.name][periodKey] = assignment.areaId;
    }
  });

  const periodKeys = [...new Set(periods.map(p => `Day ${p.day} - ${p.name}`))];
  const header = ['Cabin', ...periodKeys];
  const rows = [header];

  cabins.forEach(cabin => {
    const row = [cabin.name];
    periodKeys.forEach(periodKey => {
      row.push(schedule[cabin.name][periodKey] || '-');
    });
    rows.push(row);
  });

  // Calculate column widths
  const colWidths = header.map((h, i) => {
    return Math.max(...rows.map(row => (row[i] ? row[i].length : 0)));
  });

  // Print header
  let headerLine = '';
  header.forEach((h, i) => {
    headerLine += h.padEnd(colWidths[i] + 2);
  });
  console.log(headerLine);

  // Print separator
  let separatorLine = '';
  colWidths.forEach(w => {
    separatorLine += ''.padEnd(w + 2, '-');
  });
  console.log(separatorLine);

  // Print rows
  rows.slice(1).forEach(row => {
    let rowLine = '';
    row.forEach((cell, i) => {
      rowLine += cell.padEnd(colWidths[i] + 2);
    });
    console.log(rowLine);
  });
}

runTest();
