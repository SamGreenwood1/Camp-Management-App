import json
from .scheduler import CampScheduler
from .test_data import get_test_data

def main():
    """
    Main function to run the camp scheduler with test data.
    """
    print("Loading test data...")
    config = get_test_data()

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
