// workout.ts
import { combineReducers } from "redux";
import { Routine } from "@/models/workout";

import {
  WorkoutActionTypes,
  IS_READY,
  REFRESH_WORKOUT,
  REFRESH_TIMER,
  SET_ROUTINES,
} from "@/lib/actions/workout";

import { useWorkoutManager } from "@/hooks/useWorkoutManager";
import { type WorkoutManagerI } from "@/components/workout/WorkoutManager";
import { WorkoutManager } from "@/components/workout/WorkoutManager";

function useInitialState(): WorkoutState {
  const manager = new WorkoutManager();
  const initialState: WorkoutState = {
    manager: manager,
    ready: false,
    set: false,
    routines: [] as Routine[],
  };
  return initialState;
}

export type WorkoutState = {
  manager: WorkoutManagerI;
  routines: Routine[];
  ready: boolean;
  set: boolean;
};

const initialState = useInitialState();

export const workoutReducer = (
  state = initialState,
  action: WorkoutActionTypes,
): WorkoutState => {
  switch (action.type) {
    case SET_ROUTINES:
      return {
        ...state,
        routines: action.payload,
      };
    case IS_READY:
      return {
        ...state,
        ready: true,
      };
    case REFRESH_TIMER:
      return {
        ...state,
      };
    case REFRESH_WORKOUT:
      return {
        ...state,
        manager: action.payload,
      };
    default:
      return state;
  }
};

export const rootReducer = combineReducers({
  workout: workoutReducer,
});
