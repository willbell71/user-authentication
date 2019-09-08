import * as React from 'react';
import * as enzyme from 'enzyme';
import * as Adapter from 'enzyme-adapter-react-16';

import {Register} from './register';

enzyme.configure({ adapter: new Adapter() });

let wrapper: enzyme.ShallowWrapper<{}, {}, Register>;
beforeEach(() => wrapper = enzyme.shallow(<Register/>));
afterEach(() => jest.restoreAllMocks());

describe('Register', () => {
  it('should render', () => {
    const wrapper: enzyme.ShallowWrapper<{}> = enzyme.shallow(<Register/>);
    expect(wrapper.find('Header').length).toEqual(1);
    expect(wrapper.find('Header').prop('title')).toEqual('Register');
  });

  it('should render a form field for first name', () => {
    expect(wrapper.find('FormField').first().prop('name')).toEqual('firstName');
  });

  it('should set first name value', () => {
    const prop: (a: any) => void = wrapper.find('FormField').first().prop('changeInput');
    prop({
      target: {
        name: 'firstName',
        value: 'firstName'
      }
    });

    expect(wrapper.instance().state.formValues.firstName).toEqual('firstName');
  });

  it('should render a form field for last name', () => {
    expect(wrapper.find('FormField').at(1).prop('name')).toEqual('lastName');
  });

  it('should set last name value', () => {
    const prop: (a: any) => void = wrapper.find('FormField').first().prop('changeInput');
    prop({
      target: {
        name: 'lastName',
        value: 'lastName'
      }
    });

    expect(wrapper.instance().state.formValues.lastName).toEqual('lastName');
  });

  it('should render a form field for email', () => {
    expect(wrapper.find('FormField').at(2).prop('name')).toEqual('email');
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
    expect(wrapper.find('FormField').at(3).prop('name')).toEqual('password');
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

  it('should render a form field for confirm password', () => {
    expect(wrapper.find('FormField').at(4).prop('name')).toEqual('confirmPassword');
  });

  it('should set confirm password value', () => {
    const prop: (a: any) => void = wrapper.find('FormField').first().prop('changeInput');
    prop({
      target: {
        name: 'confirmPassword',
        value: 'confirmPassword'
      }
    });

    expect(wrapper.instance().state.formValues.confirmPassword).toEqual('confirmPassword');
  });

  it('should render a button for register', () => {
    expect(wrapper.find('button').text()).toEqual('Register');
  });

  it('should render an error for register state', () => {
    wrapper.setState({
      errors: {
        firstName: '',
        lastName: '',
        email: '',
        password: '',    
        confirmPassword: '',    
        register: 'register'
      }
    });
    expect(wrapper.find('p').last().text()).toEqual('register');
  });

  it('should link to login page', () => {
    expect(wrapper.find('Link').length).toEqual(1);
    expect(wrapper.find('Link').prop('to')).toEqual('/login');
  });

  describe('register', () => {
    it('should run', () => {
      const spy: jest.Mock = jest.fn();
      const event: unknown = {
        preventDefault: spy
      };
      wrapper.instance().register(event as React.MouseEvent<HTMLButtonElement, MouseEvent>);

      expect(spy).toHaveBeenCalled();
    });
  });
});
