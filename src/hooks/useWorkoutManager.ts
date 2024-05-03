import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { WorkoutManager } from "@/components/workout/WorkoutManager";

export function useWorkoutManager() {
  const dispatch = useDispatch();

  useEffect(() => {}, [dispatch]);

  return new WorkoutManager(dispatch);
}
