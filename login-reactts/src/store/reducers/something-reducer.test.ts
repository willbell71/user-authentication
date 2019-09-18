import { somethingReducer, TSomethingState } from './something-reducer';

import { ESomethingActions } from '../actions/something/esomething-action';
import { TAction } from '../actions/taction';
import { TSomethingActionPayload } from '../actions/something/tsomething-action-payload';

describe('something reducer', () => {
  it('should return the initial state', () => {
    const action: TAction<TSomethingActionPayload> = {
      type: '',
      payload: {
        title: null,
        body: null
      }
    };

    expect(somethingReducer(undefined as unknown as TSomethingState, action)).toEqual({
      title: null,
      body: null
    });
  });

  it('should handle GET', () => {
    const action: TAction<TSomethingActionPayload> = {
      type: ESomethingActions.GET,
      payload: {
        title: 'title',
        body: 'body'
      }
    };

    expect(somethingReducer(undefined as unknown as TSomethingState, action)).toEqual({
      title: 'title',
      body: 'body'
    });
  });
});
