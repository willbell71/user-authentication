import * as React from 'react';
import * as enzyme from 'enzyme';
import * as Adapter from 'enzyme-adapter-react-16';
import { AnyAction, Dispatch } from 'redux';

import { mapDispatchToProps, mapStateToProps, Props, RegisterComponent } from './register';
import { LoginState } from '../../store/reducers/login-reducer';
import { Action } from '../../store/actions/action';
import { LoginActionPayload } from '../../store/actions/login/tlogin-action-payload';

enzyme.configure({ adapter: new Adapter() });

let props: Props;
let wrapper: enzyme.ShallowWrapper<{}, {}, RegisterComponent>;
beforeEach(() => {
  props = {
    actions: {
      register: jest.fn()
    },
    login: {
      token: null,
      error: null
    },
    validator: () => true
  };
  wrapper = enzyme.shallow(<RegisterComponent {...props}/>);
});
afterEach(() => jest.restoreAllMocks());

describe('Register', () => {
  it('should render', () => {
    expect(wrapper.find('Header').length).toEqual(1);
    expect(wrapper.find('Header').prop('title')).toEqual('Register');
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
    const map: {actions: {register: (firstName: string, lastName: string, email: string, password: string) =>
      (dispatch: (action: Action<LoginActionPayload>) => void) => Promise<any> }} =
      mapDispatchToProps('func' as unknown as Dispatch<AnyAction>);
    expect(map.actions.register).toBeTruthy();
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
    wrapper.setProps({
      login: {
        token: null,
        error: 'register'
      }
    });
    expect(wrapper.find('p').last().text()).toEqual('register');
  });

  it('should link to login page', () => {
    expect(wrapper.find('Link').length).toEqual(1);
    expect(wrapper.find('Link').prop('to')).toEqual('/login');
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

  describe('register', () => {
    it('should call preventDefault', () => {
      const spy: jest.Mock = jest.fn();
      const event: unknown = {
        preventDefault: spy
      };

      wrapper.instance().register(event as React.MouseEvent<HTMLButtonElement, MouseEvent>);

      expect(spy).toHaveBeenCalled();
    });

    it('should fail first name validation if no value', () => {
      const event: unknown = {
        preventDefault: jest.fn()
      };

      wrapper.setProps({
        validator: (validationRules: any[], values: any, errorMsgs: any): boolean => {
          const valid: boolean = validationRules[0].validator('');
          if (!valid) errorMsgs.firstName = 'error';
          return valid;
        }
      });
  
      wrapper.instance().register(event as React.MouseEvent<HTMLButtonElement, MouseEvent>);

      expect(wrapper.instance().state.errors.firstName).toEqual('error');
    });

    it('should pass first name validation for a valid first name', () => {
      const event: unknown = {
        preventDefault: jest.fn()
      };

      wrapper.setProps({
        validator: (validationRules: any[], values: any, errorMsgs: any): boolean => {
          const valid: boolean = validationRules[0].validator('aaaaaa');
          if (valid) errorMsgs.firstName = 'success';
          return false;
        }
      });
  
      wrapper.instance().register(event as React.MouseEvent<HTMLButtonElement, MouseEvent>);

      expect(wrapper.instance().state.errors.firstName).toEqual('success');
    });    

    it('should fail last name validation if no value', () => {
      const event: unknown = {
        preventDefault: jest.fn()
      };

      wrapper.setProps({
        validator: (validationRules: any[], values: any, errorMsgs: any): boolean => {
          const valid: boolean = validationRules[1].validator('');
          if (!valid) errorMsgs.lastName = 'error';
          return valid;
        }
      });
  
      wrapper.instance().register(event as React.MouseEvent<HTMLButtonElement, MouseEvent>);

      expect(wrapper.instance().state.errors.lastName).toEqual('error');
    });

    it('should pass last name validation for a valid last name', () => {
      const event: unknown = {
        preventDefault: jest.fn()
      };

      wrapper.setProps({
        validator: (validationRules: any[], values: any, errorMsgs: any): boolean => {
          const valid: boolean = validationRules[1].validator('aaaaaa');
          if (valid) errorMsgs.lastName = 'success';
          return false;
        }
      });
  
      wrapper.instance().register(event as React.MouseEvent<HTMLButtonElement, MouseEvent>);

      expect(wrapper.instance().state.errors.lastName).toEqual('success');
    });    

    it('should fail email validation if too short', () => {
      const event: unknown = {
        preventDefault: jest.fn()
      };

      wrapper.setProps({
        validator: (validationRules: any[], values: any, errorMsgs: any): boolean => {
          const valid: boolean = validationRules[2].validator('a');
          if (!valid) errorMsgs.email = 'error';
          return valid;
        }
      });
  
      wrapper.instance().register(event as React.MouseEvent<HTMLButtonElement, MouseEvent>);

      expect(wrapper.instance().state.errors.email).toEqual('error');
    });

    it('should fail email validation if no @', () => {
      const event: unknown = {
        preventDefault: jest.fn()
      };

      wrapper.setProps({
        validator: (validationRules: any[], values: any, errorMsgs: any): boolean => {
          const valid: boolean = validationRules[2].validator('aaaaaa');
          if (!valid) errorMsgs.email = 'error';
          return valid;
        }
      });
  
      wrapper.instance().register(event as React.MouseEvent<HTMLButtonElement, MouseEvent>);

      expect(wrapper.instance().state.errors.email).toEqual('error');
    });

    it('should pass email validation for a valid email', () => {
      const event: unknown = {
        preventDefault: jest.fn()
      };

      wrapper.setProps({
        validator: (validationRules: any[], values: any, errorMsgs: any): boolean => {
          const valid: boolean = validationRules[2].validator('aaa@aaa');
          if (valid) errorMsgs.email = 'success';
          return false;
        }
      });
  
      wrapper.instance().register(event as React.MouseEvent<HTMLButtonElement, MouseEvent>);

      expect(wrapper.instance().state.errors.email).toEqual('success');
    });

    it('should fail password validation if no value', () => {
      const event: unknown = {
        preventDefault: jest.fn()
      };

      wrapper.setProps({
        validator: (validationRules: any[], values: any, errorMsgs: any): boolean => {
          const valid: boolean = validationRules[3].validator('');
          if (!valid) errorMsgs.password = 'error';
          return valid;
        }
      });
  
      wrapper.instance().register(event as React.MouseEvent<HTMLButtonElement, MouseEvent>);

      expect(wrapper.instance().state.errors.password).toEqual('error');
    });

    it('should fail password validation if value not long enough', () => {
      const event: unknown = {
        preventDefault: jest.fn()
      };

      wrapper.setProps({
        validator: (validationRules: any[], values: any, errorMsgs: any): boolean => {
          const valid: boolean = validationRules[4].validator('aaa');
          if (!valid) errorMsgs.password = 'error';
          return valid;
        }
      });
  
      wrapper.instance().register(event as React.MouseEvent<HTMLButtonElement, MouseEvent>);

      expect(wrapper.instance().state.errors.password).toEqual('error');
    });

    it('should pass password validation for a valid password', () => {
      const event: unknown = {
        preventDefault: jest.fn()
      };

      wrapper.setProps({
        validator: (validationRules: any[], values: any, errorMsgs: any): boolean => {
          const valid: boolean = validationRules[3].validator('aaaaaa');
          if (valid) errorMsgs.password = 'success';
          return false;
        }
      });
  
      wrapper.instance().register(event as React.MouseEvent<HTMLButtonElement, MouseEvent>);

      expect(wrapper.instance().state.errors.password).toEqual('success');
    });

    it('should pass password validation for a valid password', () => {
      const event: unknown = {
        preventDefault: jest.fn()
      };

      wrapper.setProps({
        validator: (validationRules: any[], values: any, errorMsgs: any): boolean => {
          const valid: boolean = validationRules[4].validator('aaaaaa');
          if (valid) errorMsgs.password = 'success';
          return false;
        }
      });
  
      wrapper.instance().register(event as React.MouseEvent<HTMLButtonElement, MouseEvent>);

      expect(wrapper.instance().state.errors.password).toEqual('success');
    });

    it('should fail confirm password validation if password dont match', () => {
      const event: unknown = {
        preventDefault: jest.fn()
      };

      wrapper.instance().setState({
        formValues: {
          firstName: '',
          lastName: '',
          email: '',
          password: '123456',
          confirmPassword: ''
        }
      });
      wrapper.setProps({
        validator: (validationRules: any[], values: any, errorMsgs: any): boolean => {
          const valid: boolean = validationRules[5].validator('aaaaaa');
          if (!valid) errorMsgs.confirmPassword = 'error';
          return valid;
        }
      });
  
      wrapper.instance().register(event as React.MouseEvent<HTMLButtonElement, MouseEvent>);

      expect(wrapper.instance().state.errors.confirmPassword).toEqual('error');
    });

    it('should pass confirm password validation for matching passwords', () => {
      const event: unknown = {
        preventDefault: jest.fn()
      };

      wrapper.instance().setState({
        formValues: {
          firstName: '',
          lastName: '',
          email: '',
          password: '123456',
          confirmPassword: ''
        }
      });
      wrapper.setProps({
        validator: (validationRules: any[], values: any, errorMsgs: any): boolean => {
          const valid: boolean = validationRules[5].validator('123456');
          if (valid) errorMsgs.confirmPassword = 'success';
          return false;
        }
      });
  
      wrapper.instance().register(event as React.MouseEvent<HTMLButtonElement, MouseEvent>);

      expect(wrapper.instance().state.errors.confirmPassword).toEqual('success');
    });

  });
});
