import * as React from 'react';
import { connect, ConnectedComponentClass } from 'react-redux';
import { AnyAction, bindActionCreators, Dispatch } from 'redux';
import { Link, Redirect } from 'react-router-dom';

import { Action } from '../../store/actions/action';
import { FormValidationRule } from '../../tform-validation-rule';
import { LoginActionPayload } from '../../store/actions/login/tlogin-action-payload';
import { FormField } from '../shared/form-field/form-field';
import { Header } from '../shared/header/header';
import { registerAction } from '../../store/actions/login/register-action';
import { LoginState } from '../../store/reducers/login-reducer';

import './styles.scss';

/**
 * Register error messages.
 * @property {string} firstName - first name field error message.
 * @property {string} lastName - last name field error message.
 * @property {string} email - email field error message.
 * @property {string} password - password field error message.
 * @property {string} confirmPassword - confirm password field error message.
 */
type RegisterErrorMessages = {
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
type Field = {
  label: string,
  id: string,
  type: 'text' | 'password',
  name: string,
  value: string,
  error: string
};

/**
 * Props.
 * @property {registerAction} actions.register - register action.
 * @property {LoginState} login - login state.
 */
export type Props = {
  actions: {
    register: typeof registerAction
  },
  login: LoginState,
  validator: (validationRules: FormValidationRule[], values: any, errorMsgs: any) => boolean
};

/**
 * Component state.
 * @property {string} formValues.firstName - form first name input value.
 * @property {string} formValues.lastName - form last name input value.
 * @property {string} formValues.email - form email input value.
 * @property {string} formValues.password - form password input value.
 * @property {string} formValues.confirmPassword - form confirm password input value.
 * @property {RegisterErrorMessages} errors - form input errors.
 */
type State = {
  formValues: {
    firstName: string,
    lastName: string,
    email: string,
    password: string,
    confirmPassword: string
  },
  errors: RegisterErrorMessages
};

/**
 * Register component.
 */
export class RegisterComponent extends React.Component<Props, State> {
  // @member {State} state - component state.
  public state: State = {
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
   */
  private changeInput: (event: React.ChangeEvent<HTMLInputElement>) => void = (event: React.ChangeEvent<HTMLInputElement>): void => {
    let fieldName: string = event.target.name;
    let value: string = event.target.value;
    this.setState((state: State) => ({
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
  private validateForm(): RegisterErrorMessages | undefined {
    const errors: RegisterErrorMessages = {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: ''
    };

    const validationRules: FormValidationRule[] = [{
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
      const errors: RegisterErrorMessages | undefined = this.validateForm();
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
    const fields: Field[] = [{
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
                fields.map((field: Field) => (
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
export const mapStateToProps: (state: {login: LoginState}) => {login: LoginState} = (state: {login: LoginState}) => ({
  login: state.login
});

// map store actions to props
export const mapDispatchToProps: (dispatch: Dispatch<AnyAction>) => {
  actions: {
    register: (firstName: string, lastName: string, email: string, password: string) =>
      (dispatch: (action: Action<LoginActionPayload>) => void) => Promise<any>
  }
} = (dispatch: Dispatch<AnyAction>) => ({
  actions: bindActionCreators({
    register: registerAction
  }, dispatch)
});

// connect component to store and export wrapper
export const Register: ConnectedComponentClass<typeof RegisterComponent, any> =
  connect(mapStateToProps, mapDispatchToProps)(RegisterComponent);
