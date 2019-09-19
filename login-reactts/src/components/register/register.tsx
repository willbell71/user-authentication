import * as React from 'react';
import { connect, ConnectedComponentClass } from 'react-redux';
import { Link, Redirect } from 'react-router-dom';
import { AnyAction, bindActionCreators, Dispatch } from 'redux';

import { FormField } from '../shared/form-field/form-field';
import { Header } from '../shared/header/header';
import { registerAction } from '../../store/actions/login/register-action';
import { TAction } from '../../store/actions/taction';
import { TFormValidationRule } from '../../tform-validation-rule';
import { TLoginActionPayload } from '../../store/actions/login/tlogin-action-payload';
import { TLoginState } from '../../store/reducers/login-reducer';

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
 * Field properties.
 * @property {string} label - field label caption.
 * @property {string} id - input field id.
 * @property {string} type - input field type (text or password).
 * @property {string} name- input field name.
 * @property {string} value - input field value.
 * @property {string} error - error feedback.
 */
type TField = {
  label: string,
  id: string,
  type: 'text' | 'password',
  name: string,
  value: string,
  error: string
};

/**
 * Component properties.
 * @property {registerAction} actions.register - register action.
 * @property {LoginState} login - login state.
 */
export type TProps = {
  actions: {
    register: typeof registerAction
  },
  login: TLoginState,
  validator: (validationRules: TFormValidationRule[], values: {[key: string]: string}, errorMsgs: {[key: string]: string}) => boolean
};

/**
 * Component state.
 * @property {string} formValues.firstName - form first name input value.
 * @property {string} formValues.lastName - form last name input value.
 * @property {string} formValues.email - form email input value.
 * @property {string} formValues.password - form password input value.
 * @property {string} formValues.confirmPassword - form confirm password input value.
 * @property {TRegisterErrorMessages} errors - form input errors.
 */
type TState = {
  formValues: {
    firstName: string,
    lastName: string,
    email: string,
    password: string,
    confirmPassword: string
  },
  errors: TRegisterErrorMessages
};

/**
 * Register component.
 */
export class RegisterComponent extends React.Component<TProps, TState> {
  // @member {State} state - component state.
  public state: TState = {
    formValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: ''
    },
    errors: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: ''
    }
  };

  /**
   * Change input field value.
   * @param {React.ChangeEvent<HTMLInputElement>} event - event that fired change.
   * @return {void}
   */
  private changeInput: (event: React.ChangeEvent<HTMLInputElement>) => void = (event: React.ChangeEvent<HTMLInputElement>): void => {
    let fieldName: string = event.target.name;
    let value: string = event.target.value;
    this.setState((state: TState) => ({
      formValues: {
        ...state.formValues,
        [fieldName]: value
      }
    }));
  };

  /**
   * Validate form values.
   * @return {RegisterErrorMessages | undefined} returns error messages for form or nothing if form values passes validation.
   */
  private validateForm(): TRegisterErrorMessages | undefined {
    const errors: TRegisterErrorMessages = {
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
      validator: (value: string) => value === this.state.formValues.password
    }];

    const passed: boolean = this.props.validator(validationRules, this.state.formValues, errors);
    return passed ? undefined : errors;
  }
  
  /**
   * Register a new user.
   * @param {React.MouseEvent<HTMLButtonElement, MouseEvent>} event - mouse event.
   * @return {void}
   */
  public register: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void =
    (event: React.MouseEvent<HTMLButtonElement, MouseEvent>): void => {
      event.preventDefault();

      // clear previous errors
      this.setState({
        errors: {
          firstName: '',
          lastName: '',
          email: '',
          password: '',
          confirmPassword: ''
        }
      });

      // validate form
      const errors: TRegisterErrorMessages | undefined = this.validateForm();
      if (!errors) {
        // register
        this.props.actions.register(this.state.formValues.firstName,
          this.state.formValues.lastName,
          this.state.formValues.email,
          this.state.formValues.password
        );
      } else {
        // set errors
        this.setState({
          errors: errors
        });  
      }
    };

  /**
   * Render
   * @return {JSX.Element} component render.
   */
  public render(): JSX.Element {
    // form fields
    const fields: TField[] = [{
      label: 'First Name',
      id: 'first-name',
      type: 'text',
      name: 'firstName',
      value: this.state.formValues.firstName,
      error: this.state.errors.firstName
    }, {
      label: 'Last Name',
      id: 'last-name',
      type: 'text',
      name: 'lastName',
      value: this.state.formValues.lastName,
      error: this.state.errors.lastName
    }, {
      label: 'Email',
      id: 'email',
      type: 'text',
      name: 'email',
      value: this.state.formValues.email,
      error: this.state.errors.email
    }, {
      label: 'Password',
      id: 'password',
      type: 'password',
      name: 'password',
      value: this.state.formValues.password,
      error: this.state.errors.password
    }, {
      label: 'Confirm Password',
      id: 'confirm-password',
      type: 'password',
      name: 'confirmPassword',
      value: this.state.formValues.confirmPassword,
      error: this.state.errors.confirmPassword
    }];

    return (
      <>
        {this.props.login.token && <Redirect to="/"/>}
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
                    changeInput={ this.changeInput }
                    error={ field.error }/>
                ))
              }
              <button onClick={this.register} className="btn btn--center btn--block">Register</button>
              <p className="form__field-error">{ this.props.login.error }</p>
              <Link to="/login" className="btn btn--center btn--block btn--form">Login</Link>
            </form>
          </section>
        </main>
      </>
    );
  }
}

// map store state to props
export const mapStateToProps: (state: {login: TLoginState}) => {login: TLoginState} = (state: {login: TLoginState}) => ({
  login: state.login
});

// map store actions to props
export const mapDispatchToProps: (dispatch: Dispatch<AnyAction>) => {
  actions: {
    register: (firstName: string, lastName: string, email: string, password: string) =>
      (dispatch: (action: TAction<TLoginActionPayload>) => void) => Promise<void>
  }
} = (dispatch: Dispatch<AnyAction>) => ({
  actions: bindActionCreators({
    register: registerAction
  }, dispatch)
});

// connect component to store and export wrapper
export const Register: ConnectedComponentClass<typeof RegisterComponent, {
  validator: (validationRules: TFormValidationRule[], values: {[key: string]: string}, errorMsgs: {[key: string]: string}) => boolean  
}> =
  connect(mapStateToProps, mapDispatchToProps)(RegisterComponent);
