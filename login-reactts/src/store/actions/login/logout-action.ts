import { Action } from '../action';
import { ELoginActions } from './elogin-actions';
import { LoginActionPayload } from './tlogin-action-payload';
import { AppStore } from '../../app-store';

/**
 * Fetch posts action ( async ).
 * @return {(dispatch: (action: Action<LoginActionPayload>) => void)} logout action.
 */
export const logoutAction = () => (dispatch: (action: Action<LoginActionPayload>) => void) => {
  // log out
  return fetch('http://localhost:8080/api/v1/logout', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${AppStore.getStore().getState().login.token}`
    }
  })
  .then((res: Response) => {
    if (200 === res.status) {
      dispatch({
        type: ELoginActions.LOGOUT,
        payload: {
          token: null,
          error: null
        }
      });
    } else {
      dispatch({
        type: ELoginActions.LOGOUT,
        payload: {
          token: null,
          error: 'Failed to log out'
        }
      });
    }
  })
  .catch(() => dispatch({
    type: ELoginActions.LOGOUT,
    payload: {
      token: null,
      error: 'Failed to reach endpoint'
    }
  }));
};
