import { ESomethingActions } from '../actions/something/esomething-action';
import { Action } from '../actions/action';
import { SomethingActionPayload } from '../actions/something/tsomething-action-payload';

/**
 * Something state.
 * @property {string | null} title - content title.
 * @property {string | null} body - content body.
 */
export type SomethingState = {
  title: string | null;
  body: string | null;
};

// initial state
const initialState: SomethingState = {
  title: null,
  body: null
};

/**
 * Reducer for something actions and state.
 * @param {SomethingState} state - previous state.
 * @param {Action} action - action to update state.
 * @return {SomethingState} updated state.
 */
export const somethingReducer = (state: SomethingState = initialState, action: Action<SomethingActionPayload>): SomethingState => {
  switch (action.type) {
    // get
    case ESomethingActions.GET:
      return {
        ...state,
        title: action.payload.title,
        body: action.payload.body
      };
    // unhandled
    default: return state;
  }
};
