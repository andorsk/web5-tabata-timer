"use client";

import { useRouter } from "next/navigation";
import React, { useState, useEffect, useRef } from "react";
import { useWeb5 } from "@/context/Web5Context";
import { getRoutine } from "@/lib/store/dwn/routines";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/lib/reducers";
import { setWorkout, startWorkout, pauseWorkout } from "@/lib/actions/workout"; // Import the setWorkout action creator
import { formatDuration } from "@/lib/time";
import { initWeb5, Web5State } from "@/lib/actions/web5";

import {
  incrementCounter,
  decrementCounter,
  setCounter,
} from "@/lib/reducers/counter";
import { WorkoutManagerSingleton } from "@/components/workout";

export default function PlayView({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [isPlaying, setIsPlaying] = useState(true);
  const [steps, setSteps] = useState(true);
  const [currentColor, setCurrentColor] = useState("bg-blue-500");

  const dispatch = useDispatch();
  const selectWorkoutSession = (state: RootState) => state.workout;
  const selectWeb5 = (state: RootState) => state.web5;

  const workoutSession = useSelector(selectWorkoutSession);
  const web5state = useSelector(selectWeb5);

  const handleToggleWorkout = () => {
    workoutSession.manager.toggleWorkout();
  };

  const handleClickedStep = (index: number) => {
    if (workoutSession.manager?.workout?.steps.length === 0) {
      return;
    }
    workoutSession.manager?.setStep(index);
  };

  useEffect(() => {
    if (web5state.loaded && params.id && !workoutSession.set) {
      const loadWorkout = async () => {
        console.log("loading workout");
        if (!web5state.web5) {
          return;
        }
        await workoutSession.manager.setWorkout({
          id: params.id,
          web5: web5state.web5,
          dispatch: dispatch,
        });
      };
      loadWorkout();
    }
  }, [dispatch, web5state, params.id]);

  useEffect(() => {
    if (workoutManager.manager.set) {
      workoutManager.manager.startWorkout(dispatch);
    }

    setCurrentColor(
      workoutSession?.manager.workout?.steps[
        workoutSession?.manager.currentStep
      ]?.color || "bg-blue-500", // Provide a default value
    );
  }, [workoutSession]);

  return (
    <div className={`flex flex-col w-full h-screen ${currentColor}`}>
      <div className="flex justify-between items-center p-4">
        <div className="flex">
          <button
            className="p-2 text-4xl rounded "
            onClick={() => handleToggleWorkout()}
          >
            {workoutSession.manager.timer?.isPlaying ? "⏸️" : "▶️"}
          </button>
          <button
            className="p-2 text-4xl rounded "
            onClick={() => router.push("/")}
          >
            🏠
          </button>
        </div>
        <div className="p-4 text-center font-bold text-2xl">
          {workoutSession?.manager.timeLeft !== undefined
            ? formatDuration(
                Math.floor(workoutSession.manager.timeLeft / 1000 ?? 0),
              )
            : "00:00"}
        </div>
      </div>
      <div className="text-center">
        <h1 className={`text-3xl  font-bold`}>
          {
            workoutSession?.manager.workout?.steps[
              workoutSession?.manager.currentStep
            ]?.name
          }
        </h1>
        <h1 className={`text-4xl pb-10 font-bold`}>
          {Math.floor(
            (workoutSession?.manager.timer?.remainingTime ?? 0) / 1000,
          ).toString()}
        </h1>
      </div>
      <div className="flex-grow overflow-y-auto">
        <div className="flex flex-col justify-center items-center">
          {workoutSession?.manager.workout?.steps.map((step, index) => (
            <button
              key={index}
              onClick={() => handleClickedStep(index)}
              className={`w-full  rounded ${
                index === workoutSession.manager.currentStep
                  ? "bg-blue-500 text-white p-5"
                  : "bg-transparent"
              }`}
              style={{
                minHeight: "40px", // Set a fixed height for each button
                marginBottom: "0px", // Add some space between buttons
                outline: "none", // Remove default outline on focus
                border: "1px solid black", // Add border around each button
                boxShadow: `0 2px 4px rgba(0, 0, 0, 0.1), 0 4px 8px rgba(0, 0, 0, 0.1)`, // Add box shadow for depth
                background:
                  index === workoutSession.manager.currentStep
                    ? "rgba(0, 0, 0, 0.1)"
                    : "transparent", // Semi-transparent overlay
              }}
            >
              {step.name}
            </button>
          ))}
        </div>
      </div>
      <div className="flex justify-between items-center p-4 border-2 border-black border-solid">
        <button
          onClick={() => workoutSession?.manager.previousStep()}
          className="p-2 rounded text-white"
        >
          ⬅️
        </button>
        <div>
          <span>
            Cycle:{" "}
            {(workoutSession?.manager.workout?.steps?.[
              workoutSession?.manager?.currentStep
            ]?.cycle || 0) + 1 || 0}
            /
            {workoutSession?.manager?.workout?.routine?.routine?.Cycles
              ?.value || 0}
          </span>{" "}
          <br />
          <span>
            Sets:{" "}
            {(workoutSession?.manager?.workout?.steps?.[
              workoutSession?.manager?.currentStep
            ]?.set || 0) + 1 || 0}
            /
            {workoutSession?.manager?.workout?.routine?.routine?.Sets?.value ||
              0}
          </span>
        </div>
        <button
          onClick={() => workoutSession?.manager?.nextStep()}
          className="p-2 rounded text-white"
        >
          ➡️
        </button>
      </div>
    </div>
  );
}
