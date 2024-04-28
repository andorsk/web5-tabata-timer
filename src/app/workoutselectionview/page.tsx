// pages/workouts.tsx
import type { NextPage } from "next";
import RoutineCard from "@/components/RoutineCard"; // Make sure the path is correct
import { Routine } from "@/models/workout";

const mockRoutines: Routine[] = [
  {
    name: "Morning Boost",
    title: "Quick Morning Routine",
    description: "A quick, energetic start to your morning.",
    lastUpdated: new Date().toISOString(),
    createdOn: new Date().toISOString(),
    createdBy: "user123",
    id: "routine1",
    routine: {
      Prepare: { duration: 60, name: "Preparation", value: 60 },
      Work: { duration: 30, name: "Work", value: 30 },
      Rest: { duration: 10, name: "Rest", value: 10 },
      Cycles: { value: 3, name: "Cycles" },
      Sets: { value: 2, name: "Sets" },
      RestBetweenSteps: {
        duration: 30,
        name: "Rest Between Cycles",
        value: 30,
      },
      CoolDown: { duration: 60, name: "Cool Down", value: 60 },
    },
  },
  {
    name: "Morning Boost",
    title: "Quick Morning Routine",
    description: "A quick, energetic start to your morning.",
    lastUpdated: new Date().toISOString(),
    createdOn: new Date().toISOString(),
    createdBy: "user123",
    id: "routine1",
    routine: {
      Prepare: { duration: 60, name: "Preparation", value: 60 },
      Work: { duration: 30, name: "Work", value: 30 },
      Rest: { duration: 10, name: "Rest", value: 10 },
      Cycles: { value: 3, name: "Cycles" },
      Sets: { value: 2, name: "Sets" },
      RestBetweenSteps: {
        duration: 30,
        name: "Rest Between Cycles",
        value: 30,
      },
      CoolDown: { duration: 60, name: "Cool Down", value: 60 },
    },
  },
  {
    name: "Morning Boost",
    title: "Quick Morning Routine",
    description: "A quick, energetic start to your morning.",
    lastUpdated: new Date().toISOString(),
    createdOn: new Date().toISOString(),
    createdBy: "user123",
    id: "routine1",
    routine: {
      Prepare: { duration: 60, name: "Preparation", value: 60 },
      Work: { duration: 30, name: "Work", value: 30 },
      Rest: { duration: 10, name: "Rest", value: 10 },
      Cycles: { value: 3, name: "Cycles" },
      Sets: { value: 2, name: "Sets" },
      RestBetweenSteps: {
        duration: 30,
        name: "Rest Between Cycles",
        value: 30,
      },
      CoolDown: { duration: 60, name: "Cool Down", value: 60 },
    },
  },

  // Add more routines as needed
];

const WorkoutSelectionView: NextPage = () => {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold text-gray-800 mb-4">Workouts</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4">
        {mockRoutines.map((routine) => (
          <RoutineCard key={routine.id} routine={routine} />
        ))}
      </div>
    </div>
  );
};

export default WorkoutSelectionView;
