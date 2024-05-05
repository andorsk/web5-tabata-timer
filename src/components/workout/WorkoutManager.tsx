import React, { useState } from "react";
import Timer from "@/components/timer";
import { WorkoutSession, Routine } from "@/models/workout";
import { createSteps, computeTotalTimeFromSteps } from "@/lib/workout";
import { soundPlayer } from "@/components/sound/SoundLibrary"; // Ensure this is correctly set up to play sounds
import { vibrationPlayer } from "@/components/timer/VibrationPlayer"; // Ensure this is correctly set up to play sounds

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
  private _workout: WorkoutSession | null = null;
  private _isWorkoutActive: boolean = false;
  private _currentStep: number = 0;
  private _isCompleted: boolean = false;
  private _timer: Timer | null = null;
  private _totalTime: number;
  private _timeLeft: number = 0;
  private _timeFromBeginningOfSet: number;
  private _ti: number = 0;
  private _playedThreeSecondSound: boolean = false; // To ensure sound plays only once
  private _started: boolean = false;
  private _set: boolean = false;
  private _dispatch: Dispatch | null;
  private _ready: boolean = false;
  private _sessionId?: string;

  constructor() {
    this._isWorkoutActive = false;
    this._currentStep = 0;
    this._isCompleted = false;
    this._timer = null;
    this._timeLeft = 0;
    this._ti = 0;
    this._playedThreeSecondSound = false;
    this._started = false;
    this._totalTime = 0;
    this._set = false;
    this._ready = false;
    this._timeFromBeginningOfSet = 0;
    this._dispatch = null;
  }

  get workout(): WorkoutSession | null {
    return this._workout;
  }

  get isWorkoutActive(): boolean {
    return this._isWorkoutActive;
  }

  get currentStep(): number {
    return this._currentStep;
  }

  get isCompleted(): boolean {
    return this._isCompleted;
  }

  get timer(): Timer | null {
    return this._timer;
  }

  get totalTime(): number {
    return this._totalTime;
  }

  get timeLeft(): number {
    return this._timeLeft;
  }

  get timeFromBeginningOfSet(): number {
    return this._timeFromBeginningOfSet;
  }

  get ti(): number {
    return this._ti;
  }

  get playedThreeSecondSound(): boolean {
    return this._playedThreeSecondSound;
  }

  get started(): boolean {
    return this._started;
  }

  get set(): boolean {
    return this._set;
  }

  get dispatch(): Dispatch | null {
    return this._dispatch;
  }

  get ready(): boolean {
    return this._ready;
  }

  get sessionId(): string | undefined {
    return this._sessionId;
  }

  startWorkout() {
    if (this.started) return;
    console.log("starting workout");
    this._started = true;
    this.unpauseWorkout();
  }

  setDispatcher(dispatch: Dispatch) {
    this._dispatch = dispatch;
  }

  getStep(i: number): Step | null {
    return this.workout?.steps[i] || null;
  }

  pauseWorkout() {
    if (!this._isWorkoutActive || !this._timer) return;
    this._isWorkoutActive = false;
    this._timer.pause();
    const state = this._timer.state();
    if (this.dispatch) {
      // TODO: fix action
      //@ts-ignore
      this.dispatch(refreshTimer(state));
    }
  }

  unpauseWorkout() {
    if (this._isWorkoutActive || !this._timer) return;
    console.log("unpausing");
    this._isWorkoutActive = true;
    this._timer.play();
  }

  toggleWorkout() {
    if (!this._isWorkoutActive) {
      this.unpauseWorkout();
    } else {
      this.pauseWorkout();
    }
  }

  resetWorkout() {
    this._isWorkoutActive = false;
    this.started = false;
    if (this?.workout?.routine) {
      this._setWorkout({ routine: this?.workout?.routine });
    }
    if (this._timer) {
      this._timer.reset();
    }
    console.log("Workout reset");
  }

  endWorkout() {
    this._isWorkoutActive = false;
    this._isCompleted = true;
    this._timeLeft = 0;
    if (this._timer) {
      console.log("resetting timer");
      this._timer.reset();
    }
    if (this.workout) {
      this._workout.endTime = new Date().toISOString();
      this._workout.completed = true;
    }
  }

  setStep(step: number) {
    if (!this.workout || step < 0 || step > this.workout.steps.length) {
      throw new Error("Invalid step set. Must be valid and session created.");
    }
    this._set = true;
    this._currentStep = step;
    if (this._timer) {
      this.timer.setTime(this.workout?.steps[step]?.duration);
    }

    this._timeFromBeginningOfSet = computeTotalTimeFromSteps(
      this.workout.steps.slice(this._currentStep, this.workout.steps.length),
    );

    this._timeLeft = this._timeFromBeginningOfSet;
    this._playedThreeSecondSound = false;
    console.log("set is updated");
    if (this.dispatch) {
      // @ts-ignore
      this.dispatch(refreshWorkout(this));
    }
  }

  nextStep() {
    if (this.workout?.completed) {
      return;
    }
    if (
      this.workout &&
      this.workout.steps &&
      this._currentStep >= this.workout.steps.length - 1
    ) {
      this.endWorkout();
      console.log("ending workout");
      if (this.workout && this.dispatch) {
        // @ts-ignore
        this.dispatch(refreshWorkout(this));
      }
      return;
    }
    console.log("setting step", this._currentStep + 1);
    this.setStep(this._currentStep + 1);
  }

  previousStep() {
    if (this._currentStep <= 0) {
      return;
    }
    this.setStep(this._currentStep - 1);
  }

  onTimerTick() {
    if (this._timer && this.dispatch) {
      const state = this._timer.state();
      this._timeLeft =
        this._timeFromBeginningOfSet -
        (this._timer.totalTime - this._timer.remainingTime);
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
      console.log(this._timer, this.dispatch);
    }
  }

  setDispatch(dispatch: Dispatch) {
    this._dispatch = dispatch;
  }

  setWorkout(params: { routine: Routine }) {
    const steps = createSteps(params.routine.config);
    const totalTime = computeTotalTimeFromSteps(steps);
    this._workout = {
      routine: params.routine,
      steps,
      totalTime,
      timeLeft: totalTime,
      startTime: new Date().toISOString(),
      isWorkoutActive: false,
      completed: false,
    };
    // Add Start Workout to DWN
    this._timer = new Timer(() => this.onTimerTick());
    this._set = true;
    this._started = false;
    this.setStep(0);
    this._isWorkoutActive = false;
    if (this._dispatch) {
      // @ts-ignore
      this.dispatch(refreshWorkout(this));
    }
    this._ready = true;
    console.log("set workout ", this.workout);
  }
}
