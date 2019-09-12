import { somethingReducer } from './something-reducer';

import { Action } from '../actions/action';
import { SomethingActionPayload } from '../actions/something/tsomething-action-payload';
import { ESomethingActions } from '../actions/something/esomething-action';

describe('something reducer', () => {
  it('should return the initial state', () => {
    const action: Action<SomethingActionPayload> = {
      type: '',
      payload: {
        title: null,
        body: null
      }
    };

    expect(somethingReducer(undefined, action)).toEqual({
      title: null,
      body: null
    });
  });

  it('should handle GET', () => {
    const action: Action<SomethingActionPayload> = {
      type: ESomethingActions.GET,
      payload: {
        title: 'title',
        body: 'body'
      }
    };

    expect(somethingReducer(undefined, action)).toEqual({
      title: 'title',
      body: 'body'
    });
  });
});
