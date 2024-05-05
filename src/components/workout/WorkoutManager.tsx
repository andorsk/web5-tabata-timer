import React, { useState } from "react";
import Timer from "@/components/timer";
import { WorkoutSession, Routine } from "@/models/workout";
import { createSteps, computeTotalTimeFromSteps } from "@/lib/workout";
import { soundPlayer } from "@/components/sound/SoundLibrary"; // Ensure this is correctly set up to play sounds
import { storeSession } from "@/lib/store/dwn/session";
import { vibrationPlayer } from "@/components/timer/VibrationPlayer"; // Ensure this is correctly set up to play sounds
import { Web5 } from "@web5/api";

import { Step } from "@/models/workout";

import { Dispatch } from "redux";

import {
  refreshTimer,
  startWorkout as STW,
  refreshWorkout,
  setWorkout as SW,
  isReady,
} from "@/lib/actions/workout";

export type WorkoutManagerI = {
  workout: WorkoutSession | null;
  isWorkoutActive: boolean;
  currentStep: number;
  startWorkout: () => void;
  setDispatcher: (dispatch: Dispatch) => void;
  totalTime: number;
  pauseWorkout: () => void;
  unpauseWorkout: () => void;
  previousStep: () => void;
  nextStep: () => void;
  resetWorkout: () => void;
  timeFromBeginningOfSet: number;
  endWorkout: () => void;
  setStep: (step: number) => void;
  toggleWorkout: () => void;
  timer: Timer | null;
  timeLeft: number;
  ready: boolean;
  started: boolean;
  getStep: (n: number) => Step | null;
  setWorkout: (params: { routine: Routine }) => void;
  sessionId?: string;
};

export class WorkoutManager implements WorkoutManagerI {
  _workout: WorkoutSession | null = null;
  isWorkoutActive: boolean = false;
  currentStep: number = 0;
  isCompleted: boolean = false;
  timer: Timer | null = null;
  totalTime: number;
  timeLeft: number = 0;
  timeFromBeginningOfSet: number;
  ti: number = 0;
  playedThreeSecondSound: boolean = false; // To ensure sound plays only once
  started: boolean = false;
  set: boolean = false;
  dispatch: Dispatch | null;
  ready: boolean = false;
  sessionId?: string;

  constructor() {
    this.isWorkoutActive = false;
    this.currentStep = 0;
    this.isCompleted = false;
    this.timer = null;
    this.timeLeft = 0;
    this.ti = 0;
    this.playedThreeSecondSound = false;
    this.started = false;
    this.totalTime = 0;
    this.set = false;
    this.ready = false;
    this.timeFromBeginningOfSet = 0;
    this.dispatch = null;
  }

  get workout() {
    return this._workout;
  }

  startWorkout(web5: Web5) {
    if (this.started) return;
    this.started = true;
    this.unpauseWorkout();
  }

  setDispatcher(dispatch: Dispatch) {
    this.dispatch = dispatch;
  }

  getStep(i: number): Step | null {
    return this.workout?.steps[i] || null;
  }

  pauseWorkout() {
    if (!this.isWorkoutActive || !this.timer) return;
    this.isWorkoutActive = false;
    this.timer.pause();
    const state = this.timer.state();
    if (this.dispatch) {
      // TODO: fix action
      //@ts-ignore
      this.dispatch(refreshTimer(state));
    }
  }

  unpauseWorkout() {
    if (this.isWorkoutActive || !this.timer) return;
    console.log("unpausing");
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

  resetWorkout(web5: Web5) {
    this.isWorkoutActive = false;
    this.started = false;
    if (this?.workout?.routine) {
      this.setWorkout({ routine: this?.workout?.routine, web5: Web5 });
    }
    if (this.timer) {
      this.timer.reset();
    }
    console.log("Workout reset");
  }

  endWorkout() {
    this.isWorkoutActive = false;
    this.isCompleted = true;
    this.timeLeft = 0;
    if (this.timer) {
      console.log("resetting timer");
      this.timer.reset();
    }
    if (this.workout) {
      this.workout.endTime = new Date().toISOString();
      this.workout.completed = true;
    }
  }

  setStep(step: number) {
    if (!this.workout || step < 0 || step > this.workout.steps.length) {
      throw new Error("Invalid step set. Must be valid and session created.");
    }
    this.set = true;
    this.currentStep = step;
    if (this.timer) {
      this.timer.setTime(this.workout?.steps[step]?.duration);
    }

    this.timeFromBeginningOfSet = computeTotalTimeFromSteps(
      this.workout.steps.slice(this.currentStep, this.workout.steps.length),
    );

    this.timeLeft = this.timeFromBeginningOfSet;
    this.playedThreeSecondSound = false;
    console.log("set is updated");
  }

  nextStep() {
    if (this.workout?.completed) {
      return;
    }
    if (
      this.workout &&
      this.workout.steps &&
      this.currentStep >= this.workout.steps.length - 1
    ) {
      this.endWorkout();
      console.log("ending workout");
      return;
    }
    console.log("setting step", this.currentStep + 1);
    this.setStep(this.currentStep + 1);
  }

  previousStep() {
    if (this.currentStep <= 0) {
      return;
    }
    this.setStep(this.currentStep - 1);
  }

  onTimerTick() {
    if (this.timer && this.dispatch) {
      const state = this.timer.state();
      this.timeLeft =
        this.timeFromBeginningOfSet -
        (this.timer.totalTime - this.timer.remainingTime);
      if (state.remainingTime <= 4000 && !this.playedThreeSecondSound) {
        if (soundPlayer) {
          soundPlayer.play();
          this.playedThreeSecondSound = true;
        }
        // TODO: fix. this isn't robust. Make it more robust
        if (
          vibrationPlayer &&
          (state.remainingTime === 2000 ||
            state.remainingTime === 1000 ||
            state.remainingTime === 3000)
        ) {
          vibrationPlayer.shortVibrate(); // Vibrate at 1 second
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

  setDispatch(dispatch: Dispatch) {
    this.dispatch = dispatch;
  }

  async setWorkout(params: { routine: Routine; web5: Web5 }) {
    const steps = createSteps(params.routine.config);
    const totalTime = computeTotalTimeFromSteps(steps);
    let workout = {
      routine: params.routine,
      steps,
      totalTime,
      timeLeft: totalTime,
      startTime: new Date().toISOString(),
      isWorkoutActive: false,
      completed: false,
    };
    if (params.web5) {
      const sessionId = await storeSession(workout, params.web5);
      workout.id = sessionId;
      this.sessionId = "asdf";
    }
    this._workout = workout;
    // Add Start Workout to DWN
    this.timer = new Timer(() => this.onTimerTick());
    this.set = true;
    this.started = false;
    this.setStep(0);
    this.isWorkoutActive = false;
    this.ready = true;
    this.dispatch(refreshWorkout(this));
  }
}

// Singleton to manage workout across app.
// Probably a better way to do this, but still learning redux.
export class WorkoutManagerSingleton {
  private static instance: WorkoutManagerSingleton;
  public manager: WorkoutManagerI; // Assuming WorkoutManagerImpl is correctly defined elsewhere
  private dispatch: Dispatch | null = null;

  private constructor() {
    this.manager = new WorkoutManager();
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
