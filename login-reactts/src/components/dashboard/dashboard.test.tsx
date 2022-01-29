import React from 'react';
import { act, create, ReactTestInstance, ReactTestRenderer } from 'react-test-renderer';

import { Dashboard } from './dashboard';

jest.mock('react-router-dom', () => ({
  useNavigate: () => jest.fn()
}));

const dispatch: jest.Mock = jest.fn();
jest.mock('react-redux', () => ({
  useDispatch: () => dispatch,
  useSelector: (cb: (store: any) => any) => {
    return cb({
      login: {
        // token: 'token'
      },
      something: {
        title: 'title',
        body: 'body'
      }
    });
  }
}));

let renderer: ReactTestRenderer;
let instance: ReactTestInstance;
beforeEach(async () => {
  await act(async () => {
    renderer = create(
      <Dashboard />
    );
  });

  instance = renderer.root;
});

afterEach(() => jest.clearAllMocks());

describe('Dashboard', () => {
  it('should render', () => {
    expect(instance).toBeTruthy();
  });

  it('should have a button that calls getSomething', () => {
    const button: ReactTestInstance = instance.findByProps({ 'data-testid': 'getsomething' });

    expect(button.props.children).toEqual('Get Something');
  });

  it('should have a Unavailable that renders state title', () => {
    const title: ReactTestInstance = instance.findByProps({ 'data-testid': 'unavailable-title' });

    expect(title.props.value).toEqual('title');
  });

  it('should have a Unavailable that renders state body', () => {
    const body: ReactTestInstance = instance.findByProps({ 'data-testid': 'unavailable-body' });

    expect(body.props.value).toEqual('body');
  });

  it('should have a button that calls logout', () => {
    const button: ReactTestInstance = instance.findByProps({ 'data-testid': 'logout' });

    expect(button.props.children).toEqual('Logout');
  });

  describe('getSomething', () => {
    it('should run', async () => {
      const button: ReactTestInstance = instance.findByProps({ 'data-testid': 'getsomething' });

      await act(async () => button.props.onClick());
  
      expect(dispatch).toHaveBeenCalledTimes(1);
    });
  });

  describe('logout', () => {
    it('should run', async () => {
      const button: ReactTestInstance = instance.findByProps({ 'data-testid': 'logout' });

      await act(async () => button.props.onClick());

      expect(dispatch).toHaveBeenCalledTimes(1);
    });
  });
});
