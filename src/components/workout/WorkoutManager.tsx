import React, { useState } from "react";
import Timer, { TimerComponent } from "@/components/Timer";
import { WorkoutSession, Routine } from "@/models/workout";
import { endWorkout } from "@/lib/actions/workout";
import { setWorkout } from "@/lib/actions/workout";
import { createSteps, computeTotalTimeFromSteps } from "@/lib/workout";

import {
  refreshTimer,
  startWorkout as STW,
  endWorkout as EW,
  setWorkout as SW,
} from "@/lib/actions/workout";

export type WorkoutManager = {
  workout: WorkoutSession | null;
  isWorkoutActive: boolean;
  startWorkout: (routine: Routine) => void;
  pauseWorkout: () => void;
  resetWorkout: () => void;
  endWorkout: () => void;
  setStep: (step: number) => void;
  timer: Timer | null;
  setWorkout: (routine: Routine) => void;
};

export class WorkoutManagerImpl implements WorkoutManager {
  workout: WorkoutSession | null = null;
  isWorkoutActive: boolean = false;
  currentStep: number;
  isCompleted: boolean = false;
  timer: Timer | null = null;
  timeLeft: number;
  timeFromBegginningOfSet: number;

  constructor() {}

  startWorkout(routine: Routine) {
    if (this.isWorkoutActive) return;
    this.setStep(0);
    this.timer.play();
    this.isWorkoutActive = true;
  }

  setDispatcher(dispatch: Dispatch) {
    this.dispatch = dispatch;
  }

  getStep(i: number): Step {
    return this.workout.steps[i];
  }

  pauseWorkout() {
    if (!this.isWorkoutActive || !this.timer) return;
    console.log("pausing wokrout");
    this.isWorkoutActive = false;
    this.timer.pause();
  }

  unpauseWorkout() {
    if (this.isWorkoutActive || !this.timer) return;
    this.isWorkoutActive = true;
    this.timer.play();
  }

  toggleWorkout() {
    if (!this.isWorkoutActive) {
      this.unpauseWorkout();
    } else {
      this.pauseWorkout();
    }
  }
  resetWorkout() {
    this.isWorkoutActive = false;
    this.workout = null;
    if (this.timer) {
      this.timer.reset();
    }
    console.log("Workout reset");
  }

  endWorkout() {
    this.isWorkoutActive = false;
    if (this.timer) {
      this.timer.reset();
    }
    this.workout.endTime = new Date().toISOString();
  }

  setStep(step: number) {
    if (!this.workout || step < 0 || step > this.workout.steps.length) {
      throw new Error("Invalid step set. Must be valid and session created.");
    }
    if (this.timer) {
      this.currentStep = step;
      this.timer.start(this.workout.steps[step].duration);
    }
    this.timeFromBegginningOfSet = computeTotalTimeFromSteps(
      this.workout.steps.slice(this.currentStep, this.workout.steps.length - 1),
    );
  }

  nextStep() {
    if (this.setStep > this.workout.steps?.length) {
      this.endWorkout();
      this.isCompleted = true;
    }
    this.setStep(this.currentStep + 1);
  }

  previousStep() {
    if (this.setStep <= 0) {
      return;
    }
    this.setStep(this.currentStep - 1);
  }

  onTimerTick() {
    if (this.timer && this.dispatch) {
      if (this.timer.remainingTime <= 0) {
        this.nextStep();
      }
      const state = this.timer.state();
      this.dispatch(refreshTimer(state));
      this.timeLeft = this.timeFromBegginningOfSet + this.timer.remainingTime;
    } else {
      console.log(this.timer, this.dispatch);
    }
  }

  setWorkout(routine: Routine) {
    const steps = createSteps(routine.routine);
    const totalTime = computeTotalTimeFromSteps(steps);
    this.workout = {
      ...routine,
      steps,
      totalTime,
      startTime: new Date().toISOString(),
      isWorkoutActive: true,
    };
    this.setStep(0);
    this.timer = new Timer(() => this.onTimerTick());
  }
}

// Singleton to manage workout across app.
// Probably a better way to do this, but still learning redux.
export class WorkoutManagerSingleton {
  private static instance: WorkoutManagerSingleton;
  public manager: WorkoutManagerImpl; // Assuming WorkoutManagerImpl is correctly defined elsewhere
  private dispatch: Dispatch | null = null;

  private constructor() {
    this.manager = new WorkoutManagerImpl();
  }

  public static getInstance(): WorkoutManagerSingleton {
    if (!WorkoutManagerSingleton.instance) {
      WorkoutManagerSingleton.instance = new WorkoutManagerSingleton();
    }
    return WorkoutManagerSingleton.instance;
  }

  public setDispatcher(dispatch: Dispatch): void {
    this.dispatch = dispatch;
    this.manager.setDispatcher(dispatch);
  }
}
