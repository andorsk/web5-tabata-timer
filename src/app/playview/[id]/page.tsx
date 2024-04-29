"use client";

import type { NextPage } from "next";
import React, { useState, useEffect } from "react";
import { getRoutine } from "@/lib/store/dwn/routines";

import { useRouter } from "next/navigation";
import { useWeb5 } from "@/context/Web5Context";
import { useTimer } from "@/context/TimerContext";

import TimerComponent from "@/components/TimerComponent";

type CurrentRoutineState = {
  currentStepIndex: number;
  currentStepName: string;
  currentTimeLeft: string;
  currentTimeLeftInStep: string;
};

// const steps = ["Prepare", "Work", "Rest", "Work", "Rest", "Cool Down"];

enum Color {
  RED = "red",
  GREEN = "green",
  YELLOW = "yellow",
}

type Step = {
  name: string;
  duration: number;
  color: string;
};

export default function PlayView({ params }: { params: { routerId: string } }) {
  const router = useRouter();
  const { web5, did } = useWeb5();
  const {
    globalTime,
    stepTime,
    timeLeft,
    timeDone,
    totalTime,
    startTimers,
    startStepTimer,
  } = useTimer();
  const [routine, setRoutine] = useState(null);
  const [steps, setSteps] = useState([]);

  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [totalTimeLeft, setTotalTimeLeft] = useState(0);
  const [timeInStep, setTimeInStep] = useState(stepTime);

  const routineId = params.id;
  const totalCycles = 3;
  const currentCycle = 1;

  const createSteps = (config: RoutineConfiguration): Step[] => {
    console.log(config);
    const steps = [
      {
        name: config.Prepare.name,
        duration: config.Prepare.duration,
        color: "bg-yellow-500",
      } as Step,
    ];

    for (let i = 0; i < config.Cycles.value; i++) {
      for (let j = 0; j < config.Cycles.value; j++) {
        steps.push({
          name: config.Work.name,
          duration: config.Work.duration,
          color: "bg-red-500",
        });
        if (j <= config.Cycles.value - 1) {
          steps.push({
            name: config.Rest.name,
            duration: config.Rest.duration,
            color: "bg-green-500",
          });
        }
      }
      steps.push({
        name: config.RestBetweenSteps.name,
        duration: config.RestBetweenSteps.duration,
        color: "bg-green-200",
      });
    }
    steps.push({
      name: config.CoolDown.name,
      duration: config.CoolDown.duration,
      color: "bg-blue-500",
    });

    return steps;
  };

  const computeTotalTimeFromSteps = (steps: Step[]): number => {
    const totalTime = steps.reduce((total, step) => {
      return total + step.duration;
    }, 0);
    return totalTime;
  };

  const fetchRoutine = async (routineId, web5) => {
    if (routineId) {
      try {
        const t = await getRoutine(routineId, web5);
        setRoutine(t);
        const steps = createSteps(t.routine);
        setSteps(steps);
        const time = computeTotalTimeFromSteps(steps);
        setTotalTimeLeft(time);
        startTimers(time);
        startStepTimer(steps[0].duration);
      } catch (error) {
        console.error(error);
      }
    }
  };

  useEffect(() => {
    if (web5 && routineId) {
      fetchRoutine(routineId, web5);
    }
  }, [routineId, web5]);

  const handleClickedStep = (index) => {
    console.log(steps[index]);
    setCurrentStep(index);
    startStepTimer(steps[index].duration);
  };

  return (
    <div className="flex flex-col w-full h-screen ">
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
          Total Time Left: {timeLeft}{" "}
        </div>
      </div>
      <div className="text-center">
        {steps.length === 0 ? (
          <h1>Loading...</h1>
        ) : (
          <h1 className={`text-4xl p-12 ${steps[currentStep].color} font-bold`}>
            {stepTime}
          </h1>
        )}
      </div>
      <div className="flex-grow grid grid-cols-1 gap-1 p-4">
        {steps.map((step, index) => (
          <button
            key={index}
            onClick={() => handleClickedStep(index)}
            className={`p-2 text-center w-full rounded ${
              index === currentStep ? "bg-blue-500 text-white" : "bg-gray-200"
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
            Cycle: {currentCycle}/{totalCycles}
          </span>{" "}
          <br />
          <span>
            Step: {currentStep + 1}/{steps.length}
          </span>
        </div>
        <button className="p-2 rounded bg-blue-500 text-white">➡️</button>
      </div>
    </div>
  );
}
