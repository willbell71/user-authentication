import * as React from 'react';
import { connect, ConnectedComponentClass } from 'react-redux';
import { Link, Redirect } from 'react-router-dom';
import { AnyAction, bindActionCreators, Dispatch } from 'redux';

import { FormField } from '../shared/form-field/form-field';
import { Header } from '../shared/header/header';
import { loginAction } from '../../store/actions/login/login-action';
import { TAction } from '../../store/actions/taction';
import { TFormValidationRule } from '../../tform-validation-rule';
import { TLoginActionPayload } from '../../store/actions/login/tlogin-action-payload';
import { TLoginState } from '../../store/reducers/login-reducer';

import './styles.scss';

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
 * @property {loginAction} actions.login - login action.
 * @property {LoginState} login - login state.
 * @property {(validationRules: FormValidationRule[], values: any, errorMsgs: any) => boolean} validator - form field validator.
 */
export type TProps = {
  actions: {
    login: typeof loginAction
  },
  login: TLoginState,
  validator: (validationRules: TFormValidationRule[], values: {[key: string]: string}, errorMsgs: {[key: string]: string}) => boolean
};

/**
 * Component state.
 * @property {string} formValues.email - form email input value.
 * @property {string} formValues.password - form password input value.
 * @property {LoginErrorMessages} errors - form input errors.
 */
type TState = {
  formValues: {
    email: string,
    password: string
  },
  errors: TLoginErrorMessages
};

/**
 * Login component render.
 * @return {JSX.Element} render.
 */
export class LoginComponent extends React.Component<TProps, TState> {
  // @member {State} state - component state.
  public state: TState = {
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
   * @return {LoginErrorMessages | undefined} returns error messages for form or nothing if form values passes validation.
   */
  private validateForm(): TLoginErrorMessages | undefined {
    const errors: TLoginErrorMessages = {
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

    const passed: boolean = this.props.validator(validationRules, this.state.formValues, errors);
    return passed ? undefined : errors;
  }

  /**
   * Login.
   * @param {React.MouseEvent<HTMLButtonElement, MouseEvent>} event - mouse event.
   * @return {void}
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
      const errors: TLoginErrorMessages | undefined = this.validateForm();
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
    const fields: TField[] = [{
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
export const mapStateToProps: (state: {login: TLoginState}) => {login: TLoginState} = (state: {login: TLoginState}) => ({
  login: state.login
});

// map store actions to props
export const mapDispatchToProps: (dispatch: Dispatch<AnyAction>) => {
  actions: {
    login: (email: string, password: string) => (dispatch: (action: TAction<TLoginActionPayload>) => void) => Promise<void>
  }
} = (dispatch: Dispatch<AnyAction>) => ({
  actions: bindActionCreators({
    login: loginAction
  }, dispatch)
});

// connect component to store and export wrapper
export const Login: ConnectedComponentClass<typeof LoginComponent, {
  validator: (validationRules: TFormValidationRule[], values: {[key: string]: string}, errorMsgs: {[key: string]: string}) => boolean
}> = connect(mapStateToProps, mapDispatchToProps)(LoginComponent);
