import json
import os
from dotenv import load_dotenv
from .scheduler import CampScheduler
from .test_data import get_test_data

def main():
    """
    Main function to run the camp scheduler with test data,
    configured by environment variables.
    """
    # Load environment variables from .env file
    load_dotenv()

    print("Loading test data...")
    config = get_test_data()

    # --- Filter data based on .env configuration ---

    # Filter units
    allowed_units_str = os.getenv("UNITS", "")
    if allowed_units_str:
        allowed_units = set(allowed_units_str.split(','))
        print(f"Filtering for units: {allowed_units}")
        config["cabins"] = [c for c in config["cabins"] if c.unit in allowed_units]

    # Filter activity areas
    allowed_areas_json = os.getenv("ACTIVITY_AREAS", "{}")
    if allowed_areas_json and allowed_areas_json != "{}":
        try:
            allowed_areas_by_dept = json.loads(allowed_areas_json)
            allowed_area_ids = {area_id for dept_areas in allowed_areas_by_dept.values() for area_id in dept_areas}
            print(f"Filtering for activity areas: {allowed_area_ids}")
            config["areas"] = [a for a in config["areas"] if a.id in allowed_area_ids]
        except json.JSONDecodeError:
            print("Warning: Could not parse ACTIVITY_AREAS JSON string. Using all areas.")

    print(f"\nUsing {len(config['cabins'])} cabins and {len(config['areas'])} areas for scheduling.\n")

    print("Initializing CampScheduler...")
    scheduler = CampScheduler(config)

    print("Running scheduler...")
    result = scheduler.schedule()

    if result["success"]:
        print("\n--- Scheduling Successful ---")
        assignments = result["assignments"]
        print(f"Total assignments generated: {len(assignments)}")

        # Pretty print the first 5 assignments
        print("\nSample Assignments (first 5):")
        for i, assignment in enumerate(assignments[:5]):
            print(f"  {i+1}: Day {assignment.day}, Period {assignment.period_id} - Cabin {assignment.cabin_id} -> Area {assignment.area_id}")

        print("\n--- Statistics ---")
        stats = result["statistics"]
        for key, value in stats.items():
            print(f"  {key}: {value}")

        # Export to JSON
        json_output = scheduler.export_schedule("json")
        with open("schedule_output.json", "w") as f:
            f.write(json_output)
        print("\nFull schedule exported to schedule_output.json")

        # Export to CSV
        csv_output = scheduler.export_schedule("csv")
        with open("schedule_output.csv", "w") as f:
            f.write(csv_output)
        print("Full schedule exported to schedule_output.csv")

    else:
        print("\n--- Scheduling Failed ---")
        print(f"Error: {result['error']}")

if __name__ == "__main__":
    main()
