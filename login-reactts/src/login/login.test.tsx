import * as React from 'react';
import * as enzyme from 'enzyme';
import * as Adapter from 'enzyme-adapter-react-16';

import { Login} from './login';

enzyme.configure({ adapter: new Adapter() });

let wrapper: enzyme.ShallowWrapper<{}, {}, Login>;
beforeEach(() => wrapper = enzyme.shallow(<Login/>));
afterEach(() => jest.restoreAllMocks());

describe('Login', () => {
  it('should render', () => {
    expect(wrapper.find('Header').length).toEqual(1);
    expect(wrapper.find('Header').prop('title')).toEqual('Login');
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
    wrapper.setState({
      errors: {
        email: '',
        password: '',    
        login: 'login'
      }
    });
    expect(wrapper.find('p').last().text()).toEqual('login');
  });

  it('should link to register page', () => {
    expect(wrapper.find('Link').length).toEqual(1);
    expect(wrapper.find('Link').prop('to')).toEqual('/register');
  });

  describe('login', () => {
    it('should run', () => {
      const spy: jest.Mock = jest.fn();
      const event: unknown = {
        preventDefault: spy
      };
      wrapper.instance().login(event as React.MouseEvent<HTMLButtonElement, MouseEvent>);

      expect(spy).toHaveBeenCalled();
    });
  });
});
