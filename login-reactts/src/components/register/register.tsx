import React, { Dispatch, FC, useCallback, useMemo, useState } from 'react';
import { Link, NavigateFunction, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector  } from 'react-redux';

import { FormField } from '../shared/form-field/form-field';
import { Header } from '../shared/header/header';
import { registerAction } from '../../store/actions/login/register-action';
import { TFormValidationRule } from '../../tform-validation-rule';
import { TLoginState } from '../../store/reducers/login-reducer';
import { TStore } from '../../store/app-store';

import './styles.scss';

/**
 * Register error messages.
 * @property {string} firstName - first name field error message.
 * @property {string} lastName - last name field error message.
 * @property {string} email - email field error message.
 * @property {string} password - password field error message.
 * @property {string} confirmPassword - confirm password field error message.
 */
type TRegisterErrorMessages = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
};

/**
 * Form values.
 * @property {string} firstName - first name field value.
 * @property {string} lastName - last name field value.
 * @property {string} email - email field value.
 * @property {string} password - password field value.
 * @property {string} confirmPassword - confirm password field value.
 */
 type TFormValues = {
  firstName: string,
  lastName: string,
  email: string,
  password: string,
  confirmPassword: string
};

/**
 * Field properties.
 * @property {string} label - field label caption.
 * @property {string} id - input field id.
 * @property {string} type - input field type (text or password).
 * @property {string} name- input field name.
 * @property {string} value - input field value.
 * @property {string} error - error feedback.
 * @property {string} testid - testid for component tests.
 */
type TField = {
  label: string,
  id: string,
  type: 'text' | 'password',
  name: string,
  value: string,
  error: string,
  testid: string,
};

/**
 * Component properties.
 */
export type TProps = {
  validator: (validationRules: TFormValidationRule[], values: {[key: string]: string}, errorMsgs: {[key: string]: string}) => boolean
};

/**
 * Register component.
 */
export const Register: FC<TProps> = ({ validator }: TProps): JSX.Element => {
  const navigate: NavigateFunction = useNavigate();
  const { login }: { login: TLoginState } = useSelector((state: TStore) => state);
  const dispatch: Dispatch<unknown> = useDispatch();

  const [formValues, setFormValues]: [TFormValues, (values: TFormValues|((values: TFormValues) => TFormValues)) => void] =
    useState<TFormValues>({
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: ''
    });

  const [errors, setErrors]: [TRegisterErrorMessages, (values: TRegisterErrorMessages) => void] = useState<TRegisterErrorMessages>({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  /**
   * Change input field value.
   * @param {React.ChangeEvent<HTMLInputElement>} event - event that fired change.
   * @return {void}
   */
  const changeInput: (event: React.ChangeEvent<HTMLInputElement>) => void =
    useCallback((event: React.ChangeEvent<HTMLInputElement>): void => {
      const fieldName: string = event.target.name;
      const value: string = event.target.value;
      setFormValues((values: TFormValues) => ({
        ...values,
        [fieldName]: value
      }));
    }, []);

  /**
   * Validate form values.
   * @return {RegisterErrorMessages | undefined} returns error messages for form or nothing if form values passes validation.
   */
  const validateForm: () => TRegisterErrorMessages|undefined = useCallback((): TRegisterErrorMessages|undefined => {
    const validationErrors: TRegisterErrorMessages = {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: ''
    };

    const validationRules: TFormValidationRule[] = [{
      prop: 'firstName',
      error: 'Please enter a valid first name',
      validator: (value: string) => !!value
    }, {
      prop: 'lastName',
      error: 'Please enter a valid last name',
      validator: (value: string) => !!value
    }, {
      prop: 'email',
      error: 'Please enter a valid email address',
      validator: (value: string) => !!value && value.length > 3 && -1 !== value.indexOf('@')
    }, {
      prop: 'password',
      error: 'Please enter a valid password',
      validator: (value: string) => !!value
    }, {
      prop: 'password',
      error: 'Please use at least 6 characters',
      validator: (value: string) => value.length >= 6
    }, {
      prop: 'confirmPassword',
      error: 'Passwords must match',
      validator: (value: string) => value === formValues.password
    }];

    const passed: boolean = validator(validationRules, formValues, validationErrors);
    return passed ? undefined : validationErrors;
  }, [validator, formValues]);

  /**
   * Register a new user.
   * @param {React.MouseEvent<HTMLButtonElement, MouseEvent>} event - mouse event.
   * @return {void}
   */
  const register: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void =
    useCallback((event: React.MouseEvent<HTMLButtonElement, MouseEvent>): void => {
      event.preventDefault();

      // clear previous errors
      setErrors({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: ''
      });

      // validate form
      const validationErrors: TRegisterErrorMessages | undefined = validateForm();
      if (!validationErrors) {
        // register
        dispatch(registerAction(
          formValues.firstName,
          formValues.lastName,
          formValues.email,
          formValues.password
        ));
      } else {
        // set errors
        setErrors(validationErrors);
      }
    }, [formValues, validateForm, setErrors, dispatch]);

  // form fields
  const fields: TField[] = useMemo(() => [{
    label: 'First Name',
    id: 'first-name',
    type: 'text',
    name: 'firstName',
    value: formValues.firstName,
    error: errors.firstName,
    testid: 'firstName'
  }, {
    label: 'Last Name',
    id: 'last-name',
    type: 'text',
    name: 'lastName',
    value: formValues.lastName,
    error: errors.lastName,
    testid: 'lastName'
  }, {
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
  }, {
    label: 'Confirm Password',
    id: 'confirm-password',
    type: 'password',
    name: 'confirmPassword',
    value: formValues.confirmPassword,
    error: errors.confirmPassword,
    testid: 'confirmPassword'
  }], [formValues, errors]);

  if (login.token) navigate('/');

  return (
    <>
      <Header title="Register"/>
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
            <button onClick={register} className="btn btn--center btn--block" data-testid="register">Register</button>
            <p className="form__field-error" data-testid="register-error">{ login.error }</p>
            <Link to="/login" className="btn btn--center btn--block btn--form" data-testid="login">Login</Link>
          </form>
        </section>
      </main>
    </>
  );
};
