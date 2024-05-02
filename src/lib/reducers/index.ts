// reducer.ts
import { combineReducers } from "redux";
import { workoutReducer } from "./workout"; // Assuming you have a workoutReducer
import { counterReducer } from "./counter";

export const rootReducer = combineReducers({
  workout: workoutReducer,
  counter: counterReducer,
});

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;
