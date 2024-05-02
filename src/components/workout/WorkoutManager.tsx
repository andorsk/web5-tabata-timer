import React, { useState } from "react";
import Timer from "@/components/timer";
import { WorkoutSession } from "@/models/workout";
import { createSteps, computeTotalTimeFromSteps } from "@/lib/workout";
import { soundPlayer } from "@/components/sound/SoundLibrary"; // Ensure this is correctly set up to play sounds
import { getRoutine } from "@/lib/store/dwn/routines";
import { Web5 } from "@web5/api";
import { Step } from "@/models/workout";

import { Dispatch } from "redux";

import {
  refreshTimer,
  startWorkout as STW,
  endWorkout as EW,
  setWorkout as SW,
  isReady,
} from "@/lib/actions/workout";

export type WorkoutManager = {
  workout: WorkoutSession | null;
  isWorkoutActive: boolean;
  currentStep: number;
  startWorkout: (dispatch: Dispatch) => void;
  pauseWorkout: () => void;
  previousStep: () => void;
  nextStep: () => void;
  resetWorkout: () => void;
  endWorkout: () => void;
  setStep: (step: number) => void;
  timer: Timer | null;
  timeLeft: number;
  started: boolean;
  setWorkout: (params: {
    id: string;
    web5: Web5;
    dispatch: Dispatch<any>;
  }) => void;
};

export class WorkoutManagerImpl implements WorkoutManager {
  workout: WorkoutSession | null = null;
  isWorkoutActive: boolean = false;
  currentStep: number = 0;
  isCompleted: boolean = false;
  timer: Timer | null = null;
  timeLeft: number = 0;
  timeFromBegginningOfSet: number = 0;
  playedThreeSecondSound: boolean = false; // To ensure sound plays only once
  started: boolean = false;
  set: boolean = false;
  dispatch?: Dispatch;

  constructor() {}

  startWorkout(dispatch: Dispatch<any>) {
    if (this.isWorkoutActive) return;
    this.setStep(0);
    this.isWorkoutActive = true;
    this.started = true;
    dispatch(STW());
  }

  setDispatcher(dispatch: Dispatch) {
    this.dispatch = dispatch;
  }

  getStep(i: number): Step | null {
    return this.workout?.steps[i] || null;
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
    if (this.workout) {
      this.workout.endTime = new Date().toISOString();
    }
  }

  setStep(step: number) {
    if (!this.workout || step < 0 || step > this.workout.steps.length) {
      throw new Error("Invalid step set. Must be valid and session created.");
    }

    console.log("setting step", step);
    if (this.timer) {
      this.currentStep = step;
      this.timer.reset();
      this.timer.start(this.workout?.steps[step].duration);
    }
    this.timeFromBegginningOfSet = computeTotalTimeFromSteps(
      this.workout.steps.slice(this.currentStep, this.workout.steps.length),
    );
    this.playedThreeSecondSound = false;
  }

  nextStep() {
    if (
      this.workout &&
      this.workout.steps &&
      this.currentStep >= this.workout.steps.length
    ) {
      this.endWorkout();
      this.isCompleted = true;
      return;
    }
    this.setStep(this.currentStep + 1);
  }

  previousStep() {
    if (this.currentStep <= 0) {
      return;
    }
    this.setStep(this.currentStep - 1);
  }

  onTimerTick() {
    if (this.timer && this.dispatch && this.started) {
      const state = this.timer.state();
      //console.log("timer state", state);
      this.timeLeft =
        this.timeFromBegginningOfSet -
        (this.timer.totalTime - this.timer.remainingTime);
      if (state.remainingTime === 3000 && !this.playedThreeSecondSound) {
        if (soundPlayer) {
          soundPlayer.play();
        }
      }
      if (state.remainingTime <= 0) {
        console.log("calling next step because time ran out");
        this.nextStep();
      }
      // @ts-ignore
      this.dispatch(refreshTimer(state));
    } else {
      console.log(this.timer, this.dispatch);
    }
  }

  // @ts-ignore
  async setWorkout(params: {
    id: string;
    web5: Web5;
    dispatch: Dispatch<any>;
  }) {
    if (!params.web5) {
      console.log(params.web5);
      throw new Error("no web5 provided. can't get workout");
    }
    const routine = await getRoutine(params.id, params.web5);
    const steps = createSteps(routine.routine);
    const totalTime = computeTotalTimeFromSteps(steps);
    this.workout = {
      routine: routine,
      steps,
      totalTime,
      startTime: new Date().toISOString(),
      isWorkoutActive: true,
      completed: false,
    };
    console.log("Settting timer");
    this.timer = new Timer(() => this.onTimerTick());
    this.set = true;
    params.dispatch(isReady());
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
