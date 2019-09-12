import { Action } from '../action';
import { ELoginActions } from './elogin-actions';
import { LoginActionPayload } from './tlogin-action-payload';

/**
 * Register response.
 * @property {string} token - auth token.
 */
type RegisterResponse = {
  token: string;
};

/**
 * Register a new user.
 * @param {string} firstName - users first name.
 * @param {string} lastName - users last name.
 * @param {string} email - users email address.
 * @param {string} password - users password.
 * @return {(dispatch: (action: Action<LoginActionPayload>) => void)} register action.
 */
export const registerAction = (firstName: string, lastName: string, email: string, password: string) => (dispatch: (action: Action<LoginActionPayload>) => void) => {
  // login
  return fetch('http://localhost:8080/api/v1/register', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify({
      firstName,
      lastName,
      email,
      password
    })
  })
    .then((res: Response) => {
      if (200 === res.status) {
        res.json()
          .then((data: RegisterResponse) => dispatch({
            type: ELoginActions.REGISTER,
            payload: {
              token: data.token,
              error: null
            }
          }))
          .catch(() => dispatch({
            type: ELoginActions.REGISTER,
            payload: {
              token: null,
              error: 'Failed to parse register response'
            }
          }));
      } else {
        dispatch({
          type: ELoginActions.REGISTER,
          payload: {
            token: null,
            error: 'Failed to register'
          }
        });
      }
    })
    .catch(() => dispatch({
      type: ELoginActions.REGISTER,
      payload: {
        token: null,
        error: 'Failed to reach endpoint'
      }
    }));
};
