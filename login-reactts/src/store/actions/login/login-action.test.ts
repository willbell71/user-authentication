import * as fetchMock from 'fetch-mock';
import { Middleware, AnyAction } from 'redux';
import thunk from 'redux-thunk';
import configureMockStore, { MockStoreCreator, MockStore } from 'redux-mock-store';

import { ELoginActions } from './elogin-actions';
import { loginAction } from './login-action';

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

describe('loginAction', () => {
  it('should call fetch', () => {
    fetchMock.postOnce('http://app.com/api/v1/login', {
      body: {
        token: 'token'
      }
    });

    const expectedActions: {type: ELoginActions, payload: {}}[] = [
      { type: ELoginActions.LOGIN, payload: { token: 'token', error: null } }
    ];    
    const store: MockStore = mockStore({ login: {}, something: {} });

    return store.dispatch(loginAction('email', 'password') as unknown as AnyAction).then(() => {
      expect(store.getActions()).toEqual(expectedActions);
    });
  });

  it('should handle response error status', () => {
    fetchMock.postOnce('http://app.com/api/v1/login', 400);

    const expectedActions: {type: ELoginActions, payload: {}}[] = [
      { type: ELoginActions.LOGIN, payload: { token: null, error: 'Failed to login' } }
    ];    
    const store: MockStore = mockStore({ login: {}, something: {} });

    return store.dispatch(loginAction('email', 'password') as unknown as AnyAction).then(() => {
      expect(store.getActions()).toEqual(expectedActions);
    });
  });

  it('should handle failure', () => {
    fetchMock.postOnce('http://app.com/api/v1/login', {
      throws: new Error('Failed')
    });

    const expectedActions: {type: ELoginActions, payload: {}}[] = [
      { type: ELoginActions.LOGIN, payload: { token: null, error: 'Failed to reach endpoint' } }
    ];    
    const store: MockStore = mockStore({ login: {}, something: {} });

    return store.dispatch(loginAction('email', 'password') as unknown as AnyAction).then(() => {
      expect(store.getActions()).toEqual(expectedActions);
    });
  });

  it('should handle bad JSON', () => {
    fetchMock.postOnce('http://app.com/api/v1/login', {
      body: '"banana: true'
    });

    const expectedActions: {}[] = [];
    const store: MockStore = mockStore({ login: {}, something: {} });

    return store.dispatch(loginAction('email', 'password') as unknown as AnyAction).then(() => {
      expect(store.getActions()).toEqual(expectedActions);
    });
  });
});
