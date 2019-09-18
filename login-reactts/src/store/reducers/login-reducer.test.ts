import { loginReducer, TLoginState } from './login-reducer';

import { ELoginActions } from '../actions/login/elogin-actions';
import { TAction } from '../actions/taction';
import { TLoginActionPayload } from '../actions/login/tlogin-action-payload';

describe('login reducer', () => {
  it('should return the initial state', () => {
    const action: TAction<TLoginActionPayload> = {
      type: '',
      payload: {
        token: null,
        error: null
      }
    };

    expect(loginReducer(undefined as unknown as TLoginState, action)).toEqual({
      token: null,
      error: null
    });
  });

  it('should handle LOGIN', () => {
    const action: TAction<TLoginActionPayload> = {
      type: ELoginActions.LOGIN,
      payload: {
        token: 'token',
        error: null
      }
    };

    expect(loginReducer(undefined as unknown as TLoginState, action)).toEqual({
      token: 'token',
      error: null
    });
  });

  it('should handle REGISTER', () => {
    const action: TAction<TLoginActionPayload> = {
      type: ELoginActions.REGISTER,
      payload: {
        token: 'token',
        error: null
      }
    };

    expect(loginReducer(undefined as unknown as TLoginState, action)).toEqual({
      token: 'token',
      error: null
    });
  });

  it('should handle LOGOUT', () => {
    const action: TAction<TLoginActionPayload> = {
      type: ELoginActions.LOGOUT,
      payload: {
        token: null,
        error: null
      }
    };

    expect(loginReducer(undefined as unknown as TLoginState, action)).toEqual({
      token: null,
      error: null
    });
  });
});
