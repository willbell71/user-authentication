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
  jest.clearAllMocks();
});

describe('loginAction', () => {
  it('should call fetch', async () => {
    global.fetch = jest.fn().mockImplementation(() => {
      return Promise.resolve<any>({
        json: () => Promise.resolve({
          token: 'token'
        }),
        status: 200
      });
    });

    const expectedActions: {type: ELoginActions, payload: {}}[] = [
      { type: ELoginActions.LOGIN, payload: { token: 'token', error: null } }
    ];    
    const store: MockStore = mockStore({ login: {}, something: {} });

    await store.dispatch(loginAction('email', 'password') as unknown as AnyAction);
    expect(store.getActions()).toEqual(expectedActions);
  });

  it('should handle response error status', async () => {
    global.fetch = jest.fn().mockImplementation(() => {
      return Promise.resolve<any>({
        status: 400
      });
    });

    const expectedActions: {type: ELoginActions, payload: {}}[] = [
      { type: ELoginActions.LOGIN, payload: { token: null, error: 'Failed to login' } }
    ];    
    const store: MockStore = mockStore({ login: {}, something: {} });

    await store.dispatch(loginAction('email', 'password') as unknown as AnyAction);
    expect(store.getActions()).toEqual(expectedActions);
  });

  it('should handle failure', async () => {
    global.fetch = jest.fn().mockImplementation(() => {
      throw new Error('Failed');
    });

    const expectedActions: {type: ELoginActions, payload: {}}[] = [
      { type: ELoginActions.LOGIN, payload: { token: null, error: 'Failed to reach endpoint' } }
    ];    
    const store: MockStore = mockStore({ login: {}, something: {} });

    await store.dispatch(loginAction('email', 'password') as unknown as AnyAction);
    expect(store.getActions()).toEqual(expectedActions);
  });

  it('should handle bad JSON', async () => {
    global.fetch = jest.fn().mockImplementation(() => {
      return Promise.resolve<any>({
        json: () => Promise.resolve({
          banana: true
        }),
        status: 200
      });
    });

    const expectedActions: {type: ELoginActions, payload: {}}[] = [
      { type: ELoginActions.LOGIN, payload: { token: undefined, error: null } }
    ];    
    const store: MockStore = mockStore({ login: {}, something: {} });

    await store.dispatch(loginAction('email', 'password') as unknown as AnyAction);
    expect(store.getActions()).toEqual(expectedActions);
  });

  it('should handle failing to parse JSON', async () => {
    global.fetch = jest.fn().mockImplementation(() => {
      return Promise.resolve<any>({
        json: () => {
          throw new Error('Failed');
        },
        status: 200
      });
    });

    const expectedActions: {type: ELoginActions, payload: {}}[] = [
      { type: ELoginActions.LOGIN, payload: { token: null, error: 'Failed to parse login response' } }
    ];    
    const store: MockStore = mockStore({ login: {}, something: {} });

    await store.dispatch(loginAction('email', 'password') as unknown as AnyAction);
    expect(store.getActions()).toEqual(expectedActions);
  });
});
