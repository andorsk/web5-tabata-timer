"use client";

import { useRouter } from "next/navigation";
import React, { useState, useEffect, useRef } from "react";
import { useWeb5 } from "@/context/Web5Context";
import { getRoutine } from "@/lib/store/dwn/routines";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/lib/reducers";
import { setWorkout, startWorkout, pauseWorkout } from "@/lib/actions/workout"; // Import the setWorkout action creator
import {
  incrementCounter,
  decrementCounter,
  setCounter,
} from "@/lib/reducers/counter";
import { WorkoutManagerSingleton } from "@/components/workout";

export default function PlayView({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { web5, did } = useWeb5();
  const [isPlaying, setIsPlaying] = useState(true);
  const selectWorkoutSession = (state: RootState) => state.workout;
  const dispatch = useDispatch();
  const workoutSession = useSelector(selectWorkoutSession);

  // TODO: remove
  const counter = useSelector((state) => state.counter);

  useEffect(() => {
    const workoutManager = WorkoutManagerSingleton.getInstance();
    workoutManager.setDispatcher(dispatch);
  }, [dispatch]);

  const handleToggleWorkout = () => {
    const workoutManager = WorkoutManagerSingleton.getInstance();
    workoutManager.manager.toggleWorkout();
  };

  useEffect(() => {
    const fetchRoutine = async () => {
      if (web5 && params.id) {
        try {
          const r = await getRoutine(params.id, web5);
          dispatch(setWorkout(r)); // Pass the routine object to setWorkout action
          console.log("STARTING WORK");
          dispatch(startWorkout());
        } catch (error) {
          console.error("Error fetching routine:", error);
        }
      }
    };
    fetchRoutine();
  }, [web5, params]);

  const getCurrentStepColor = () => {
    return "bg-blue-500";
  };

  const handleSetCounter = (e) => {
    const value = parseInt(e.target.value);
    dispatch(setCounter(value));
  };

  return (
    <div className={`flex flex-col w-full h-screen ${getCurrentStepColor()}`}>
      Name: {workoutSession.manager?.workout?.name}
      <br />
      Remaining Time: {workoutSession.manager.timer?.remainingTime}
      <br />
      CurrentStep: {JSON.stringify(workoutSession.manager.currentStep)}
      <br />
      Total Time: {JSON.stringify(workoutSession.manager.workout?.totalTime)}
      <br />
      Total Time Left: {JSON.stringify(workoutSession.manager?.timeLeft)}
      <br />
      Is Completed: {JSON.stringify(workoutSession.manager?.isCompleted)}
      <br />
      Is Playing: {JSON.stringify(workoutSession.timer)}
      <br />
      Current Step:{" "}
      {JSON.stringify(
        workoutSession.manager?.workout?.steps[
          workoutSession.manager.currentStep
        ],
      )}
      <div className="flex justify-between items-center p-4">
        <div className="flex">
          <button
            className="p-2 rounded bg-blue-500 text-white"
            onClick={() => handleToggleWorkout()}
          >
            {isPlaying ? "Pause" : "Play"}
          </button>
        </div>
      </div>
    </div>
  );
}
