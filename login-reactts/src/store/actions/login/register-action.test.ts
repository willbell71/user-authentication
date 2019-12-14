import * as fetchMock from 'fetch-mock';
import { Middleware, AnyAction } from 'redux';
import configureMockStore, { MockStore, MockStoreCreator } from 'redux-mock-store';
import thunk from 'redux-thunk';

import { registerAction } from './register-action';
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

describe('registerAction', () => {
  it('should call fetch', () => {
    fetchMock.postOnce('http://app.com/api/v1/register', {
      body: {
        token: 'token'
      }
    });

    const expectedActions: {type: ELoginActions, payload: {}}[] = [
      { type: ELoginActions.REGISTER, payload: { token: 'token', error: null } }
    ];    
    const store: MockStore = mockStore({ login: {}, something: {} });

    return store.dispatch(registerAction('firstName', 'lastName', 'email', 'password') as unknown as AnyAction).then(() => {
      expect(store.getActions()).toEqual(expectedActions);
    });
  });

  it('should handle response error status', () => {
    fetchMock.postOnce('http://app.com/api/v1/register', 400);

    const expectedActions: {type: ELoginActions, payload: {}}[] = [
      { type: ELoginActions.REGISTER, payload: { token: null, error: 'Failed to register' } }
    ];    
    const store: MockStore = mockStore({ login: {}, something: {} });

    return store.dispatch(registerAction('firstName', 'lastName', 'email', 'password') as unknown as AnyAction).then(() => {
      expect(store.getActions()).toEqual(expectedActions);
    });
  });

  it('should handle failure', () => {
    fetchMock.postOnce('http://app.com/api/v1/register', {
      throws: new Error('Failed')
    });

    const expectedActions: {type: ELoginActions, payload: {}}[] = [
      { type: ELoginActions.REGISTER, payload: { token: null, error: 'Failed to reach endpoint' } }
    ];    
    const store: MockStore = mockStore({ login: {}, something: {} });

    return store.dispatch(registerAction('firstName', 'lastName', 'email', 'password') as unknown as AnyAction).then(() => {
      expect(store.getActions()).toEqual(expectedActions);
    });
  });

  it('should handle bad JSON', () => {
    fetchMock.postOnce('http://app.com/api/v1/register', {
      body: '"banana: true'
    });

    const expectedActions: {}[] = [];
    const store: MockStore = mockStore({ login: {}, something: {} });

    return store.dispatch(registerAction('firstName', 'lastName', 'email', 'password') as unknown as AnyAction).then(() => {
      expect(store.getActions()).toEqual(expectedActions);
    });
  });
});
