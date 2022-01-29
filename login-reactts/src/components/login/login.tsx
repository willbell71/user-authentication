import React, { Dispatch, FC, useCallback, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, NavigateFunction, useNavigate } from 'react-router-dom';

import { FormField } from '../shared/form-field/form-field';
import { Header } from '../shared/header/header';
import { loginAction } from '../../store/actions/login/login-action';
import { TFormValidationRule } from '../../tform-validation-rule';
import { TLoginState } from '../../store/reducers/login-reducer';

import './styles.scss';
import { TStore } from '../../store/app-store';

/**
 * Login error messages.
 * @property {string} email - email field error message.
 * @property {string} password - passwor field error message.
 */
type TLoginErrorMessages = {
  email: string;
  password: string;
};

/**
 * Field properties.
 * @property {string} label - field label caption.
 * @property {string} id - input field id.
 * @property {string} type - input field type (text or password).
 * @property {string} name- input field name.
 * @property {string} value - input field value.
 * @property {string} error - error feedback.
 * @property {string} testid - input test id.
 */
type TField = {
  label: string,
  id: string,
  type: 'text' | 'password',
  name: string,
  value: string,
  error: string,
  testid: string
};

/**
 * Component properties.
 * @property {(validationRules: FormValidationRule[], values: any, errorMsgs: any) => boolean} validator - form field validator.
 */
export type TProps = {
  validator: (validationRules: TFormValidationRule[], values: {[key: string]: string}, errorMsgs: {[key: string]: string}) => boolean
};

/**
 * Form values.
 * @property {string} email - form email field value.
 * @property {string} password - form password field value.
 */
type TFormValues = {
  email: string;
  password: string;
};

/**
 * Login component render.
 * @return {JSX.Element} render.
 */
export const Login: FC<TProps> = ({ validator }: TProps): JSX.Element => {
  const navigate: NavigateFunction = useNavigate();
  const dispatch: Dispatch<unknown> = useDispatch();

  const [formValues, setFormValues]: [TFormValues, (values: TFormValues|((value: TFormValues) => TFormValues)) => void] =
    useState<TFormValues>({
      email: '',
      password: ''
    });
  const [errors, setErrors]: [TLoginErrorMessages, (errors: TLoginErrorMessages) => void] = useState<TLoginErrorMessages>({
    email: '',
    password: ''
  });

  const { login }: { login: TLoginState } = useSelector((store: TStore) => store);

  /**
   * Change input field value.
   * @param {React.ChangeEvent<HTMLInputElement>} event - event that fired change.
   * @return {void}
   */
  const changeInput: (event: React.ChangeEvent<HTMLInputElement>) => void =
    useCallback((event: React.ChangeEvent<HTMLInputElement>): void => {
      const fieldName: string = event.target.name;
      const value: string = event.target.value;
      setFormValues((values: TFormValues): TFormValues => ({
        ...values,
        [fieldName]: value
      }));
    }, []);

  /**
   * Validate form values.
   * @return {LoginErrorMessages | undefined} returns error messages for form or nothing if form values passes validation.
   */
  const validateForm: () => TLoginErrorMessages|undefined = useCallback((): TLoginErrorMessages | undefined => {
    const loginErrors: TLoginErrorMessages = {
      email: '',
      password: ''
    };

    const validationRules: TFormValidationRule[] = [{
      prop: 'email',
      error: 'Please enter a valid email address',
      validator: (value: string) => !!value && value.length > 3 && -1 !== value.indexOf('@')
    }, {
      prop: 'password',
      error: 'Please enter a valid password',
      validator: (value: string) => !!value
    }];

    const passed: boolean = validator(validationRules, formValues, loginErrors);
    return passed ? undefined : loginErrors;
  }, [formValues, validator]);

  /**
   * Login.
   * @param {React.MouseEvent<HTMLButtonElement, MouseEvent>} event - mouse event.
   * @return {void}
   */
  const doLogin: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void =
    useCallback((event: React.MouseEvent<HTMLButtonElement, MouseEvent>): void => {
      event.preventDefault();

      // clear previous errors
      setErrors({
        email: '',
        password: ''
      });

      // validate form
      const formErrors: TLoginErrorMessages|undefined = validateForm();
      if (!formErrors) {
        // login
        dispatch(loginAction(formValues.email, formValues.password));
      } else {
        // set errors
        setErrors(formErrors);
      }
    }, [formValues, validateForm, dispatch]);

  // form fields
  const fields: TField[] = useMemo(() => ([{
    label: 'Email',
    id: 'email',
    type: 'text',
    name: 'email',
    value: formValues.email,
    error: errors.email,
    testid: 'email'
  }, {
    label: 'Password',
    id: 'password',
    type: 'password',
    name: 'password',
    value: formValues.password,
    error: errors.password,
    testid: 'password'
  }]), [formValues, errors]);

  if (login.token) navigate('/');

  return (
    <>
      <Header title="Login"/>
      <main className="form">
        <section className="form__block">
          <form>
            {
              fields.map((field: TField) => (
                <FormField
                  key={ field.id}
                  id={ field.id }
                  label={ field.label }
                  type={ field.type }
                  name={ field.name }
                  value={ field.value }
                  changeInput={changeInput}
                  error={ field.error }
                  testid={ field.testid }
                  data-testid={ field.testid }
                />
              ))
            }
            <button onClick={doLogin} className="btn btn--center btn--block" data-testid="login">Login</button>
            <p className="form__field-error" data-testid="login-error">{login.error}</p>
            <Link to="/register" className="btn btn--center btn--block btn--form" data-testid="register">Register</Link>
          </form>
        </section>
      </main>
    </>
  );
};
