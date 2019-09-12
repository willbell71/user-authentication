import { ELoginActions } from '../actions/login/elogin-actions';
import { Action } from '../actions/action';
import { LoginActionPayload } from '../actions/login/tlogin-action-payload';

/**
 * Login state.
 * @property {boolean} loggedIn - logged in state.
 * @property {string | null} token - auth token.
 * @property {string | null} error - error message.
 */
export type LoginState = {
  token: string | null;
  error: string | null;
};

// initial state
const initialState: LoginState = {
  token: null,
  error: null
};

/**
 * Reducer for login actions and state.
 * @param {LoginState} state - previous state.
 * @param {Action<LoginActionPayload>} action - action to update state.
 * @return {LoginState} updated state.
 */
export const loginReducer = (state: LoginState = initialState, action: Action<LoginActionPayload>): LoginState => {
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
