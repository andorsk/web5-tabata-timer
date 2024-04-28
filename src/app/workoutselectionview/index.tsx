// pages/workouts.tsx
"use client";
import RoutineCard from "@/components/RoutineCard"; // Make sure the path is correct
import { Routine } from "@/models/workout";
import { storeRoutine, getRoutines } from "@/lib/store/dwn/routines";
import { useWeb5 } from "@/context/Web5Context";
import { useState, useEffect } from "react";

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
];

export default function WorkoutSelectionView() {
  const { web5, did } = useWeb5();
  const [routines, setRoutines] = useState([]);

  const handleAddWorkout = async () => {
    console.log("handling workout");
    storeRoutine(mockRoutines[0], web5);
  };

  const handleGetRoutines = async (web5) => {
    try {
      const r = await getRoutines(web5);
      const routinesData = await Promise.all(
        r?.records?.map(async (v, _) => {
          console.log(v);
          const vv = await v.data.json();
          vv.id = v.id;
          return vv; // Return vv to include it in the array of routinesData
        }),
      );
      setRoutines(routinesData); // Update state with the fetched routinesData
      console.log(routinesData);
    } catch (error) {
      console.error("Error fetching routines:", error);
    }
  };

  useEffect(() => {
    if (web5) {
      handleGetRoutines(web5);
    }
  }, [web5]);

  return (
    <div className="p-4">
      DID: {did}
      <h1 className="text-2xl font-bold text-gray-800 mb-4">Web5 Workouts</h1>
      <button onClick={handleAddWorkout}> Add Workout </button>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4">
        {routines.map((routine) => (
          <RoutineCard key={routine.id} routine={routine} />
        ))}
      </div>
    </div>
  );
}
