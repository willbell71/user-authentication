import * as React from 'react';
import { AnyAction, Dispatch } from 'redux';
import * as enzyme from 'enzyme';
import * as Adapter from 'enzyme-adapter-react-16';

import { DashboardComponent, mapDispatchToProps, mapStateToProps, TProps } from './dashboard';
import { TAction } from '../../store/actions/taction';
import { TLoginActionPayload } from '../../store/actions/login/tlogin-action-payload';
import { TLoginState } from '../../store/reducers/login-reducer';
import { TSomethingActionPayload } from '../../store/actions/something/tsomething-action-payload';
import { TSomethingState } from '../../store/reducers/something-reducer';

enzyme.configure({ adapter: new Adapter() });

let props: TProps;
let wrapper: enzyme.ShallowWrapper<{}, {}, DashboardComponent>;
beforeEach(() => {
  props = {
    actions: {
      logout: jest.fn(),
      getSomething: jest.fn()
    },
    login: {
      token: null,
      error: null
    },
    something: {
      title: null,
      body: null
    }
  };
  wrapper = enzyme.shallow(<DashboardComponent {...props}/>);
});
afterEach(() => jest.restoreAllMocks());

describe('Dashboard', () => {
  it('should render', () => {
    expect(wrapper.find('Header').length).toEqual(1);
    expect(wrapper.find('Header').prop('title')).toEqual('Dashboard');
  });

  it('should map state to props', () => {
    const state: {login: TLoginState, something: TSomethingState} = mapStateToProps({
      login: {
        token: 'token',
        error: 'error'
      },
      something: {
        title: 'title',
        body: 'body'
      }
    });

    expect(state.login.token).toEqual('token');
    expect(state.login.error).toEqual('error');
    expect(state.something.title).toEqual('title');
    expect(state.something.body).toEqual('body');
  });

  it('should map dispatch to props', () => {
    const map: {
      actions: {
        logout: () => (dispatch: (action: TAction<TLoginActionPayload>) => void) => Promise<void>,
        getSomething: () => (dispatch: (action: TAction<TSomethingActionPayload>) => void) => Promise<void>
      }
    } = mapDispatchToProps('func' as unknown as Dispatch<AnyAction>);

    expect(map.actions.logout).toBeTruthy();
    expect(map.actions.getSomething).toBeTruthy();
  });

  it('should have a button that calls getSomething', () => {
    expect(wrapper.find('button').first().prop('onClick')).toEqual(wrapper.instance().getSomething);
  });

  it('should have a Unavailable that renders state title', () => {
    wrapper.setProps({
      something: {
        title: 'title',
        body: null  
      }
    });

    expect(wrapper.find('Unavailable').first().prop('value')).toEqual('title');
  });

  it('should have a Unavailable that renders state body', () => {
    wrapper.setProps({
      something: {
        title: null,
        body: 'body'
      }
    });

    expect(wrapper.find('Unavailable').at(1).prop('value')).toEqual('body');
  });

  it('should have a button that calls logout', () => {
    expect(wrapper.find('button').at(1).prop('onClick')).toEqual(wrapper.instance().logout);
  });

  describe('getSomething', () => {
    it('should run', () => {
      wrapper.instance().getSomething();

      expect(props.actions.getSomething).toHaveBeenCalled();
    });
  });

  describe('logout', () => {
    it('should run', () => {
      wrapper.instance().logout();

      expect(props.actions.logout).toHaveBeenCalled();
    });
  });
});
