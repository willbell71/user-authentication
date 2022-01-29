import React from 'react';
import { act, create, ReactTestInstance, ReactTestRenderer } from 'react-test-renderer';

import { Login, TProps } from './login';
import { TFormValidationRule } from '../../tform-validation-rule';

const navigate: jest.Mock = jest.fn();
jest.mock('react-router-dom', () => ({
  useNavigate: () => navigate,
  Link: () => (<></>)
}));

jest.mock('react-redux', () => ({
  useDispatch: () => jest.fn(),
  useSelector: (cb: (store: any) => any) => {
    return cb({
      login: {
        token: 'token',
        error: 'error'
      }
    });
  }
}));

let props: TProps;
let renderer: ReactTestRenderer;
let instance: ReactTestInstance;
beforeEach(async () => {
  props = {
    validator: () => true
  };

  await act(async () => {
    renderer = create(
      <Login {...props} />
    );
  });

  instance = renderer.root;
});

afterEach(() => jest.clearAllMocks());

describe('Login', () => {
  it('should render', () => {
    expect(instance).toBeTruthy();
  });

  it('should render a form field for email', () => {
    const email: ReactTestInstance = instance.findByProps({ 'data-testid': 'email' });

    expect(email.props.name).toEqual('email');
  });

  it('should set email value', async () => {
    const email: ReactTestInstance = instance.findByProps({ 'data-testid': 'email' });

    await act(async () => email.props.changeInput({
      target: {
        name: 'email',
        value: 'email'
      }
    }));

    expect(email.props.value).toEqual('email');
  });

  it('should render a form field for password', () => {
    const password: ReactTestInstance = instance.findByProps({ 'data-testid': 'password' });

    expect(password.props.name).toEqual('password');
  });

  it('should set password value', async () => {
    const password: ReactTestInstance = instance.findByProps({ 'data-testid': 'password' });

    await act(async () => password.props.changeInput({
      target: {
        name: 'password',
        value: 'password'
      }
    }));

    expect(password.props.value).toEqual('password');
  });

  it('should render a button for login', () => {
    const button: ReactTestInstance = instance.findByProps({ 'data-testid': 'login' });

    expect(button.props.children).toEqual('Login');
  });

  it('should render an error for login state', async () => {
    const errMsg: ReactTestInstance = instance.findByProps({ 'data-testid': 'login-error' });

    expect(errMsg.props.children).toEqual('error');
  });

  it('should link to register page', () => {
    const link: ReactTestInstance = instance.findByProps({ 'data-testid': 'register' });

    expect(link.props.children).toEqual('Register');
  });

  it('should redirect when logged in', () => {
    expect(navigate).toBeCalledTimes(1);
    expect(navigate).toBeCalledWith('/');
  });

  describe('login', () => {
    it('should call preventDefault', async () => {
      const spy: jest.Mock = jest.fn();
      const event: unknown = {
        preventDefault: spy
      };

      const login: ReactTestInstance = instance.findByProps({ 'data-testid': 'login' });
      await act(async () => login.props.onClick(event));

      expect(spy).toHaveBeenCalled();
    });

    it('should fail email validation if too short', async () => {
      const event: unknown = {
        preventDefault: jest.fn()
      };

      const errMsg: string = 'email error';

      props = {
        validator: (validationRules: TFormValidationRule[],
          values: {[key: string]: string}, errorMsgs: {[key: string]: string}): boolean => {
          const valid: boolean = validationRules[0].validator('a');
          if (!valid) errorMsgs.email = errMsg;
          return valid;
        }
      };

      await act(async () => renderer.update(
        <Login {...props} />
      ));

      const login: ReactTestInstance = instance.findByProps({ 'data-testid': 'login' });
      await act(async () => login.props.onClick(event));

      const email: ReactTestInstance = instance.findByProps({ 'data-testid': 'email' });
      expect(email.props.error).toEqual(errMsg);
    });

    it('should fail email validation if no @', async () => {
      const event: unknown = {
        preventDefault: jest.fn()
      };

      const errMsg: string = 'email error';

      props = {
        validator: (validationRules: TFormValidationRule[],
          values: {[key: string]: string}, errorMsgs: {[key: string]: string}): boolean => {
          const valid: boolean = validationRules[0].validator('aaaaaa');
          if (!valid) errorMsgs.email = errMsg;
          return valid;
        }
      };

      await act(async () => renderer.update(
        <Login {...props} />
      ));

      const login: ReactTestInstance = instance.findByProps({ 'data-testid': 'login' });
      await act(async () => login.props.onClick(event));

      const email: ReactTestInstance = instance.findByProps({ 'data-testid': 'email' });
      expect(email.props.error).toEqual(errMsg);
    });

    it('should pass email validation for a valid email', async () => {
      const event: unknown = {
        preventDefault: jest.fn()
      };

      const successMsg: string = 'success';

      props = {
        validator: (validationRules: TFormValidationRule[],
          values: {[key: string]: string}, errorMsgs: {[key: string]: string}): boolean => {
          const valid: boolean = validationRules[0].validator('aaa@aaa');
          if (valid) errorMsgs.email = successMsg;
          return false;
        }
      };

      await act(async () => renderer.update(
        <Login {...props} />
      ));

      const login: ReactTestInstance = instance.findByProps({ 'data-testid': 'login' });
      await act(async () => login.props.onClick(event));

      const email: ReactTestInstance = instance.findByProps({ 'data-testid': 'email' });
      expect(email.props.error).toEqual(successMsg);
    });

    it('should fail password validation if no value', async () => {
      const event: unknown = {
        preventDefault: jest.fn()
      };

      const errMsg: string = 'password error';

      props = {
        validator: (validationRules: TFormValidationRule[],
          values: {[key: string]: string}, errorMsgs: {[key: string]: string}): boolean => {
          const valid: boolean = validationRules[1].validator('');
          if (!valid) errorMsgs.password = errMsg;
          return valid;
        }
      };

      await act(async () => renderer.update(
        <Login {...props} />
      ));

      const login: ReactTestInstance = instance.findByProps({ 'data-testid': 'login' });
      await act(async () => login.props.onClick(event));

      const password: ReactTestInstance = instance.findByProps({ 'data-testid': 'password' });
      expect(password.props.error).toEqual(errMsg);
    });

    it('should pass password validation for a valid password', async () => {
      const event: unknown = {
        preventDefault: jest.fn()
      };

      const successMsg: string = 'success';

      props = {
        validator: (validationRules: TFormValidationRule[],
          values: {[key: string]: string}, errorMsgs: {[key: string]: string}): boolean => {
          const valid: boolean = validationRules[1].validator('aaaaaa');
          if (valid) errorMsgs.password = successMsg;
          return false;
        }
      };

      await act(async () => renderer.update(
        <Login {...props} />
      ));

      const login: ReactTestInstance = instance.findByProps({ 'data-testid': 'login' });
      await act(async () => login.props.onClick(event));

      const password: ReactTestInstance = instance.findByProps({ 'data-testid': 'password' });
      expect(password.props.error).toEqual(successMsg);
    });
  });
});
