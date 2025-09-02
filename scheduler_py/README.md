# Camp Scheduling Algorithm (Python)

This directory contains a Python implementation of the camp scheduling algorithm, translated from the original JavaScript version. This version is completely independent of the web application and can be run from the command line.

## Overview

The scheduler takes a configuration object as input, which includes lists of cabins, activity areas, and periods, as well as other settings. It then uses a constraint-based approach to generate a schedule that assigns each cabin to an activity area for each period.

The main components are:
- `models.py`: Defines the data structures used by the scheduler.
- `utils.py`: Contains helper functions for the scheduling logic.
- `hard_constraints.py`: Defines the hard rules that cannot be violated.
- `soft_constraints.py`: Defines the soft rules used to rank valid assignments.
- `scheduler.py`: Contains the main `CampScheduler` class that orchestrates the scheduling process.
- `test_data.py`: Provides sample data for testing.
- `run_scheduler.py`: An example script that runs the scheduler with the test data.

## Installation

This project has a dependency for handling `.env` files. To install it, run the following command from the root of the repository:

```bash
pip install -r scheduler_py/requirements.txt
```

## Configuration

The scheduler can be configured using a `.env` file in the root of the repository. This file is used to filter the test data to run the scheduler with a specific subset of units and activity areas.

Create a `.env` file and add the following variables:

- `UNITS`: A comma-separated list of unit names to include in the schedule.
  Example: `UNITS=U1,U2`

- `ACTIVITY_AREAS`: A JSON string representing the departments and activity areas to include. The top-level keys are the department/category, and the values are lists of area IDs.
  Example: `ACTIVITY_AREAS='{"Sports": ["area-field", "area-archery"], "Adventure": ["area-ropes"]}'`

If these variables are not present in the `.env` file, the scheduler will run with all the data from `test_data.py`.

## How to Run

To run the scheduler, navigate to the root of the repository and execute the `run_scheduler.py` script:

```bash
python -m scheduler_py.run_scheduler
```

This will run the scheduler with the sample data defined in `test_data.py`, filtered by the configuration in your `.env` file.

## Output

The `run_scheduler.py` script will produce the following output:
- **Console Output**: A summary of the scheduling process, including the total number of assignments and statistics.
- `schedule_output.json`: A JSON file containing the full list of generated assignments.
- `schedule_output.csv`: A CSV file containing the same assignment data in a tabular format.

This implementation allows for easy testing and development of the scheduling algorithm, completely decoupled from the UI.
