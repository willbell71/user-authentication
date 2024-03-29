import { ELoginActions } from './elogin-actions';
import { TAction } from '../taction';
import { TLoginActionPayload } from './tlogin-action-payload';

/**
 * Register response.
 * @property {string} token - auth token.
 */
type TRegisterResponse = {
  token: string;
};

/**
 * Register a new user.
 * @param {string} firstName - users first name.
 * @param {string} lastName - users last name.
 * @param {string} email - users email address.
 * @param {string} password - users password.
 * @return {(dispatch: (action: TAction<TLoginActionPayload>) => void)} register action.
 */
export const registerAction: (firstName: string, lastName: string, email: string, password: string) =>
  (dispatch: (action: TAction<TLoginActionPayload>) => void) => Promise<void> =
  (firstName: string, lastName: string, email: string, password: string) =>
    async (dispatch: (action: TAction<TLoginActionPayload>) => void): Promise<void> => {
      // register
      try {
        const res: Response = await fetch('http://app.com/api/v1/register', {
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
        });

        if (200 === res.status) {
          try {
            const data: TRegisterResponse = await res.json();
            dispatch({
              type: ELoginActions.REGISTER,
              payload: {
                token: data.token,
                error: null
              }
            });
          } catch {
            dispatch({
              type: ELoginActions.REGISTER,
              payload: {
                token: null,
                error: 'Failed to parse register response'
              }
            });
          }
        } else {
          dispatch({
            type: ELoginActions.REGISTER,
            payload: {
              token: null,
              error: 'Failed to register'
            }
          });
        }
      } catch {
        dispatch({
          type: ELoginActions.REGISTER,
          payload: {
            token: null,
            error: 'Failed to reach endpoint'
          }
        });
      }
    };
