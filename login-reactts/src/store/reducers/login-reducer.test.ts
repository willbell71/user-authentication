import { loginReducer } from './login-reducer';

import { Action } from '../actions/action';
import { LoginActionPayload } from '../actions/login/tlogin-action-payload';
import { ELoginActions } from '../actions/login/elogin-actions';

describe('login reducer', () => {
  it('should return the initial state', () => {
    const action: Action<LoginActionPayload> = {
      type: '',
      payload: {
        token: null,
        error: null
      }
    };

    expect(loginReducer(undefined, action)).toEqual({
      token: null,
      error: null
    });
  });

  it('should handle LOGIN', () => {
    const action: Action<LoginActionPayload> = {
      type: ELoginActions.LOGIN,
      payload: {
        token: 'token',
        error: null
      }
    };

    expect(loginReducer(undefined, action)).toEqual({
      token: 'token',
      error: null
    });
  });

  it('should handle REGISTER', () => {
    const action: Action<LoginActionPayload> = {
      type: ELoginActions.REGISTER,
      payload: {
        token: 'token',
        error: null
      }
    };

    expect(loginReducer(undefined, action)).toEqual({
      token: 'token',
      error: null
    });
  });

  it('should handle LOGOUT', () => {
    const action: Action<LoginActionPayload> = {
      type: ELoginActions.LOGOUT,
      payload: {
        token: null,
        error: null
      }
    };

    expect(loginReducer(undefined, action)).toEqual({
      token: null,
      error: null
    });
  });
});
