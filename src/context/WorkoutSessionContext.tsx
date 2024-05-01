"use client";

import React, { createContext, useContext, useState } from "react";
import Timer from "@/components/Timer"; // Make sure to adjust the path based on your project structure
import { WorkoutSession, Routine } from "@/models/workout"; // Adjust the import path based on your project structure
import { createSteps, computeTotalTimeFromSteps } from "@/lib/workout";

type WorkoutContextType = {
  setWorkout: (r: Routine) => void;
  startWorkout: () => void;
  pauseWorkout: () => void;
  resetWorkout: () => void;
  endWorkout: () => void;
  setStep: (i: number) => void;
  timer: Timer;
  isWorkoutActive: boolean;
};

const WorkoutContext = createContext<WorkoutContextType | undefined>(undefined);

type SessionState = {
  currentStep: number;
};

export const useWorkout = (): WorkoutContextType => {
  const context = useContext(WorkoutContext);
  if (!context) {
    throw new Error("useWorkout must be used within a WorkoutSessionProvider");
  }
  return context;
};

export const WorkoutSessionProvider: React.FC = ({ children }) => {
  const [isWorkoutActive, setIsWorkoutActive] = useState(false);
  const [session, setWorkoutSession] = useState<WorkoutSession | null>(null);
  const [timer, setTimer] = useState<Timer | null>(null);
  const [sessionState, setSessionState] = useState<SessionState | null>(null);

  const setStep = (i: number) => {
    if (!session || i < 0 || i > session.steps.length) {
      throw new Error("invalid step set. must be valid and session created");
    }
    timer?.start(session.steps[i].duration);
    setSessionState({
      ...sessionState,
      currentStep: i,
    });
  };

  const setWorkout = (s: Routine) => {
    console.log("workout set");
    const steps = createSteps(s.routine);
    const t = computeTotalTimeFromSteps(steps);
    setWorkoutSession({
      ...s,
      steps: steps,
      totalTime: t,
      startTime: new Date().toISOString(),
    });

    setSessionState({
      currentStep: 0,
    });
    const newTimer = new Timer(steps[0].duration);
    setTimer(newTimer);
  };

  const startWorkout = () => {
    console.log("workout started");
    setIsWorkoutActive(true);
    setStep(0);
  };

  const pauseWorkout = () => {
    setIsWorkoutActive(false);
    if (timer) {
      timer.pause();
    }
    console.log("Workout paused");
  };

  const endWorkout = () => {
    setIsWorkoutActive(false);
    if (timer) {
      timer.reset();
    }
    // todo: add endtime
  };

  const resetWorkout = () => {
    setIsWorkoutActive(false);
    setWorkoutSession(null);
    if (timer) {
      timer.reset();
    }
    console.log("Workout reset");
  };

  return (
    <WorkoutContext.Provider
      value={{
        startWorkout,
        pauseWorkout,
        resetWorkout,
        endWorkout,
        isWorkoutActive,
        setWorkout,
        setStep,
        timer,
      }}
    >
      {children}
      {isWorkoutActive && session && <TimerComponent timer={timer} />}
    </WorkoutContext.Provider>
  );
};

const calculateTotalTime = (session: WorkoutSession): number => {
  // Logic to calculate the total time of the session
  // For example, you can sum up the durations of routines in the session
  return 60; // Dummy value for demonstration
};

type TimerComponentProps = {
  timer: Timer | null;
};

const TimerComponent: React.FC<TimerComponentProps> = ({ timer }) => {
  // Render the Timer component here, passing the timer instance as a prop
  // You can customize the Timer component according to your requirements
  return null;
};
