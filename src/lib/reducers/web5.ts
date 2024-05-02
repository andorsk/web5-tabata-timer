// reducers/web5Reducer.js

import {
  INIT_WEB5_START,
  INIT_WEB5_SUCCESS,
  INIT_WEB5_FAILURE,
} from "@/lib/actions/web5";

const initialState = {
  web5: null,
  did: null,
  loading: false,
  loaded: false,
  error: null,
};

export const web5Reducer = (state = initialState, action: Web5ActionTypes) => {
  switch (action.type) {
    case INIT_WEB5_START:
      return { ...state, loading: true, error: null };
    case INIT_WEB5_SUCCESS:
      return {
        ...state,
        web5: action.payload.web5,
        did: action.payload.did,
        loaded: true,
        loading: false,
      };
      console.log("web5 was loaded");
    case INIT_WEB5_FAILURE:
      return { ...state, error: action.payload, loading: false };
    default:
      return state;
  }
};
