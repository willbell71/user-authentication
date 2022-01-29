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
  jest.clearAllMocks();
});

jest.mock('../../app-store', () => ({
  AppStore: {
    getStore: () => ({
      getState: () => ({
        login: {
          token: 'token'
        }
      })
    })
  }
}));

describe('logoutAction', () => {
  it('should call fetch', async () => {
    global.fetch = jest.fn().mockImplementation(() => {
      return Promise.resolve<any>({
        json: () => Promise.resolve({}),
        status: 200
      });
    });

    const expectedActions: {type: ELoginActions, payload: {}}[] = [
      { type: ELoginActions.LOGOUT, payload: { token: null, error: null } }
    ];    
    const store: MockStore = mockStore({ login: {}, something: {} });

    await store.dispatch(logoutAction() as unknown as AnyAction);
    expect(store.getActions()).toEqual(expectedActions);
  });

  it('should handle response error status', async () => {
    global.fetch = jest.fn().mockImplementation(() => {
      return Promise.resolve<any>({
        status: 400
      });
    });

    const expectedActions: {type: ELoginActions, payload: {}}[] = [
      { type: ELoginActions.LOGOUT, payload: { token: null, error: 'Failed to log out' } }
    ];    
    const store: MockStore = mockStore({ login: {}, something: {} });

    await store.dispatch(logoutAction() as unknown as AnyAction);
    expect(store.getActions()).toEqual(expectedActions);
  });

  it('should handle failure', async () => {
    global.fetch = jest.fn().mockImplementation(() => {
      throw new Error('Failed');
    });

    const expectedActions: {type: ELoginActions, payload: {}}[] = [
      { type: ELoginActions.LOGOUT, payload: { token: null, error: 'Failed to reach endpoint' } }
    ];    
    const store: MockStore = mockStore({ login: {}, something: {} });

    await store.dispatch(logoutAction() as unknown as AnyAction);
    expect(store.getActions()).toEqual(expectedActions);
  });
});
