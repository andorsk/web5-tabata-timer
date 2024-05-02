// actions.ts
import TimerState from "@/components/timer";
import { Web5 } from "@web5/api";

export const SET_WORKOUT = "SET_WORKOUT";
export const IS_READY = "IS_READY";

export const START_WORKOUT = "START_WORKOUT";
export const PAUSE_WORKOUT = "PAUSE_WORKOUT";
export const RESET_WORKOUT = "RESET_WORKOUT";
export const END_WORKOUT = "END_WORKOUT";
export const SET_STEP = "SET_STEP";
export const REFRESH_TIMER = "REFRESH_TIMER";
export const REFRESH_WORKOUT = "REFRESH_WORKOUT";

export interface SetWorkoutAction {
  type: typeof SET_WORKOUT;
  payload: {
    id: string;
    web5: Web5;
  };
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
  | IsReadyAction;

export const setWorkout = (id: string, web5: Web5): SetWorkoutAction => ({
  type: SET_WORKOUT,
  payload: {
    id: id,
    web5: web5,
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

export const refreshWorkout = (): RefreshWorkoutAction => ({
  type: REFRESH_WORKOUT,
});

export const isReady = (): IsReadyAction => ({
  type: IS_READY,
});
