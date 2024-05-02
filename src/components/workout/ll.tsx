import { useState } from "react";
import Timer from "@/components/Timer";
import { WorkoutSession, Routine } from "@/models/workout";
import { createSteps, computeTotalTimeFromSteps } from "@/lib/workout";

import { setWorkout } from "@/lib/actions/workout";
import { RootState } from "@/lib/reducers";

type Workout = {
  workout: WorkoutSession | null;
  isWorkoutActive: boolean;
  startWorkout: (routine: Routine) => void;
  pauseWorkout: () => void;
  resetWorkout: () => void;
  endWorkout: () => void;
  setStep: (step: number) => void;
  timer: Timer | null;
  setWorkout(s: Routine): () => void;
  session: WorkoutSession | null;
};

type SessionState = {
  currentStep: number;
};

const useWorkoutManager = (): Workout => {
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
    const steps = createSteps(s.routine);
    const t = computeTotalTimeFromSteps(steps);
    console.log("workout setting ", session);
    setWorkoutSession({
      ...s,
      steps: steps,
      totalTime: t,
      startTime: new Date().toISOString(),
    });
    console.log("workout is ", session);

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

  return {
    session,
    isWorkoutActive,
    startWorkout,
    pauseWorkout,
    resetWorkout,
    endWorkout,
    setStep,
    timer,
  };
};

export default useWorkoutManager;
