import * as fetchMock from 'fetch-mock';
import configureMockStore, { MockStoreCreator } from 'redux-mock-store';
import thunk from 'redux-thunk';
import { Middleware, AnyAction } from 'redux';

import { getSomethingAction } from './get-action';
import { ESomethingActions } from './esomething-action';

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

describe('getSomethingAction', () => {
  it('should call fetch', () => {
    fetchMock.getOnce('http://localhost:8080/api/v1/getsomething', {
      body: {
        title: 'title',
        body: 'body'
      }
    });

    const expectedActions = [
      { type: ESomethingActions.GET, payload: { title: 'title', body: 'body' } }
    ];    
    const store = mockStore({ login: {}, something: {} });

    return store.dispatch(getSomethingAction() as unknown as AnyAction).then(() => {
      expect(store.getActions()).toEqual(expectedActions);
    });
  });

  it('should handle response error status', () => {
    fetchMock.getOnce('http://localhost:8080/api/v1/getsomething', 400);

    const expectedActions = [
      { type: ESomethingActions.GET, payload: { title: null, body: null } }
    ];    
    const store = mockStore({ login: {}, something: {} });

    return store.dispatch(getSomethingAction() as unknown as AnyAction).then(() => {
      expect(store.getActions()).toEqual(expectedActions);
    });
  });

  it('should handle failure', () => {
    fetchMock.getOnce('http://localhost:8080/api/v1/getsomething', {
      throws: new Error('Failed')
    });

    const expectedActions = [
      { type: ESomethingActions.GET, payload: { title: null, body: null } }
    ];    
    const store = mockStore({ login: {}, something: {} });

    return store.dispatch(getSomethingAction() as unknown as AnyAction).then(() => {
      expect(store.getActions()).toEqual(expectedActions);
    });
  });

  it('should handle bad JSON', () => {
    fetchMock.getOnce('http://localhost:8080/api/v1/getsomething', {
      body: '"banana: true'
    });

    const expectedActions: any = [];    
    const store = mockStore({ login: {}, something: {} });

    return store.dispatch(getSomethingAction() as unknown as AnyAction).then(() => {
      expect(store.getActions()).toEqual(expectedActions);
    });
  });
});
