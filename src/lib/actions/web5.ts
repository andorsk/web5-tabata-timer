"use client";

import { configureProtocol } from "@/lib/store/dwn/routines";

export const INIT_WEB5_START = "INIT_WEB5_START";
export const INIT_WEB5_SUCCESS = "INIT_WEB5_SUCCESS";
export const INIT_WEB5_FAILURE = "INIT_WEB5_FAILURE";
import { Web5 } from "@web5/api";

type Web5State = {
  web5: Web5;
  did: string;
  loading: boolean;
  loaded: boolean;
  error: string;
};

export const startWeb5 = (payload: Web5State): StartWeb5Action => ({
  type: INIT_WEB5_START,
});

export const web5success = (): SuccessWeb5Action => {
  return {
    type: INIT_WEB5_SUCCESS,
  };
};

export const web5failure = (): FailureWeb5Action => ({
  type: INIT_WEB5_FAILURE,
});

export interface StartWeb5Action {
  type: typeof INIT_WEB5_START;
}

export interface SuccessWeb5Action {
  type: typeof INIT_WEB5_SUCCESS;
}

export interface FailureWeb5Action {
  type: typeof INIT_WEB5_FAILURE;
}

export type Web5ActionTypes =
  | StartWeb5Action
  | SuccessWeb5Action
  | FailureWeb5Action;

export const initWeb5 = async (dispatch) => {
  dispatch({ type: INIT_WEB5_START });
  try {
    const { web5, did } = await Web5.connect({ password: "asdf" });
    await configureProtocol(web5);
    dispatch({
      type: INIT_WEB5_SUCCESS,
      payload: { web5, did },
    });
  } catch (error) {
    console.error("Failed to connect to Web5:", error);
    dispatch({
      type: INIT_WEB5_FAILURE,
      payload: error,
    });
  }
};
