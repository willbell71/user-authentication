import * as React from 'react';
import { connect, ConnectedComponentClass } from 'react-redux';
import { AnyAction, bindActionCreators, Dispatch } from 'redux';
import { Link, Redirect } from 'react-router-dom';

import { Action } from '../../store/actions/action';
import { FormValidationRule } from '../../tform-validation-rule';
import { LoginActionPayload } from '../../store/actions/login/tlogin-action-payload';
import { FormField } from '../shared/form-field/form-field';
import { Header } from '../shared/header/header';
import { loginAction } from '../../store/actions/login/login-action';
import { LoginState } from '../../store/reducers/login-reducer';

import './styles.scss';

/**
 * Login error messages.
 * @property {string} email - email field error message.
 * @property {string} password - passwor field error message.
 */
type LoginErrorMessages = {
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
 * @property {loginAction} actions.login - login action.
 * @property {LoginState} login - login state.
 * @property {(validationRules: FormValidationRule[], values: any, errorMsgs: any) => boolean} validator - form field validator.
 */
export type Props = {
  actions: {
    login: typeof loginAction
  },
  login: LoginState,
  validator: (validationRules: FormValidationRule[], values: any, errorMsgs: any) => boolean
};

/**
 * Component state.
 * @property {string} formValues.email - form email input value.
 * @property {string} formValues.password - form password input value.
 * @property {LoginErrorMessages} errors - form input errors.
 */
type State = {
  formValues: {
    email: string,
    password: string
  },
  errors: LoginErrorMessages
};

/**
 * Login component render.
 * @return {JSX.Element} render.
 */
export class LoginComponent extends React.Component<Props, State> {
  // @member {State} state - component state.
  public state: State = {
    formValues: {
      email: '',
      password: ''
    },
    errors: {
      email: '',
      password: ''
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
   * @return {LoginErrorMessages | undefined} returns error messages for form or nothing if form values passes validation.
   */
  private validateForm(): LoginErrorMessages | undefined {
    const errors: LoginErrorMessages = {
      email: '',
      password: ''
    };

    const validationRules: FormValidationRule[] = [{
      prop: 'email',
      error: 'Please enter a valid email address',
      validator: (value: string) => !!value && value.length > 3 && -1 !== value.indexOf('@')
    }, {
      prop: 'password',
      error: 'Please enter a valid password',
      validator: (value: string) => !!value
    }];

    const passed: boolean = this.props.validator(validationRules, this.state.formValues, errors);
    return passed ? undefined : errors;
  }

  /**
   * Login.
   */
  public login: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void =
    (event: React.MouseEvent<HTMLButtonElement, MouseEvent>): void => {
      event.preventDefault();

      // clear previous errors
      this.setState({
        errors: {
          email: '',
          password: ''
        }
      });

      // validate form
      const errors: LoginErrorMessages | undefined = this.validateForm();
      if (!errors) {
        // login
        this.props.actions.login(this.state.formValues.email, this.state.formValues.password);
      } else {
        // set errors
        this.setState({
          errors: errors
        });  
      }
    };

  /**
   * Render.
   * @return {JSX.Element} component render.
   */
  public render(): JSX.Element {
    // form fields
    const fields: Field[] = [{
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
    }];

    return (
      <>
        {this.props.login.token && <Redirect to="/"/>}
        <Header title="Login"/>
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
              <button onClick={this.login} className="btn btn--center btn--block">Login</button>
              <p className="form__field-error">{ this.props.login.error }</p>
              <Link to="/register" className="btn btn--center btn--block btn--form">Register</Link>
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
    login: (email: string, password: string) => (dispatch: (action: Action<LoginActionPayload>) => void) => Promise<any>
  }
} = (dispatch: Dispatch<AnyAction>) => ({
  actions: bindActionCreators({
    login: loginAction
  }, dispatch)
});

// connect component to store and export wrapper
export const Login: ConnectedComponentClass<typeof LoginComponent, any> = connect(mapStateToProps, mapDispatchToProps)(LoginComponent);
