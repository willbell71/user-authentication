import redux from 'redux';

import { AppStore } from './app-store';

jest.mock('redux', () => {
  const reduxRequire: any = jest.requireActual('redux');
  
  return {
    createStore: jest.fn().mockImplementation(() => 'store'),
    compose: () => {},
    applyMiddleware: () => {},
    Store: reduxRequire.Store,
    combineReducers: () => {}
  };
});

afterEach(() => jest.clearAllMocks());

describe('AppStore', () => {
  it('should return store', () => {
    const store: redux.Store = AppStore.getStore();
    expect(redux.createStore).toHaveBeenCalledTimes(1);
    expect(store).toEqual('store');
  });

  it('should only create store first time', () => {
    const store: redux.Store = AppStore.getStore();
    expect(redux.createStore).toHaveBeenCalledTimes(0);
    expect(store).toEqual('store');
  });
});
