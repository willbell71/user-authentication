import * as React from 'react';
import * as enzyme from 'enzyme';
import * as Adapter from 'enzyme-adapter-react-16';
import { AnyAction, Dispatch } from 'redux';

import { LoginComponent, mapDispatchToProps, mapStateToProps, Props } from './login';
import { LoginState } from '../../store/reducers/login-reducer';
import { Action } from '../../store/actions/action';
import { LoginActionPayload } from '../../store/actions/login/tlogin-action-payload';

enzyme.configure({ adapter: new Adapter() });

let props: Props;
let wrapper: enzyme.ShallowWrapper<{}, {}, LoginComponent>;
beforeEach(() => {
  props = {
    actions: {
      login: jest.fn()
    },
    login: {
      token: null,
      error: null
    }
  };
  wrapper = enzyme.shallow(<LoginComponent {...props}/>);
});
afterEach(() => jest.restoreAllMocks());

describe('Login', () => {
  it('should render', () => {
    expect(wrapper.find('Header').length).toEqual(1);
    expect(wrapper.find('Header').prop('title')).toEqual('Login');
  });

  it('should map state to props', () => {
    const state: {login: LoginState} = mapStateToProps({
      login: {
        token: 'token',
        error: 'error'
      }
    });

    expect(state.login.token).toEqual('token');
    expect(state.login.error).toEqual('error');
  });

  it('should map dispatch to props', () => {
    const map: {actions: {login: (email: string, password: string) =>
      (dispatch: (action: Action<LoginActionPayload>) => void) => Promise<any> }} =
      mapDispatchToProps('func' as unknown as Dispatch<AnyAction>);
    expect(map.actions.login).toBeTruthy();
  });

  it('should render a form field for email', () => {
    expect(wrapper.find('FormField').first().prop('name')).toEqual('email');
  });

  it('should set email value', () => {
    const prop: (a: any) => void = wrapper.find('FormField').first().prop('changeInput');
    prop({
      target: {
        name: 'email',
        value: 'email'
      }
    });

    expect(wrapper.instance().state.formValues.email).toEqual('email');
  });

  it('should render a form field for password', () => {
    expect(wrapper.find('FormField').at(1).prop('name')).toEqual('password');
  });

  it('should set password value', () => {
    const prop: (a: any) => void = wrapper.find('FormField').first().prop('changeInput');
    prop({
      target: {
        name: 'password',
        value: 'password'
      }
    });

    expect(wrapper.instance().state.formValues.password).toEqual('password');
  });

  it('should render a button for login', () => {
    expect(wrapper.find('button').text()).toEqual('Login');
  });

  it('should render an error for login state', () => {
    wrapper.setProps({
      login: {
        token: null,
        error: 'login'
      }
    });
    expect(wrapper.find('p').last().text()).toEqual('login');
  });

  it('should link to register page', () => {
    expect(wrapper.find('Link').length).toEqual(1);
    expect(wrapper.find('Link').prop('to')).toEqual('/register');
  });

  it('should render a redirect when logged in', () => {
    wrapper.setProps({
      login: {
        token: 'token',
        error: null
      }
    });

    expect(wrapper.find('Redirect').length).toEqual(1);
  });

  it('should redirect to dashboard on logged in', () => {
    wrapper.setProps({
      login: {
        token: 'token',
        error: null
      }
    });

    expect(wrapper.find('Redirect').length).toEqual(1);
    expect(wrapper.find('Redirect').first().prop('to')).toEqual('/');
  });

  describe('login', () => {
    it('should call preventDefault', () => {
      const spy: jest.Mock = jest.fn();
      const event: unknown = {
        preventDefault: spy
      };

      wrapper.instance().login(event as React.MouseEvent<HTMLButtonElement, MouseEvent>);

      expect(spy).toHaveBeenCalled();
    });
  });
});
