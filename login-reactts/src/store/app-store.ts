import { applyMiddleware, compose, createStore, Store } from 'redux';
import thunk from 'redux-thunk';

import { rootReducer } from './reducers/root-reducer';

declare global {
  interface Window {
    __REDUX_DEVTOOLS_EXTENSION__: () => Function;
  }
}

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
        compose(applyMiddleware(thunk)/*,
          // TODO - only add in dev mode
          window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()*/));
    }

    return AppStore.store;
  }
}
