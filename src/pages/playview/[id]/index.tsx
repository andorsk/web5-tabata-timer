"use client";

import type { NextPage } from "next";
import React, { useState, useEffect } from "react";

import { useRouter } from "next/router";
// import { useWeb5 } from "@/context/Web5Context";
import { getRoutine } from "@/lib/store/dwn/routines";

export type CurrentRoutineState = {
  currentStepIndex: number;
  currentStepName: string;
  currentTimeLeft: string;
  currentTimeLeftInStep: string;
};

const steps = ["Prepare", "Work", "Rest", "Work", "Rest", "Cool Down"];

const PlayView: NextPage = () => {
  const router = useRouter();
  const { query } = router;
  const { routineId } = query as { routineId: string }; // Safely access routineId

  // const { web5 } = useWeb5();

  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [totalTimeLeft, setTotalTimeLeft] = useState("30:00");
  const [timeInStep, setTimeInStep] = useState("15:00");

  const totalCycles = 3;
  const currentCycle = 1;
  /*
   *   useEffect(async () => {
   *     if (routineId) {
   *       try {
   *         await getRoutine(routineId, web5);
   *       } catch (error) {
   *         console.error(error);
   *       }
   *     }
   *   }, [routineId, web5]);
   *  */
  return (
    <div className="flex flex-col w-full h-screen ">
      <div className="flex justify-between items-center p-4">
        <button
          className="p-2 rounded bg-blue-500 text-white"
          onClick={() => setIsPlaying(!isPlaying)}
        >
          {isPlaying ? "Pause" : "Play"}
        </button>
        <div className="p-4 text-center font-bold text-2xl">
          Total Time: {totalTimeLeft}
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
};

export default PlayView;
