import { ESomethingActions } from '../actions/something/esomething-action';
import { TAction } from '../actions/taction';
import { TSomethingActionPayload } from '../actions/something/tsomething-action-payload';

/**
 * Something state.
 * @property {string | null} title - content title.
 * @property {string | null} body - content body.
 */
export type TSomethingState = {
  title: string | null;
  body: string | null;
};

// initial state
const initialState: TSomethingState = {
  title: null,
  body: null
};

/**
 * Reducer for something actions and state.
 * @param {SomethingState} state - previous state.
 * @param {Action} action - action to update state.
 * @return {SomethingState} updated state.
 */
export const somethingReducer: (state: TSomethingState | undefined, action: TAction<TSomethingActionPayload>) => TSomethingState =
  (state: TSomethingState = initialState, action: TAction<TSomethingActionPayload>): TSomethingState => {
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
