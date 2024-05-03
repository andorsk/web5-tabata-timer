"use client";

import { configureProtocol } from "@/lib/store/dwn/routines";

export const INIT_WEB5_START = "INIT_WEB5_START";
export const INIT_WEB5_SUCCESS = "INIT_WEB5_SUCCESS";
export const INIT_WEB5_FAILURE = "INIT_WEB5_FAILURE";
import { Web5 } from "@web5/api";
import { Dispatch } from "redux";

export type Web5State = {
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
  payload?: Web5State;
}

export interface SuccessWeb5Action {
  type: typeof INIT_WEB5_SUCCESS;
  payload?: Web5State;
}

export interface FailureWeb5Action {
  type: typeof INIT_WEB5_FAILURE;
  payload?: Web5State;
}

export type Web5ActionTypes =
  | StartWeb5Action
  | SuccessWeb5Action
  | FailureWeb5Action;

export const initWeb5 = async (password: string, dispatch: Dispatch) => {
  dispatch({ type: INIT_WEB5_START });
  // @ts-ignore
  const { Web5 } = await import("@web5/api/browser");

  try {
    const { web5, did } = await Web5.connect({ password: password });
    await configureProtocol(web5);
    dispatch({
      type: INIT_WEB5_SUCCESS,
      payload: { web5, did },
    });
  } catch (error) {
    dispatch({
      type: INIT_WEB5_FAILURE,
      payload: error,
    });
  }
};
