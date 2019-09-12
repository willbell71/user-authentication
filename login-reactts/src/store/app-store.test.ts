import * as redux from 'redux';
import { AppStore } from "./app-store";

afterEach(() => jest.restoreAllMocks());

describe('AppStore', () => {
  it('should return store', () => {
    jest.spyOn(redux, 'createStore').mockImplementation(() => 'store' as unknown as redux.Store);

    const store: redux.Store = AppStore.getStore();
    expect(redux.createStore).toHaveBeenCalledTimes(1);
    expect(store).toEqual('store');
  });

  it('should only create store first time', () => {
    jest.spyOn(redux, 'createStore').mockImplementation(() => 'store' as unknown as redux.Store);

    const store: redux.Store = AppStore.getStore();
    expect(redux.createStore).toHaveBeenCalledTimes(0);
    expect(store).toEqual('store');
  });
});
