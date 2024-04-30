"use client";

import type { NextPage } from "next";
import React, { useState, useEffect, useRef } from "react";
import { getRoutine } from "@/lib/store/dwn/routines";
import SaveWorkoutModal from "@/components/play/SaveWorkout";

import { useRouter } from "next/navigation";
import { useWeb5 } from "@/context/Web5Context";
import { Web5 } from "@web5/api";
import { useTimer } from "@/context/TimerContext";

import { RoutineConfiguration, Routine } from "@/models/workout";
import SoundPlayer from "@/components/sound/SoundLibrary";

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
  totalSets?: number;
  totalCycles?: number;
};

const createSteps = (config: RoutineConfiguration): Step[] => {
  const steps = [
    {
      name: config.Prepare.name,
      duration: config.Prepare.duration,
      color: "bg-yellow-500",
      cycle: 0,
      set: 0,
      totalCycles: config.Cycles.value,
    } as Step,
  ];

  for (let j = 0; j < config.Sets.value; j++) {
    for (let i = 0; i < config.Cycles.value; i++) {
      steps.push({
        name: config.Work.name,
        duration: config.Work.duration,
        color: "bg-red-500",
        cycle: j,
        set: i,
        totalSets: config.Sets.value,
        totalCycles: config.Cycles.value,
      });
      if (j <= config.Cycles.value - 1) {
        steps.push({
          name: config.Rest.name,
          duration: config.Rest.duration,
          color: "bg-green-500",
          cycle: j,
          set: i,
          totalSets: config.Sets.value,
          totalCycles: config.Cycles.value,
        });
      }
    }
    steps.push({
      name: config.RestBetweenSteps.name,
      duration: config.RestBetweenSteps.duration,
      color: "bg-green-200",
      cycle: 0,
      totalSets: config.Sets.value,
      totalCycles: config.Cycles.value,
      set: j,
    });
  }

  steps.push({
    name: config.CoolDown.name,
    duration: config.CoolDown.duration,
    color: "bg-blue-500",
    cycle: 0,
    totalSets: 1,
    totalCycles: config.Cycles.value,
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
  const [routine, setRoutine] = useState<Routine | null>(null);
  const [steps, setSteps] = useState<Step[]>([]);

  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isDone, setIsDone] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const soundPlayerRef = useRef<any>(null);

  const [timeInStep, setTimeInStep] = useState(stepTime);
  const [metadata, setMetadata] = useState({
    currentSet: 0,
    currentCycle: 0,
    totalSets: 0,
    totalCycles: 0,
  });

  const routineId = params.id;
  const currentCycle = 1;

  useEffect(() => {
    console.log("setting to ", !isPlaying);
    setIsPaused(!isPlaying);
  }, [isPlaying]);

  useEffect(() => {
    if (stepTime === 3 && soundPlayerRef.current) {
      soundPlayerRef.current.play();
    }
  }, [stepTime]);

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
        totalCycels: steps[currentStep].totalCycles,
      };
    }
    return { set: 0, totalSets: 0, totalCycles: 0 };
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
      totalSets: 0,
      totalCycles: 0,
    });
  }, [currentStep, steps, routine]);

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
    <div className={`flex flex-col w-full h-screen ${getCurrentStepColor()}`}>
      <SaveWorkoutModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveWorkout}
      />
      <SoundPlayer ref={soundPlayerRef} />
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
        <h1 className={`text-3xl  font-bold`}>{steps[currentStep]?.name}</h1>
        <h1 className={`text-4xl pb-10 font-bold`}>{stepTime}</h1>
      </div>
      <div className="flex-grow overflow-y-auto">
        <div className="flex flex-col justify-center items-center">
          {steps.map((step, index) => (
            <button
              key={index}
              onClick={() => handleClickedStep(index)}
              className={`w-full  rounded ${
                index === currentStep
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
                  index === currentStep ? "rgba(0, 0, 0, 0.1)" : "transparent", // Semi-transparent overlay
              }}
            >
              {step.name}
            </button>
          ))}
        </div>
      </div>
      <div className="flex justify-between items-center p-4 border-2 border-black border-solid">
        <button
          onClick={() => setCurrentStep(currentStep - 1)}
          className="p-2 rounded text-white"
        >
          ⬅️
        </button>
        <div>
          <span>
            Cycle: {steps[currentStep]?.cycle + 1 || 0}/
            {routine?.routine?.Cycles?.value || 0}
          </span>{" "}
          <br />
          <span>
            Sets: {steps[currentStep]?.set + 1 || 0}/
            {routine?.routine?.Sets?.value || 0}
          </span>
        </div>
        <button
          onClick={() => setCurrentStep(currentStep + 1)}
          className="p-2 rounded text-white"
        >
          ➡️
        </button>
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
