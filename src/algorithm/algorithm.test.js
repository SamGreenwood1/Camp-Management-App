import assert from 'assert';
import { CampScheduler } from './scheduler/CampScheduler.js';
import { loadConfigFromEnv, config } from './config.js';

// Set up environment variables for the test
process.env.UNITS = "Seniors,Juniors,Trainees";
process.env.ACTIVITY_AREAS = "Waterfront:swimming,canoeing;Sports:archery,soccer";
process.env.CABIN_NAME_TEMPLATE = "full_unit_name_and_number";
process.env.NUMBER_OF_PERIODS = 9;

async function runTest() {
  console.log('Running scheduling algorithm test...');

  // Load config from environment
  loadConfigFromEnv();

  // Instantiate the scheduler
  const scheduler = new CampScheduler(config);

  // Run the scheduling process
  const result = await scheduler.schedule();

  // Assert that the schedule was generated successfully
  assert.strictEqual(result.success, true, 'Scheduler should run successfully');
  assert.ok(result.assignments.length > 0, 'Should have at least one assignment');

  // Check for reasonable assignments
  const assignment = result.assignments[0];
  assert.ok(assignment.cabinId, 'Assignment should have a cabinId');
  assert.ok(assignment.areaId, 'Assignment should have an areaId');
  assert.ok(assignment.periodId, 'Assignment should have a periodId');

  console.log('Scheduling algorithm test passed!');
}

runTest().catch(error => {
  console.error('Scheduling algorithm test failed:');
  console.error(error);
  process.exit(1);
});
