import { AppStore } from '../../app-store';
import { ESomethingActions } from './esomething-action';
import { TAction } from '../taction';
import { TSomethingActionPayload } from './tsomething-action-payload';

/**
 * Something response.
 * @property {string} title - content title.
 * @property {string} body - content body.
 */
type TSomethingResponse = {
  title: string;
  body: string;
};

/**
 * Something action.
 * @return {(dispatch: (action: Action<SomethingActionPayload>) => void)} get something action.
 */
export const getSomethingAction: () => (dispatch: (action: TAction<TSomethingActionPayload>) => void) => Promise<void> =
  () => (dispatch: (action: TAction<TSomethingActionPayload>) => void): Promise<void> => {
    // get
    return fetch('http://app.com/api/v1/getsomething', {
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${AppStore.getStore().getState().login.token}`
      }
    })
      .then((res: Response) => {
        if (200 === res.status) {
          res.json()
            .then((data: TSomethingResponse) => {
              dispatch({
                type: ESomethingActions.GET,
                payload: {
                  title: data.title,
                  body: data.body
                }
              });
            })
            .catch(() => dispatch({
              type: ESomethingActions.GET,
              payload: {
                title: null,
                body: null
              }
            }));
        } else {
          dispatch({
            type: ESomethingActions.GET,
            payload: {
              title: null,
              body: null
            }
          });
        }
      })
      .catch(() => dispatch({
        type: ESomethingActions.GET,
        payload: {
          title: null,
          body: null
        }
      }));
  };
