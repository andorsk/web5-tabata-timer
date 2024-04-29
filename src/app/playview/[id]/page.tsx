"use client";

import type { NextPage } from "next";
import React, { useState, useEffect } from "react";
import { getRoutine } from "@/lib/store/dwn/routines";
import SaveWorkoutModal from "@/components/play/SaveWorkout";

import { useRouter } from "next/navigation";
import { useWeb5 } from "@/context/Web5Context";
import { Web5 } from "@web5/api";
import { useTimer } from "@/context/TimerContext";

import { RoutineConfiguration } from "@/models/workout";

type CurrentRoutineState = {
  currentStepIndex: number;
  currentStepName: string;
  currentTimeLeft: string;
  currentTimeLeftInStep: string;
};

type Step = {
  name: string;
  duration: number;
  color: string;
  cycle: number;
  set: number;
  totalSets: number;
};

const createSteps = (config: RoutineConfiguration): Step[] => {
  const steps = [
    {
      name: config.Prepare.name,
      duration: config.Prepare.duration,
      color: "bg-yellow-500",
      cycle: 0,
      set: 0,
    } as Step,
  ];

  for (let i = 0; i < config.Cycles.value; i++) {
    for (let j = 0; j < config.Sets.value; j++) {
      steps.push({
        name: config.Work.name,
        duration: config.Work.duration,
        color: "bg-red-500",
        cycle: i,
        set: j,
        totalSets: config.Sets.value,
      });
      if (j <= config.Cycles.value - 1) {
        steps.push({
          name: config.Rest.name,
          duration: config.Rest.duration,
          color: "bg-green-500",
          cycle: i,
          set: j,
          totalSets: config.Sets.value,
        });
      }
    }
    steps.push({
      name: config.RestBetweenSteps.name,
      duration: config.RestBetweenSteps.duration,
      color: "bg-green-200",
      cycle: i,
      totalSets: config.Sets.value,
      set: 0,
    });
  }
  steps.push({
    name: config.CoolDown.name,
    duration: config.CoolDown.duration,
    color: "bg-blue-500",
    cycle: 0,
    totalSets: 1,
    set: 0,
  });

  return steps;
};

const formatDuration = (seconds: number) => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;

  const formattedHours = String(hours).padStart(2, "0");
  const formattedMinutes = String(minutes).padStart(2, "0");
  const formattedSeconds = String(remainingSeconds).padStart(2, "0");

  return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
};

const computeTotalTimeFromSteps = (steps: Step[]): number => {
  const totalTime = steps.reduce((total, step) => {
    return total + step.duration;
  }, 0);
  return totalTime;
};

export default function PlayView({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { web5, did } = useWeb5();
  //@ts-ignore
  const {
    stepTime,
    totalTime,
    timeLeft,
    startTimers,
    startStepTimer,
    setTimeElapsed,
    setTotalTime,
    setIsPaused,
  } = useTimer();
  const [routine, setRoutine] = useState({});
  const [steps, setSteps] = useState<Step[]>([]);

  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isDone, setIsDone] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [timeInStep, setTimeInStep] = useState(stepTime);
  const [metadata, setMetadata] = useState({
    currentSet: 0,
    currentCycle: 0,
    totalSets: 0,
  });

  const routineId = params.id;
  const totalCycles = 3;
  const currentCycle = 1;

  useEffect(() => {
    console.log("setting to ", !isPlaying);
    setIsPaused(!isPlaying);
  }, [isPlaying]);

  const computeTimeElapsed = (steps: Step[]): number => {
    const time = steps.reduce((total, step) => {
      return total + step.duration;
    }, 0);
    return time + timeInStep;
  };

  const handleSaveWorkout = (workoutName: string) => {
    // Save the workout to localStorage
    localStorage.setItem("workoutName", workoutName);
  };

  const fetchRoutine = async (routineId: string, web5: Web5) => {
    if (routineId) {
      try {
        const t = await getRoutine(routineId, web5);
        setRoutine(t);
        const steps = createSteps(t.routine);
        //@ts-ignore
        setSteps(steps);
        const time = computeTotalTimeFromSteps(steps);
        setTotalTime(time);
        startTimers(time);
        startStepTimer(steps[0].duration);
      } catch (error) {
        console.error(error);
      }
    }
  };

  const getCurrentSet = () => {
    if (steps.length > 0) {
      return {
        // @ts-ignore
        set: steps[currentStep].set,
        // @ts-ignore
        totalSets: steps[currentStep].totalSets,
      };
    }
    return { set: 0, totalSets: 0 };
  };

  const getCurrentCycle = () => {
    if (steps.length > 0) {
      //@ts-ignore
      return steps[currentStep].cycle;
    }
    return 0;
  };

  useEffect(() => {
    const { set, totalSets } = getCurrentSet();
    const cycle = getCurrentCycle();
    setMetadata({
      currentSet: set,
      currentCycle: cycle,
      // @ts-ignore
      totalSets: totalSets,
    });
  }, [currentStep, steps]);

  const getCurrentStepColor = () => {
    if (steps.length > 0) {
      // @ts-ignore
      return steps[currentStep].color;
    } else {
      return "";
    }
  };

  useEffect(() => {
    if (web5 && routineId) {
      fetchRoutine(routineId, web5);
    }
  }, [routineId, web5]);

  const handleClickedStep = (index: number) => {
    if (steps.length === 0) {
      return;
    }
    setCurrentStep(index);
    // @ts-ignore
    startStepTimer(steps[index].duration);
  };

  useEffect(() => {
    const elapsedTime = computeTimeElapsed(steps.slice(0, currentStep + 1));
    setTimeElapsed(elapsedTime);
  });

  const incrementCurrentStep = () => {
    if (currentStep === steps.length - 1) {
      setIsDone(true);
    } else {
      handleClickedStep(currentStep + 1);
    }
  };
  useEffect(() => {
    if (stepTime === 0) {
      incrementCurrentStep();
    }
  }, [stepTime]);

  return (
    <div className="flex flex-col w-full h-screen ">
      <SaveWorkoutModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveWorkout}
      />
      <div className="flex justify-between items-center p-4">
        <div className="flex">
          <button
            className="p-2 rounded bg-blue-500 text-white"
            onClick={() => setIsPlaying(!isPlaying)}
          >
            {isPlaying ? "Pause" : "Play"}
          </button>
          <button
            className="p-2 rounded bg-blue-500 text-white"
            onClick={() => router.push("/")}
          >
            Home
          </button>
        </div>
        <div className="p-4 text-center font-bold text-2xl">
          Total Time Left: {formatDuration(timeLeft)}{" "}
        </div>
      </div>
      <div className="text-center">
        <h1 className={`text-4xl p-12 ${getCurrentStepColor()} font-bold`}>
          {stepTime}
        </h1>
      </div>
      <div className="flex-grow grid grid-cols-1 gap-1 p-4">
        {steps.map((step, index) => (
          <button
            key={index}
            onClick={() => handleClickedStep(index)}
            className={`p-2 text-center w-full rounded ${
              index === currentStep
                ? "bg-blue-500 p-5 text-white"
                : "bg-gray-200"
            }`}
          >
            {step.name}
          </button>
        ))}
      </div>
      <div className="flex justify-between items-center p-4 bg-gray-100">
        <button className="p-2 rounded bg-blue-500 text-white">⬅️</button>
        <div>
          <span>
            Cycle: {metadata.currentCycle}/{totalCycles}
          </span>{" "}
          <br />
          <span>
            Step: {metadata.currentSet}/{metadata.totalSets}
          </span>
        </div>
        <button className="p-2 rounded bg-blue-500 text-white">➡️</button>
      </div>
      <button
        className="p-2 rounded bg-blue-500 text-white"
        onClick={() => setIsModalOpen(true)}
      >
        Save Workout
      </button>
      )
    </div>
  );
}
