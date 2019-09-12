import * as fetchMock from 'fetch-mock';
import configureMockStore, { MockStoreCreator } from 'redux-mock-store';
import thunk from 'redux-thunk';
import { Middleware, AnyAction } from 'redux';

import { loginAction } from './login-action';
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

describe('loginAction', () => {
  it('should call fetch', () => {
    fetchMock.postOnce('http://localhost:8080/api/v1/login', {
      body: {
        token: 'token'
      }
    });

    const expectedActions = [
      { type: ELoginActions.LOGIN, payload: { token: 'token', error: null } }
    ];    
    const store = mockStore({ login: {}, something: {} });

    return store.dispatch(loginAction('email', 'password') as unknown as AnyAction).then(() => {
      expect(store.getActions()).toEqual(expectedActions);
    });
  });

  it('should handle response error status', () => {
    fetchMock.postOnce('http://localhost:8080/api/v1/login', 400);

    const expectedActions = [
      { type: ELoginActions.LOGIN, payload: { token: null, error: 'Failed to login' } }
    ];    
    const store = mockStore({ login: {}, something: {} });

    return store.dispatch(loginAction('email', 'password') as unknown as AnyAction).then(() => {
      expect(store.getActions()).toEqual(expectedActions);
    });
  });

  it('should handle failure', () => {
    fetchMock.postOnce('http://localhost:8080/api/v1/login', {
      throws: new Error('Failed')
    });

    const expectedActions = [
      { type: ELoginActions.LOGIN, payload: { token: null, error: 'Failed to reach endpoint' } }
    ];    
    const store = mockStore({ login: {}, something: {} });

    return store.dispatch(loginAction('email', 'password') as unknown as AnyAction).then(() => {
      expect(store.getActions()).toEqual(expectedActions);
    });
  });

  it('should handle bad JSON', () => {
    fetchMock.postOnce('http://localhost:8080/api/v1/login', {
      body: '"banana: true'
    });

    const expectedActions: any[] = [];
    const store = mockStore({ login: {}, something: {} });

    return store.dispatch(loginAction('email', 'password') as unknown as AnyAction).then(() => {
      expect(store.getActions()).toEqual(expectedActions);
    });
  });
});
