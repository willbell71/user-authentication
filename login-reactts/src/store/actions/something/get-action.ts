import { Action } from '../action';
import { ESomethingActions } from './esomething-action';
import { SomethingActionPayload } from './tsomething-action-payload';
import { AppStore } from '../../app-store';

/**
 * Something response.
 * @property {string} title - content title.
 * @property {string} body - content body.
 */
type SomethingResponse = {
  title: string;
  body: string;
};

/**
 * Something action.
 * @return {(dispatch: (action: Action<SomethingActionPayload>) => void)} get something action.
 */
export const getSomethingAction = () => (dispatch: (action: Action<SomethingActionPayload>) => void) => {
  // get
  return fetch('http://localhost:8080/api/v1/getsomething', {
    headers: {
      'Accept': 'application/json',
      'Authorization': `Bearer ${AppStore.getStore().getState().login.token}`
    }
  })
    .then((res: Response) => {
      if (200 === res.status) {
        res.json()
          .then((data: SomethingResponse) => {
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
