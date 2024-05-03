export enum AuthActionTypes {
  LOGIN_REQUEST = "LOGIN_REQUEST",
  LOGIN_SUCCESS = "LOGIN_SUCCESS",
  LOGIN_FAILURE = "LOGIN_FAILURE",
}

export type AuthAction =
  | { type: AuthActionTypes.LOGIN_REQUEST }
  | { type: AuthActionTypes.LOGIN_SUCCESS }
  | { type: AuthActionTypes.LOGIN_FAILURE; error: string };

// authActions.ts

export const loginRequest = (): AuthAction => ({
  type: AuthActionTypes.LOGIN_REQUEST,
});

export const loginSuccess = (): AuthAction => ({
  type: AuthActionTypes.LOGIN_SUCCESS,
});

export const loginFailure = (error: string): AuthAction => ({
  type: AuthActionTypes.LOGIN_FAILURE,
  error,
});
