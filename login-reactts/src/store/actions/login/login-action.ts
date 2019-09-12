import { Action } from '../action';
import { ELoginActions } from './elogin-actions';
import { LoginActionPayload } from './tlogin-action-payload';

/**
 * Login response.
 * @property {string} token - auth token.
 */
type LoginResponse = {
  token: string;
};

/**
 * Login action.
 * @param {string} email - email address.
 * @param {string} password - password.
 * @return {(dispatch: (action: Action<LoginActionPayload>) => void)} login action.
 */
export const loginAction = (email: string, password: string) => (dispatch: (action: Action<LoginActionPayload>) => void) => {
  // login
  return fetch('http://localhost:8080/api/v1/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify({
      email,
      password
    })
  })
    .then((res: Response) => {
      if (200 === res.status) {
        res.json()
          .then((data: LoginResponse) => {
            dispatch({
              type: ELoginActions.LOGIN,
              payload: {
                token: data.token,
                error: null
              }
            });
          })
          .catch(() => dispatch({
            type: ELoginActions.LOGIN,
            payload: {
              token: null,
              error: 'Failed to parse login response'
            }
          }));
      } else {
        dispatch({
          type: ELoginActions.LOGIN,
          payload: {
            token: null,
            error: 'Failed to login'
          }
        });
      }
    })
    .catch(() => dispatch({
      type: ELoginActions.LOGIN,
      payload: {
        token: null,
        error: 'Failed to reach endpoint'
      }
    }));
};
