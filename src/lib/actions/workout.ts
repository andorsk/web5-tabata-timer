import TimerState from "@/components/timer";
import { Web5 } from "@web5/api";
import { Routine } from "@/models/workout";

export const SET_WORKOUT = "SET_WORKOUT";
export const IS_READY = "IS_READY";

export const START_WORKOUT = "START_WORKOUT";
export const PAUSE_WORKOUT = "PAUSE_WORKOUT";
export const RESET_WORKOUT = "RESET_WORKOUT";
export const END_WORKOUT = "END_WORKOUT";
export const SET_STEP = "SET_STEP";
export const REFRESH_TIMER = "REFRESH_TIMER";
export const SET_ROUTINES = "SET_ROUTINES";
export const REFRESH_WORKOUT = "REFRESH_WORKOUT";

import { WorkoutManagerI } from "@/components/workout/WorkoutManager";

export interface SetWorkoutAction {
  type: typeof SET_WORKOUT;
  payload: {
    routine: Routine;
  };
}

export interface RefreshWorkoutAction {
  type: typeof REFRESH_WORKOUT;
  payload: WorkoutManagerI;
}

export interface SetRoutinesAction {
  type: typeof SET_ROUTINES;
  payload: Routine[];
}

export interface StartWorkoutAction {
  type: typeof START_WORKOUT;
}

export interface IsReadyAction {
  type: typeof IS_READY;
}

export interface RefreshTimerAction {
  type: typeof REFRESH_TIMER;
  payload: TimerState;
}

export interface PauseWorkoutAction {
  type: typeof PAUSE_WORKOUT;
}

export interface ResetWorkoutAction {
  type: typeof RESET_WORKOUT;
}

export interface EndWorkoutAction {
  type: typeof END_WORKOUT;
}

export interface SetStepAction {
  type: typeof SET_STEP;
  payload: number;
}

export interface RefreshWorkoutAction {
  type: typeof REFRESH_WORKOUT;
}

export type WorkoutActionTypes =
  | SetWorkoutAction
  | StartWorkoutAction
  | PauseWorkoutAction
  | ResetWorkoutAction
  | EndWorkoutAction
  | SetStepAction
  | RefreshTimerAction
  | RefreshWorkoutAction
  | SetRoutinesAction
  | IsReadyAction;

export const setWorkout = (routine: Routine): SetWorkoutAction => ({
  type: SET_WORKOUT,
  payload: {
    routine: routine,
  },
});

export const startWorkout = (): StartWorkoutAction => {
  return {
    type: START_WORKOUT,
  };
};

export const pauseWorkout = (): PauseWorkoutAction => ({
  type: PAUSE_WORKOUT,
});

export const resetWorkout = (): ResetWorkoutAction => ({
  type: RESET_WORKOUT,
});

export const endWorkout = (): EndWorkoutAction => ({
  type: END_WORKOUT,
});

export const setStep = (step: number): SetStepAction => ({
  type: SET_STEP,
  payload: step,
});

export const refreshTimer = (state: TimerState): RefreshTimerAction => ({
  type: REFRESH_TIMER,
  payload: state,
});

export const refreshWorkout = (w: WorkoutManagerI): RefreshWorkoutAction => {
  console.log("refreshing workout ", w?.workout?.id);
  return {
    type: REFRESH_WORKOUT,
    payload: w,
  };
};

export const isReady = (): IsReadyAction => ({
  type: IS_READY,
});

export const setRoutines = (routines: Routine[]): SetRoutinesAction => ({
  type: SET_ROUTINES,
  payload: routines,
});
