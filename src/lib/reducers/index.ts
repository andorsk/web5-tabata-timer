// reducer.ts
import { combineReducers } from "redux";
import { workoutReducer } from "./workout"; // Assuming you have a workoutReducer
import { counterReducer } from "./counter";
import { web5Reducer } from "./web5";
import authReducer from "./auth";

export const rootReducer = combineReducers({
  workout: workoutReducer,
  counter: counterReducer,
  web5: web5Reducer,
  auth: authReducer,
});

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;
