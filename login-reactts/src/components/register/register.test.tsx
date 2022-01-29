import React from 'react';
import { act, create, ReactTestInstance, ReactTestRenderer } from 'react-test-renderer';

import { Register, TProps } from './register';
import { TFormValidationRule } from '../../tform-validation-rule';

const navigate: jest.Mock = jest.fn();
jest.mock('react-router-dom', () => ({
  useNavigate: () => navigate,
  Link: () => (<></>)
}));

const token: string = 'token';
let error: string = '';
jest.mock('react-redux', () => ({
  useDispatch: () => jest.fn(),
  useSelector: (cb: (store: any) => any) => {
    return cb({
      login: {
        token,
        error
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
      <Register {...props} />
    );
  });

  instance = renderer.root;
});

afterEach(() => jest.clearAllMocks());

describe('Register', () => {
  it('should render', () => {
    expect(instance).toBeTruthy();
  });

  it('should render a form field for first name', () => {
    const name: ReactTestInstance = instance.findByProps({ 'data-testid': 'firstName' });

    expect(name.props.name).toEqual('firstName');
  });

  it('should set first name value', async () => {
    const name: ReactTestInstance = instance.findByProps({ 'data-testid': 'firstName' });

    await act(async () => name.props.changeInput({
      target: {
        name: 'firstName',
        value: 'firstName'
      }
    }));

    expect(name.props.value).toEqual('firstName');
  });

  it('should render a form field for last name', () => {
    const name: ReactTestInstance = instance.findByProps({ 'data-testid': 'lastName' });

    expect(name.props.name).toEqual('lastName');
  });

  it('should set last name value', async () => {
    const name: ReactTestInstance = instance.findByProps({ 'data-testid': 'lastName' });

    await act(async () => name.props.changeInput({
      target: {
        name: 'lastName',
        value: 'lastName'
      }
    }));

    expect(name.props.value).toEqual('lastName');
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

  it('should render a form field for confirm password', () => {
    const password: ReactTestInstance = instance.findByProps({ 'data-testid': 'confirmPassword' });

    expect(password.props.name).toEqual('confirmPassword');
  });

  it('should set confirm password value', async () => {
    const confirmPassword: ReactTestInstance = instance.findByProps({ 'data-testid': 'confirmPassword' });

    await act(async () => confirmPassword.props.changeInput({
      target: {
        name: 'confirmPassword',
        value: 'confirmPassword'
      }
    }));

    expect(confirmPassword.props.value).toEqual('confirmPassword');
  });

  it('should render a button for register', () => {
    const button: ReactTestInstance = instance.findByProps({ 'data-testid': 'register' });

    expect(button.props.children).toEqual('Register');
  });

  it('should render an error for register state', async () => {
    error = 'register';

    await act(async () => renderer.update(
      <Register {...props} />
    ));

    const errMsg: ReactTestInstance = instance.findByProps({ 'data-testid': 'register-error' });
    expect(errMsg.props.children).toEqual('register');
  });

  it('should link to login page', () => {
    const login: ReactTestInstance = instance.findByProps({ 'data-testid': 'login' });
    expect(login.props.children).toEqual('Login');
  });

  it('should redirect to dashboard on logged in', () => {
    expect(navigate).toBeCalledTimes(1);
    expect(navigate).toBeCalledWith('/');
  });

  describe('register', () => {
    it('should call preventDefault', async () => {
      const spy: jest.Mock = jest.fn();
      const event: unknown = {
        preventDefault: spy
      };

      const register: ReactTestInstance = instance.findByProps({ 'data-testid': 'register' });

      await act(async () => register.props.onClick(event));

      expect(spy).toHaveBeenCalled();
    });

    it('should fail first name validation if no value', async () => {
      const event: unknown = {
        preventDefault: jest.fn()
      };

      const errMsg: string = 'first name error';

      props = {
        validator: (
          validationRules: TFormValidationRule[],
          values: {[key: string]: string},
          errorMsgs: {[key: string]: string}
        ): boolean => {
          const valid: boolean = validationRules[0].validator('');
          if (!valid) errorMsgs.firstName = errMsg;
          return valid;
        }
      };

      await act(async () => renderer.update(
        <Register {...props} />
      ));

      const register: ReactTestInstance = instance.findByProps({ 'data-testid': 'register' });
      await act(async () => register.props.onClick(event));

      const firstName: ReactTestInstance = instance.findByProps({ 'data-testid': 'firstName' });
      expect(firstName.props.error).toEqual(errMsg);
    });

    it('should pass first name validation for a valid first name', async () => {
      const event: unknown = {
        preventDefault: jest.fn()
      };

      const successMsg: string = 'success';

      props = {
        validator: (validationRules: TFormValidationRule[],
          values: {[key: string]: string}, errorMsgs: {[key: string]: string}): boolean => {
          const valid: boolean = validationRules[0].validator('aaaaaa');
          if (valid) errorMsgs.firstName = successMsg;
          return false;
        }
      };

      await act(async () => renderer.update(
        <Register {...props} />
      ));

      const register: ReactTestInstance = instance.findByProps({ 'data-testid': 'register' });
      await act(async () => register.props.onClick(event));

      const firstName: ReactTestInstance = instance.findByProps({ 'data-testid': 'firstName' });
      expect(firstName.props.error).toEqual(successMsg);
    });

    it('should fail last name validation if no value', async () => {
      const event: unknown = {
        preventDefault: jest.fn()
      };

      const errMsg: string = 'last name error';

      props = {
        validator: (validationRules: TFormValidationRule[],
          values: {[key: string]: string}, errorMsgs: {[key: string]: string}): boolean => {
          const valid: boolean = validationRules[1].validator('');
          if (!valid) errorMsgs.lastName = errMsg;
          return valid;
        }
      };

      await act(async () => renderer.update(
        <Register {...props} />
      ));

      const register: ReactTestInstance = instance.findByProps({ 'data-testid': 'register' });
      await act(async () => register.props.onClick(event));

      const lastName: ReactTestInstance = instance.findByProps({ 'data-testid': 'lastName' });
      expect(lastName.props.error).toEqual(errMsg);
    });

    it('should pass last name validation for a valid last name', async () => {
      const event: unknown = {
        preventDefault: jest.fn()
      };

      const successMsg: string = 'success';

      props = {
        validator: (validationRules: TFormValidationRule[],
          values: {[key: string]: string}, errorMsgs: {[key: string]: string}): boolean => {
          const valid: boolean = validationRules[1].validator('aaaaaa');
          if (valid) errorMsgs.lastName = successMsg;
          return false;
        }
      };

      await act(async () => renderer.update(
        <Register {...props} />
      ));

      const register: ReactTestInstance = instance.findByProps({ 'data-testid': 'register' });
      await act(async () => register.props.onClick(event));

      const lastName: ReactTestInstance = instance.findByProps({ 'data-testid': 'lastName' });
      expect(lastName.props.error).toEqual(successMsg);
    });

    it('should fail email validation if too short', async () => {
      const event: unknown = {
        preventDefault: jest.fn()
      };

      const errMsg: string = 'email error';

      props = {
        validator: (validationRules: TFormValidationRule[],
          values: {[key: string]: string}, errorMsgs: {[key: string]: string}): boolean => {
          const valid: boolean = validationRules[2].validator('a');
          if (!valid) errorMsgs.email = errMsg;
          return valid;
        }
      };

      await act(async () => renderer.update(
        <Register {...props} />
      ));

      const register: ReactTestInstance = instance.findByProps({ 'data-testid': 'register' });
      await act(async () => register.props.onClick(event));

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
          const valid: boolean = validationRules[2].validator('aaaaaa');
          if (!valid) errorMsgs.email = errMsg;
          return valid;
        }
      };

      await act(async () => renderer.update(
        <Register {...props} />
      ));

      const register: ReactTestInstance = instance.findByProps({ 'data-testid': 'register' });
      await act(async () => register.props.onClick(event));

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
          const valid: boolean = validationRules[2].validator('aaa@aaa');
          if (valid) errorMsgs.email = successMsg;
          return false;
        }
      };

      await act(async () => renderer.update(
        <Register {...props} />
      ));

      const register: ReactTestInstance = instance.findByProps({ 'data-testid': 'register' });
      await act(async () => register.props.onClick(event));

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
          const valid: boolean = validationRules[3].validator('');
          if (!valid) errorMsgs.password = errMsg;
          return valid;
        }
      };

      await act(async () => renderer.update(
        <Register {...props} />
      ));

      const register: ReactTestInstance = instance.findByProps({ 'data-testid': 'register' });
      await act(async () => register.props.onClick(event));

      const password: ReactTestInstance = instance.findByProps({ 'data-testid': 'password' });
      expect(password.props.error).toEqual(errMsg);
    });

    it('should fail password validation if value not long enough', async () => {
      const event: unknown = {
        preventDefault: jest.fn()
      };

      const errMsg: string = 'password error';

      props = {
        validator: (validationRules: TFormValidationRule[],
          values: {[key: string]: string}, errorMsgs: {[key: string]: string}): boolean => {
          const valid: boolean = validationRules[4].validator('aaa');
          if (!valid) errorMsgs.password = errMsg;
          return valid;
        }
      };

      await act(async () => renderer.update(
        <Register {...props} />
      ));

      const register: ReactTestInstance = instance.findByProps({ 'data-testid': 'register' });
      await act(async () => register.props.onClick(event));

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
          const valid: boolean = validationRules[3].validator('aaaaaa');
          if (valid) errorMsgs.password = successMsg;
          return false;
        }
      };

      await act(async () => renderer.update(
        <Register {...props} />
      ));

      const register: ReactTestInstance = instance.findByProps({ 'data-testid': 'register' });
      await act(async () => register.props.onClick(event));

      const password: ReactTestInstance = instance.findByProps({ 'data-testid': 'password' });
      expect(password.props.error).toEqual(successMsg);
    });

    it('should pass password validation for a valid password', async () => {
      const event: unknown = {
        preventDefault: jest.fn()
      };

      const successMsg: string = 'success';

      props = {
        validator: (validationRules: TFormValidationRule[],
          values: {[key: string]: string}, errorMsgs: {[key: string]: string}): boolean => {
          const valid: boolean = validationRules[4].validator('aaaaaa');
          if (valid) errorMsgs.password = successMsg;
          return false;
        }
      };

      await act(async () => renderer.update(
        <Register {...props} />
      ));

      const register: ReactTestInstance = instance.findByProps({ 'data-testid': 'register' });
      await act(async () => register.props.onClick(event));

      const password: ReactTestInstance = instance.findByProps({ 'data-testid': 'password' });
      expect(password.props.error).toEqual(successMsg);
    });

    it('should fail confirm password validation if password dont match', async () => {
      const event: unknown = {
        preventDefault: jest.fn()
      };

      const errMsg: string = 'password error';

      props = {
        validator: (validationRules: TFormValidationRule[],
          values: {[key: string]: string}, errorMsgs: {[key: string]: string}): boolean => {
          const valid: boolean = validationRules[5].validator('aaaaaa');
          if (!valid) errorMsgs.confirmPassword = errMsg;
          return valid;
        }
      };

      await act(async () => renderer.update(
        <Register {...props} />
      ));

      const password: ReactTestInstance = instance.findByProps({ 'data-testid': 'password' });
      await act(async () => password.props.changeInput({
        target: {
          name: 'password',
          value: '123456'
        }
      }));

      const register: ReactTestInstance = instance.findByProps({ 'data-testid': 'register' });
      await act(async () => register.props.onClick(event));

      const confirmPassword: ReactTestInstance = instance.findByProps({ 'data-testid': 'confirmPassword' });
      expect(confirmPassword.props.error).toEqual(errMsg);
    });

    it('should pass confirm password validation for matching passwords', async () => {
      const event: unknown = {
        preventDefault: jest.fn()
      };

      const successMsg: string = 'success';

      props = {
        validator: (validationRules: TFormValidationRule[],
          values: {[key: string]: string}, errorMsgs: {[key: string]: string}): boolean => {
          const valid: boolean = validationRules[5].validator('123456');
          if (valid) errorMsgs.confirmPassword = successMsg;
          return false;
        }
      };

      await act(async () => renderer.update(
        <Register {...props} />
      ));

      const password: ReactTestInstance = instance.findByProps({ 'data-testid': 'password' });
      await act(async () => password.props.changeInput({
        target: {
          name: 'password',
          value: '123456'
        }
      }));

      const register: ReactTestInstance = instance.findByProps({ 'data-testid': 'register' });
      await act(async () => register.props.onClick(event));

      const confirmPassword: ReactTestInstance = instance.findByProps({ 'data-testid': 'confirmPassword' });
      expect(confirmPassword.props.error).toEqual(successMsg);
    });
  });
});
