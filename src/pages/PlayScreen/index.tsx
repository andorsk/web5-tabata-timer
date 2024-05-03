"use client";

import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { WorkoutState } from "@/lib/reducers/workout";
import { Step } from "@/models/workout";
import { useRouter } from "next/router";
import { formatDuration } from "@/lib/time";
import { RootState } from "@/lib/reducers";

function StepView() {
  const workoutState = useSelector((state: RootState) => state.workout);
  const [currentStep, setCurrentStep] = useState<Step>();
  const [currentStepIndex, setCurrentStepIndex] = useState<number>();

  const handleClickedStep = (index: number) => {
    if (workoutState.manager?.workout?.steps.length === 0) {
      return;
    }
    workoutState.manager?.setStep(index);
  };

  useEffect(() => {
    setCurrentStepIndex(workoutState?.manager.currentStep);
    setCurrentStep(
      workoutState?.manager.workout?.steps[workoutState?.manager.currentStep],
    );
  }, [workoutState]);

  return (
    <div className="flex-grow overflow-y-auto max-h-1/2">
      <div className="flex flex-col justify-center items-center">
        {workoutState?.manager.workout?.steps.map((step, index) => (
          <button
            key={index}
            onClick={() => handleClickedStep(index)}
            className={`w-full  rounded ${
              index === currentStepIndex
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
                index === currentStepIndex
                  ? "rgba(0, 0, 0, 0.1)"
                  : "transparent", // Semi-transparent overlay
            }}
          >
            {step.name}
          </button>
        ))}
      </div>
    </div>
  );
}

function Footer() {
  const workoutState = useSelector((state: RootState) => state.workout);

  return (
    <div className="flex justify-between items-center p-4 border-2 border-black border-solid">
      <button
        onClick={() => workoutState?.manager.previousStep()}
        className="p-2 rounded text-white"
      >
        ⬅️
      </button>
      <div>
        <span>
          Cycle:{" "}
          {(workoutState?.manager.workout?.steps?.[
            workoutState?.manager?.currentStep
          ]?.cycle || 0) + 1 || 0}
          /{workoutState?.manager?.workout?.routine?.config?.Cycles?.value || 0}
        </span>{" "}
        <br />
        <span>
          Sets:{" "}
          {(workoutState?.manager?.workout?.steps?.[
            workoutState?.manager?.currentStep
          ]?.set || 0) + 1 || 0}
          /{workoutState?.manager?.workout?.routine?.config?.Sets?.value || 0}
        </span>
      </div>
      <button
        onClick={() => workoutState?.manager?.nextStep()}
        className="p-2 rounded text-white"
      >
        ➡️
      </button>
    </div>
  );
}

// @ts-ignore
function Header({ handleToggleWorkout, router }) {
  const [currentStep, setCurrentStep] = useState<Step>();
  const workoutState = useSelector((state: RootState) => state.workout);

  useEffect(() => {
    setCurrentStep(
      workoutState?.manager.workout?.steps[workoutState?.manager.currentStep],
    );
  }, [workoutState]);

  return (
    <div className={`flex flex-col w-full`}>
      <div className="flex justify-between items-center p-4">
        <div className="flex">
          <button
            className="p-2 text-4xl rounded"
            onClick={handleToggleWorkout}
          >
            {workoutState?.manager.timer?.isPlaying ? "⏸️" : "▶️"}
          </button>
          <button
            className="p-2 text-4xl rounded"
            onClick={() => router.push("/")}
          >
            🏠
          </button>
        </div>
        <div className="p-4 text-center font-bold text-2xl">
          {workoutState?.manager.timeLeft !== undefined
            ? formatDuration(
                Math.floor(workoutState.manager.timeLeft / 1000 ?? 0),
              )
            : "00:00"}
        </div>
      </div>
      <div className="text-center">
        <h1 className="text-3xl font-bold">{currentStep?.name}</h1>
        <h1 className="text-4xl pb-10 font-bold">
          {Math.floor(
            (workoutState?.manager.timer?.remainingTime ?? 0) / 1000,
          ).toString()}
        </h1>
      </div>
    </div>
  );
}

export default function PlayScreen() {
  const web5state = useSelector((state: RootState) => state.web5);
  const authState = useSelector((state: RootState) => state.auth);
  const workoutState = useSelector((state: RootState) => state.workout);
  const router = useRouter();
  const dispatch = useDispatch();
  const [currentStep, setCurrentStep] = useState<Step>();

  useEffect(() => {
    setCurrentStep(
      workoutState?.manager.workout?.steps[workoutState?.manager.currentStep],
    );
  }, [workoutState]);

  const toggleWorkout = () => {
    if (!workoutState.manager.started) {
      console.log("starting workout");
      workoutState.manager.startWorkout();
    } else {
      console.log("toggling workout");
      workoutState.manager.toggleWorkout();
    }
  };

  return (
    <div>
      {!workoutState.manager.ready ? (
        <div className="p-4">Not ready set</div>
      ) : (
        <div
          className={`play-container ${currentStep?.color || "bg-blue-500"}`}
        >
          <Header router={router} handleToggleWorkout={toggleWorkout} />
          <StepView />
          <Footer />
        </div>
      )}
    </div>
  );
}