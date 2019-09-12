import * as fetchMock from 'fetch-mock';
import configureMockStore, { MockStoreCreator } from 'redux-mock-store';
import thunk from 'redux-thunk';
import { Middleware, AnyAction } from 'redux';

import { registerAction } from './register-action';
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

describe('registerAction', () => {
  it('should call fetch', () => {
    fetchMock.postOnce('http://localhost:8080/api/v1/register', {
      body: {
        token: 'token'
      }
    });

    const expectedActions = [
      { type: ELoginActions.REGISTER, payload: { token: 'token', error: null } }
    ];    
    const store = mockStore({ login: {}, something: {} });

    return store.dispatch(registerAction('firstName', 'lastName', 'email', 'password') as unknown as AnyAction).then(() => {
      expect(store.getActions()).toEqual(expectedActions);
    });
  });

  it('should handle response error status', () => {
    fetchMock.postOnce('http://localhost:8080/api/v1/register', 400);

    const expectedActions = [
      { type: ELoginActions.REGISTER, payload: { token: null, error: 'Failed to register' } }
    ];    
    const store = mockStore({ login: {}, something: {} });

    return store.dispatch(registerAction('firstName', 'lastName', 'email', 'password') as unknown as AnyAction).then(() => {
      expect(store.getActions()).toEqual(expectedActions);
    });
  });

  it('should handle failure', () => {
    fetchMock.postOnce('http://localhost:8080/api/v1/register', {
      throws: new Error('Failed')
    });

    const expectedActions = [
      { type: ELoginActions.REGISTER, payload: { token: null, error: 'Failed to reach endpoint' } }
    ];    
    const store = mockStore({ login: {}, something: {} });

    return store.dispatch(registerAction('firstName', 'lastName', 'email', 'password') as unknown as AnyAction).then(() => {
      expect(store.getActions()).toEqual(expectedActions);
    });
  });

  it('should handle bad JSON', () => {
    fetchMock.postOnce('http://localhost:8080/api/v1/register', {
      body: '"banana: true'
    });

    const expectedActions: any[] = [];
    const store = mockStore({ login: {}, something: {} });

    return store.dispatch(registerAction('firstName', 'lastName', 'email', 'password') as unknown as AnyAction).then(() => {
      expect(store.getActions()).toEqual(expectedActions);
    });
  });
});
