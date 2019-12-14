import * as fetchMock from 'fetch-mock';
import { Middleware, AnyAction } from 'redux';
import configureMockStore, { MockStore, MockStoreCreator } from 'redux-mock-store';
import thunk from 'redux-thunk';

import { logoutAction } from './logout-action';
import { ELoginActions } from './elogin-actions';

let middlewares: [Middleware];
let mockStore: MockStoreCreator;
beforeEach(() => {
  middlewares = [thunk];
  mockStore = configureMockStore(middlewares);
});
afterEach(() => {
  jest.restoreAllMocks();
  fetchMock.restore();
});

describe('logoutAction', () => {
  it('should call fetch', () => {
    fetchMock.postOnce('http://app.com/api/v1/logout', {
      body: {}
    });

    const expectedActions: {type: ELoginActions, payload: {}}[] = [
      { type: ELoginActions.LOGOUT, payload: { token: null, error: null } }
    ];    
    const store: MockStore = mockStore({ login: {}, something: {} });

    return store.dispatch(logoutAction() as unknown as AnyAction).then(() => {
      expect(store.getActions()).toEqual(expectedActions);
    });
  });

  it('should handle response error status', () => {
    fetchMock.postOnce('http://app.com/api/v1/logout', 400);

    const expectedActions: {type: ELoginActions, payload: {}}[] = [
      { type: ELoginActions.LOGOUT, payload: { token: null, error: 'Failed to log out' } }
    ];    
    const store: MockStore = mockStore({ login: {}, something: {} });

    return store.dispatch(logoutAction() as unknown as AnyAction).then(() => {
      expect(store.getActions()).toEqual(expectedActions);
    });
  });

  it('should handle failure', () => {
    fetchMock.postOnce('http://app.com/api/v1/logout', {
      throws: new Error('Failed')
    });

    const expectedActions: {type: ELoginActions, payload: {}}[] = [
      { type: ELoginActions.LOGOUT, payload: { token: null, error: 'Failed to reach endpoint' } }
    ];    
    const store: MockStore = mockStore({ login: {}, something: {} });

    return store.dispatch(logoutAction() as unknown as AnyAction).then(() => {
      expect(store.getActions()).toEqual(expectedActions);
    });
  });
});
