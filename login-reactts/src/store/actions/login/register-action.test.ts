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
  jest.clearAllMocks();
});

describe('registerAction', () => {
  let globalFetch: (input: RequestInfo) => Promise<Response>;

  beforeEach(() => {
    globalFetch = global.fetch;
  });

  afterEach(() => {
    global.fetch = globalFetch;
  });

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
      { type: ELoginActions.REGISTER, payload: { token: 'token', error: null } }
    ];    
    const store: MockStore = mockStore({ login: {}, something: {} });

    await store.dispatch(registerAction('firstName', 'lastName', 'email', 'password') as unknown as AnyAction);
    expect(store.getActions()).toEqual(expectedActions);
  });

  it('should handle response error status', async () => {
    global.fetch = jest.fn().mockImplementation(() => {
      return Promise.resolve<any>({
        status: 400
      });
    });

    const expectedActions: {type: ELoginActions, payload: {}}[] = [
      { type: ELoginActions.REGISTER, payload: { token: null, error: 'Failed to register' } }
    ];    
    const store: MockStore = mockStore({ login: {}, something: {} });

    await store.dispatch(registerAction('firstName', 'lastName', 'email', 'password') as unknown as AnyAction);
    expect(store.getActions()).toEqual(expectedActions);
  });

  it('should handle failure', async () => {
    global.fetch = jest.fn().mockImplementation(() => {
      throw new Error('Failed');
    });

    const expectedActions: {type: ELoginActions, payload: {}}[] = [
      { type: ELoginActions.REGISTER, payload: { token: null, error: 'Failed to reach endpoint' } }
    ];    
    const store: MockStore = mockStore({ login: {}, something: {} });

    await store.dispatch(registerAction('firstName', 'lastName', 'email', 'password') as unknown as AnyAction);

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
      { type: ELoginActions.REGISTER, payload: { token: undefined, error: null } }
    ];    
    const store: MockStore = mockStore({ login: {}, something: {} });

    await store.dispatch(registerAction('firstName', 'lastName', 'email', 'password') as unknown as AnyAction);
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
      { type: ELoginActions.REGISTER, payload: { token: null, error: 'Failed to parse register response' } }
    ];    
    const store: MockStore = mockStore({ login: {}, something: {} });

    await store.dispatch(registerAction('firstName', 'lastName', 'email', 'password') as unknown as AnyAction);
    expect(store.getActions()).toEqual(expectedActions);
  });
});
