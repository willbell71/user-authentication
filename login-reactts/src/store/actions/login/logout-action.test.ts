import * as fetchMock from 'fetch-mock';
import configureMockStore, { MockStoreCreator } from 'redux-mock-store';
import thunk from 'redux-thunk';
import { Middleware, AnyAction } from 'redux';

import { logoutAction } from './logout-action';
import { ELoginActions } from './elogin-actions';

let middlewares: [Middleware];
let mockStore: MockStoreCreator;
beforeEach(() => {
  middlewares = [thunk];
  mockStore = configureMockStore(middlewares)  
});
afterEach(() => {
  jest.restoreAllMocks();
  fetchMock.restore();
});

describe('logoutAction', () => {
  it('should call fetch', () => {
    fetchMock.postOnce('http://localhost:8080/api/v1/logout', {
      body: {}
    });

    const expectedActions = [
      { type: ELoginActions.LOGOUT, payload: { token: null, error: null } }
    ];    
    const store = mockStore({ login: {}, something: {} });

    return store.dispatch(logoutAction() as unknown as AnyAction).then(() => {
      expect(store.getActions()).toEqual(expectedActions);
    });
  });

  it('should handle response error status', () => {
    fetchMock.postOnce('http://localhost:8080/api/v1/logout', 400);

    const expectedActions = [
      { type: ELoginActions.LOGOUT, payload: { token: null, error: 'Failed to log out' } }
    ];    
    const store = mockStore({ login: {}, something: {} });

    return store.dispatch(logoutAction() as unknown as AnyAction).then(() => {
      expect(store.getActions()).toEqual(expectedActions);
    });
  });

  it('should handle failure', () => {
    fetchMock.postOnce('http://localhost:8080/api/v1/logout', {
      throws: new Error('Failed')
    });

    const expectedActions = [
      { type: ELoginActions.LOGOUT, payload: { token: null, error: 'Failed to reach endpoint' } }
    ];    
    const store = mockStore({ login: {}, something: {} });

    return store.dispatch(logoutAction() as unknown as AnyAction).then(() => {
      expect(store.getActions()).toEqual(expectedActions);
    });
  });
});
