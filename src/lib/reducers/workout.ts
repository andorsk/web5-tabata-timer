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
} from "@/lib/actions/workout";

import { WorkoutManager, WorkoutManagerImpl } from "@/components/workout";

type WorkoutState = {
  manager: WorkoutManager;
};

const initialState: WorkoutState = {
  manager: {},
};

export const workoutReducer = (
  state = initialState,
  action: WorkoutActionTypes,
): WorkoutManager => {
  const wm = WorkoutManagerSingleton.getInstance();
  switch (action.type) {
    case SET_WORKOUT:
      wm.manager.setWorkout(action.payload);
      return {
        ...state,
        manager: wm.manager,
      };
    case START_WORKOUT:
      wm.manager.startWorkout();
      return {
        ...state,
        manager: wm.manager,
      };
    case REFRESH_TIMER:
      return {
        ...state,
        timer: state.manager.timer,
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
