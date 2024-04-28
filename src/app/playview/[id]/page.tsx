"use client";

import type { NextPage } from "next";
import React, { useState, useEffect } from "react";
import { getRoutine } from "@/lib/store/dwn/routines";

import { useRouter } from "next/navigation";
import { useWeb5 } from "@/context/Web5Context";

import TimerComponent from "@/components/TimerComponent";

type CurrentRoutineState = {
  currentStepIndex: number;
  currentStepName: string;
  currentTimeLeft: string;
  currentTimeLeftInStep: string;
};

const steps = ["Prepare", "Work", "Rest", "Work", "Rest", "Cool Down"];

export default function PlayView({ params }: { params: { routerId: string } }) {
  const router = useRouter();
  const { web5, did } = useWeb5();

  const [routine, setRoutine] = useState(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [totalTimeLeft, setTotalTimeLeft] = useState(0);
  const [timeInStep, setTimeInStep] = useState("15:00");

  const routineId = params.id;
  const totalCycles = 3;
  const currentCycle = 1;

  const fetchRoutine = async (routineId, web5) => {
    if (routineId) {
      try {
        const t = await getRoutine(routineId, web5);
        setRoutine(t);
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

  useEffect(() => {
    computeTotalTimeLeft(); // Run the function when myVariable changes
  }, [routine]); // Specify myVariable as a dependency

  const computeTotalTimeLeft = () => {
    if (routine) {
      console.log("----------");
      setTotalTimeLeft(100);
      //setTotalTimeLeft(routine.routine.Prepare.duration);
      console.log("444444444");
    }
  };

  return (
    <div className="flex flex-col w-full h-screen ">
      {totalTimeLeft}
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
          Total Time Left: {totalTimeLeft}{" "}
          <TimerComponent durationInSeconds={totalTimeLeft} />
        </div>
      </div>
      <div className="text-center">
        <h1 className="text-4xl font-bold">{timeInStep}</h1>{" "}
      </div>
      <div className="flex-grow grid grid-cols-1 gap-4 p-4">
        {steps.map((step, index) => (
          <button
            key={index}
            className={`p-2 text-center w-full rounded ${
              index === currentStep ? "bg-blue-500 text-white" : "bg-gray-200"
            }`}
            onClick={() => setCurrentStep(index)}
          >
            {step}
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
