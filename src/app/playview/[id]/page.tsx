"use client";

import { useRouter } from "next/navigation";
import React, { useState, useEffect, useRef } from "react";

import { useWeb5 } from "@/context/Web5Context";
import { useWorkout } from "@/context/WorkoutSessionContext";

import { getRoutine } from "@/lib/store/dwn/routines";

export default function PlayView({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { web5, did } = useWeb5();
  const { setWorkout, startWorkout, timer } = useWorkout();
  const [isTimerPlaying, setIsTimerPlaying] = useState(false); // State to track timer playing

  useEffect(() => {
    const fetchRoutine = async () => {
      if (web5 && params.id) {
        try {
          const t = await getRoutine(params.id, web5);
          setWorkout(t);
          console.log("workout set");
          startWorkout();
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

  return (
    <div className={`flex flex-col w-full h-screen ${getCurrentStepColor()}`}>
      Remaining time :
      <div className="flex justify-between items-center p-4">
        <div className="flex">
          <button
            className="p-2 rounded bg-blue-500 text-white"
            onClick={() => {
              timer.toggle();
              setIsTimerPlaying(timer.isTimerPlaying());
            }}
          >
            {isTimerPlaying ? "Pause" : "Play"}
          </button>
          <button
            className="p-2 rounded bg-blue-500 text-white"
            onClick={() => router.push("/")}
          >
            Home
          </button>
        </div>
      </div>
    </div>
  );
}
