import time
import json
from typing import List, Dict, Any, Optional

from .models import Assignment, Cabin, Period, ActivityArea
from .hard_constraints import check_hard_constraints, is_double_booking_allowed
from .soft_constraints import rank_candidate_areas, apply_cabin_merging
from .utils import get_candidate_areas, get_area_utilization

class CampScheduler:
    """Main scheduler class for camp activity assignments."""

    def __init__(self, config: Dict[str, Any]):
        self.config = config
        self.assignments: List[Assignment] = []
        self.cabin_history: Dict[str, List[Assignment]] = {}
        self.area_utilization: Dict[str, int] = {}
        self.day_assignments: Dict[int, List[Assignment]] = {}
        self.scheduling_stats = {
            "total_assignments": 0,
            "failed_assignments": 0,
            "constraint_violations": 0,
            "start_time": None,
            "end_time": None,
        }

    def schedule(self) -> Dict[str, Any]:
        """Main scheduling method - orchestrates the entire scheduling process."""
        print("Starting camp scheduling...")
        self.scheduling_stats["start_time"] = time.time()

        try:
            processed_cabins = apply_cabin_merging(self.config.get("cabins", []), self.config)
            self.config["cabins"] = processed_cabins

            self.process_manual_overrides()
            self.process_choice_periods()
            self.run_scheduling_loop(self.config.get("cabins", []))
            self.validate_final_schedule()

            self.scheduling_stats["end_time"] = time.time()
            self.scheduling_stats["total_assignments"] = len(self.assignments)

            print(f"Scheduling completed. Total assignments: {len(self.assignments)}")

            return {
                "assignments": self.assignments,
                "statistics": self.get_statistics(),
                "success": True,
            }
        except Exception as e:
            print(f"Scheduling failed: {e}")
            self.scheduling_stats["end_time"] = time.time()
            return {
                "assignments": self.assignments,
                "statistics": self.get_statistics(),
                "success": False,
                "error": str(e),
            }

    def process_manual_overrides(self):
        """Process manual overrides from configuration, respecting filtered data."""
        manual_overrides = self.config.get("manualOverrides", [])
        processed_count = 0

        allowed_cabin_ids = {c.id for c in self.config.get("cabins", [])}
        allowed_area_ids = {a.id for a in self.config.get("areas", [])}

        for override in manual_overrides:
            cabin_id = override["cabinId"]
            area_id = override["areaId"]

            if cabin_id in allowed_cabin_ids and area_id in allowed_area_ids:
                assignment = Assignment(
                    cabin_id=cabin_id,
                    area_id=area_id,
                    period_id=override["periodId"],
                    day=override["day"],
                    is_manual_override=True,
                )
                self.assignments.append(assignment)
                self.update_scheduling_state(assignment)
                processed_count += 1
            else:
                print(f"Warning: Skipping manual override for cabin '{cabin_id}' or area '{area_id}' as it's not in the filtered dataset.")

        print(f"Processed {processed_count} manual overrides")

    def process_choice_periods(self):
        """Process choice periods from configuration, respecting filtered data."""
        choice_periods = self.config.get("choicePeriods", [])
        processed_count = 0

        allowed_cabin_ids = {c.id for c in self.config.get("cabins", [])}
        allowed_area_ids = {a.id for a in self.config.get("areas", [])}

        for choice in choice_periods:
            cabin_id = choice["cabinId"]
            area_id = choice["areaId"]

            if cabin_id in allowed_cabin_ids and area_id in allowed_area_ids:
                assignment = Assignment(
                    cabin_id=cabin_id,
                    area_id=area_id,
                    period_id=choice["periodId"],
                    day=choice["day"],
                    is_choice_period=True,
                )
                self.assignments.append(assignment)
                self.update_scheduling_state(assignment)
                processed_count += 1
            else:
                print(f"Warning: Skipping choice period for cabin '{cabin_id}' or area '{area_id}' as it's not in the filtered dataset.")

        print(f"Processed {processed_count} choice periods")

    def run_scheduling_loop(self, cabins: List[Cabin]):
        """Main scheduling loop - assigns cabins to areas for each period."""
        sorted_periods = self.sort_periods_chronologically()

        for period in sorted_periods:
            print(f"Scheduling period: {period.name} (Day {period.day})")

            if self.is_period_fully_assigned(period):
                print(f"Period {period.name} already fully assigned, skipping")
                continue

            available_cabins = self.get_available_cabins_for_period(cabins, period)
            prioritized_cabins = self.sort_cabins_by_priority(available_cabins)

            for cabin in prioritized_cabins:
                assignment = self.assign_cabin_to_area(cabin, period)
                if assignment:
                    self.assignments.append(assignment)
                    self.update_scheduling_state(assignment)
                    print(f"Assigned {cabin.name} to {assignment.area_id} for {period.name}")
                else:
                    self.scheduling_stats["failed_assignments"] += 1
                    print(f"Warning: Failed to assign {cabin.name} for {period.name}")

    def sort_periods_chronologically(self) -> List[Period]:
        """Sort periods chronologically by day and start time."""
        return sorted(self.config.get("periods", []), key=lambda p: (p.day, p.start_time))

    def is_period_fully_assigned(self, period: Period) -> bool:
        """Check if a period is already fully assigned."""
        assigned_cabins_count = sum(1 for a in self.assignments if a.day == period.day and a.period_id == period.id)
        return assigned_cabins_count >= len(self.config.get("cabins", []))

    def get_available_cabins_for_period(self, cabins: List[Cabin], period: Period) -> List[Cabin]:
        """Get available cabins for a specific period."""
        available = []
        for cabin in cabins:
            is_assigned = any(a.cabin_id == cabin.id and a.day == period.day and a.period_id == period.id for a in self.assignments)
            is_blacked_out = self.is_cabin_blacked_out(cabin, period)
            if not is_assigned and not is_blacked_out:
                available.append(cabin)
        return available

    def is_cabin_blacked_out(self, cabin: Cabin, period: Period) -> bool:
        """Check if a cabin is blacked out during a period."""
        blackout_periods = self.config.get("blackoutPeriods", [])
        return any(b["cabinId"] == cabin.id and b["periodId"] == period.id and b["day"] == period.day for b in blackout_periods)

    def sort_cabins_by_priority(self, cabins: List[Cabin]) -> List[Cabin]:
        """Sort cabins by priority for fair assignment."""
        return sorted(cabins, key=lambda c: (c.priority, -c.size), reverse=True)

    def assign_cabin_to_area(self, cabin: Cabin, period: Period) -> Optional[Assignment]:
        """Assign a cabin to an area during a specific period."""
        candidate_areas = get_candidate_areas(
            cabin, self.config.get("areas", []), self.config.get("periods", []), period.day, period.id
        )
        if not candidate_areas:
            print(f"Warning: No candidate areas available for {cabin.name} during {period.name}")
            return None

        # Apply hard constraints
        valid_areas = []
        for area in candidate_areas:
            is_valid, reason = check_hard_constraints(cabin, area, period, self.assignments, self.config, self.config.get("periods", []))
            if is_valid:
                valid_areas.append(area)

        if not valid_areas:
            print(f"Warning: No areas satisfy hard constraints for {cabin.name} during {period.name}")
            self.scheduling_stats["constraint_violations"] += 1
            return None

        # Rank candidate areas
        ranked_areas = rank_candidate_areas(valid_areas, cabin, period, self.assignments, self.config, self.config.get("periods", []))

        # Try to assign to the best area
        for area in ranked_areas:
            if self.can_assign_cabin_to_area(cabin, area, period):
                return Assignment(cabin_id=cabin.id, area_id=area.id, period_id=period.id, day=period.day)

        # Try double booking if allowed
        for area in ranked_areas:
            if is_double_booking_allowed(area):
                if self.can_assign_cabin_to_area(cabin, area, period, allow_double_booking=True):
                    return Assignment(
                        cabin_id=cabin.id, area_id=area.id, period_id=period.id, day=period.day, is_double_booked=True
                    )
        return None

    def can_assign_cabin_to_area(self, cabin: Cabin, area: ActivityArea, period: Period, allow_double_booking: bool = False) -> bool:
        """Check if a cabin can be assigned to an area."""
        current_utilization = get_area_utilization(area.id, self.assignments, period.day, period.id)
        if allow_double_booking:
            return current_utilization < area.max_capacity * 1.5
        else:
            return current_utilization < area.max_capacity

    def update_scheduling_state(self, assignment: Assignment):
        """Update internal scheduling state after an assignment."""
        self.cabin_history.setdefault(assignment.cabin_id, []).append(assignment)
        key = f"{assignment.area_id}_{assignment.day}_{assignment.period_id}"
        self.area_utilization[key] = self.area_utilization.get(key, 0) + 1
        self.day_assignments.setdefault(assignment.day, []).append(assignment)

    def validate_final_schedule(self):
        """Validate the final schedule for consistency."""
        print("Validating final schedule...")
        violations = 0

        # Check for double assignments
        assignment_keys = set()
        for assignment in self.assignments:
            key = (assignment.cabin_id, assignment.day, assignment.period_id)
            if key in assignment_keys:
                print(f"Error: Double assignment detected for cabin {assignment.cabin_id} on day {assignment.day}, period {assignment.period_id}")
                violations += 1
            assignment_keys.add(key)

        # Check area capacity violations
        for area in self.config.get("areas", []):
            for period in self.config.get("periods", []):
                utilization = get_area_utilization(area.id, self.assignments, period.day, period.id)
                if utilization > area.max_capacity:
                    print(f"Error: Area {area.name} over capacity: {utilization}/{area.max_capacity} on day {period.day}, period {period.id}")
                    violations += 1

        if violations > 0:
            print(f"Warning: Schedule validation found {violations} violations")
        else:
            print("Schedule validation passed")

    def get_statistics(self) -> Dict[str, Any]:
        """Get scheduling statistics."""
        stats = self.scheduling_stats.copy()
        start = stats.get("start_time")
        end = stats.get("end_time")
        if start and end:
            stats["duration"] = end - start

        total = stats.get("total_assignments", 0)
        failed = stats.get("failed_assignments", 0)
        if total > 0:
            stats["success_rate"] = (total - failed) / total
        else:
            stats["success_rate"] = 0

        return stats

    def export_schedule(self, format: str = "json") -> str:
        """Export schedule to various formats."""
        if format == "json":
            return json.dumps([a.__dict__ for a in self.assignments], indent=2)
        elif format == "csv":
            return self.export_to_csv()
        else:
            raise ValueError(f"Unsupported export format: {format}")

    def export_to_csv(self) -> str:
        """Export schedule to CSV format."""
        lines = ["Day,Period,Cabin,Area,Type"]
        for a in self.assignments:
            type_str = "Manual" if a.is_manual_override else "Choice" if a.is_choice_period else "Auto"
            lines.append(f"{a.day},{a.period_id},{a.cabin_id},{a.area_id},{type_str}")
        return "\n".join(lines)
