import { applyMiddleware, compose, createStore, Store } from 'redux';
import thunk from 'redux-thunk';

import { rootReducer } from './reducers/root-reducer';
import { TLoginState } from './reducers/login-reducer';
import { TSomethingState } from './reducers/something-reducer';

declare global {
  interface Window {
    __REDUX_DEVTOOLS_EXTENSION__: () => Function;
  }
}

/**
 * Store
 * @property {TLoginState} login - login state.
 * @property {TSomethingState} something - something state.
 */
export type TStore = {
  login: TLoginState,
  something: TSomethingState,
};

export class AppStore {
  // store instance
  private static store: Store;

  /**
   * Create store if doesn't exist, else create it.
   * @return {Store} store instance.
   */
  public static getStore(): Store {
    if (!AppStore.store) {
      AppStore.store = createStore(rootReducer,
        compose(applyMiddleware(thunk),
          // TODO - only add in dev mode
          window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()));
    }

    return AppStore.store;
  }
}
