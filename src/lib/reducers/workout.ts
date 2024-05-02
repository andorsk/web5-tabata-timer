// workout.ts
import { combineReducers } from "redux";
import { WorkoutManagerSingleton } from "@/components/workout";

import {
  WorkoutActionTypes,
  SET_WORKOUT,
  START_WORKOUT,
  PAUSE_WORKOUT,
  REFRESH_TIMER,
  RESET_WORKOUT,
  END_WORKOUT,
  SET_STEP,
  IS_READY,
} from "@/lib/actions/workout";

import { WorkoutManager, WorkoutManagerImpl } from "@/components/workout";

type WorkoutState = {
  manager: WorkoutManager;
  set: boolean;
};

const initialState: WorkoutState = {
  // @ts-ignore
  manager: {},
  set: false,
};

export const workoutReducer = (
  state = initialState,
  action: WorkoutActionTypes,
): WorkoutState => {
  const wm = WorkoutManagerSingleton.getInstance();
  switch (action.type) {
    case IS_READY:
      return {
        ...state,
        manager: wm.manager,
        set: true,
      };
    case SET_WORKOUT:
      return {
        ...state,
        manager: wm.manager,
      };
    case START_WORKOUT:
      return {
        ...state,
        manager: wm.manager,
      };
    case REFRESH_TIMER:
      return {
        ...state,
      };
    case PAUSE_WORKOUT:
      return {
        ...state,
        manager: wm.manager,
      };
    case SET_STEP:
      wm.manager.setStep(action.payload);
      return {
        ...state,
      };
    case RESET_WORKOUT:
      wm.manager.resetWorkout();
    case END_WORKOUT:
      wm.manager.endWorkout();
      return {
        ...state,
      };
    default:
      return state;
  }
};

export const rootReducer = combineReducers({
  workout: workoutReducer,
});
