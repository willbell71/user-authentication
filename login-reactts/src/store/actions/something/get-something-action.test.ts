import { Middleware, AnyAction } from 'redux';
import configureMockStore, { MockStore, MockStoreCreator } from 'redux-mock-store';
import thunk from 'redux-thunk';

import { ESomethingActions } from './esomething-action';
import { getSomethingAction } from './get-something-action';

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

describe('getSomethingAction', () => {
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
          title: 'title',
          body: 'body'
        }),
        status: 200
      });
    });

    const expectedActions: {type: ESomethingActions, payload: {}}[] = [
      { type: ESomethingActions.GET, payload: { title: 'title', body: 'body' } }
    ];    
    const store: MockStore = mockStore({ login: {}, something: {} });

    await store.dispatch(getSomethingAction() as unknown as AnyAction);
    expect(store.getActions()).toEqual(expectedActions);
  });

  it('should handle response error status', async () => {
    global.fetch = jest.fn().mockImplementation(() => {
      return Promise.resolve<any>({
        status: 400
      });
    });

    const expectedActions: {type: ESomethingActions, payload: {}}[] = [
      { type: ESomethingActions.GET, payload: { title: null, body: null } }
    ];    
    const store: MockStore = mockStore({ login: {}, something: {} });

    await store.dispatch(getSomethingAction() as unknown as AnyAction);
    expect(store.getActions()).toEqual(expectedActions);
  });

  it('should handle failure', async () => {
    global.fetch = jest.fn().mockImplementation(() => {
      throw new Error('Failed');
    });

    const expectedActions: {type: ESomethingActions, payload: {}}[] = [
      { type: ESomethingActions.GET, payload: { title: null, body: null } }
    ];    
    const store: MockStore = mockStore({ login: {}, something: {} });

    await store.dispatch(getSomethingAction() as unknown as AnyAction);
    expect(store.getActions()).toEqual(expectedActions);
  });

  it('should handle bad JSON', async () => {
    global.fetch = jest.fn().mockImplementation(() => {
      return Promise.resolve<any>({
        json: () => Promise.resolve({
          body: '"banana: true'
        }),
        status: 200
      });
    });

    const expectedActions: {type: ESomethingActions, payload: {}}[] = [
      { type: ESomethingActions.GET, payload: { title: undefined, body: '"banana: true' } }
    ];    
    const store: MockStore = mockStore({ login: {}, something: {} });

    await store.dispatch(getSomethingAction() as unknown as AnyAction);
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

    const expectedActions: {type: ESomethingActions, payload: {}}[] = [
      { type: ESomethingActions.GET, payload: { title: null, body: null } }
    ];    
    const store: MockStore = mockStore({ login: {}, something: {} });

    await store.dispatch(getSomethingAction() as unknown as AnyAction);
    expect(store.getActions()).toEqual(expectedActions);
  });
});
