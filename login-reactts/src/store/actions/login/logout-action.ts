import { AppStore } from '../../app-store';
import { ELoginActions } from './elogin-actions';
import { TLoginActionPayload } from './tlogin-action-payload';
import { TAction } from '../taction';

/**
 * Fetch posts action ( async ).
 * @return {(dispatch: (action: Action<LoginActionPayload>) => void)} logout action.
 */
export const logoutAction: () => (dispatch: (action: TAction<TLoginActionPayload>) => void) => Promise<void> =
  () => async (dispatch: (action: TAction<TLoginActionPayload>) => void): Promise<void> => {
    try {
      // log out
      const res: Response = await fetch('http://app.com/api/v1/logout', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${AppStore.getStore().getState().login.token}`
        }
      });
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
    } catch {
      dispatch({
        type: ELoginActions.LOGOUT,
        payload: {
          token: null,
          error: 'Failed to reach endpoint'
        }
      });
    }
  };
