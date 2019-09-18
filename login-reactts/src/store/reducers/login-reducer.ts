import { ELoginActions } from '../actions/login/elogin-actions';
import { TAction } from '../actions/taction';
import { TLoginActionPayload } from '../actions/login/tlogin-action-payload';

/**
 * Login state.
 * @property {string | null} token - auth token.
 * @property {string | null} error - error message.
 */
export type TLoginState = {
  token: string | null;
  error: string | null;
};

// initial state
const initialState: TLoginState = {
  token: null,
  error: null
};

/**
 * Reducer for login actions and state.
 * @param {TLoginState} state - previous state.
 * @param {TAction<LoginActionPayload>} action - action to update state.
 * @return {TLoginState} updated state.
 */
export const loginReducer: (state: TLoginState | undefined, action: TAction<TLoginActionPayload>) => TLoginState =
  (state: TLoginState = initialState, action: TAction<TLoginActionPayload>): TLoginState => {
    switch (action.type) {
      // login
      case ELoginActions.LOGIN:
        return {
          ...state,
          token: action.payload.token,
          error: action.payload.error
        };
      // register
      case ELoginActions.REGISTER:
        return {
          ...state,
          token: action.payload.token,
          error: action.payload.error
        };
      // logout
      case ELoginActions.LOGOUT:
        return {
          ...state,
          token: action.payload.token,
          error: action.payload.error
        };
      // unhandled
      default: return state;
    }
  };
