import * as React from 'react';
import { connect } from 'react-redux';
import { AnyAction, bindActionCreators, Dispatch } from 'redux';
import { Link, Redirect } from 'react-router-dom';

import { FormField } from '../shared/form-field/form-field';
import { Header } from '../shared/header/header';
import { loginAction } from '../../store/actions/login/login-action';
import { LoginState } from '../../store/reducers/login-reducer';

import './styles.scss';

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
 */
export type Props = {
  actions: {
    login: typeof loginAction
  },
  login: LoginState
};

/**
 * Component state.
 * @property {string} formValues.email - form email input value.
 * @property {string} formValues.password - form password input value.
 * @property {string} errors.email - form email input error.
 * @property {string} errors.password - form password input error.
 */
type State = {
  formValues: {
    email: string,
    password: string
  },
  errors: {
    email: string,
    password: string
  }
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
  private changeInput = (event: React.ChangeEvent<HTMLInputElement>): void => {
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
   * Login.
   */
  public login = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>): void => {
    event.preventDefault();

    // clear previous errors
    this.setState({
      errors: {
        email: '',
        password: ''
      }
    });

    // validate form

    // login
    this.props.actions.login(this.state.formValues.email, this.state.formValues.password);
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
export const mapStateToProps = (state: {login: LoginState}) => ({
  login: state.login
});

// map store actions to props
export const mapDispatchToProps = (dispatch: Dispatch<AnyAction>) => ({
  actions: bindActionCreators({
    login: loginAction
  }, dispatch)
});

// connect component to store and export wrapper
export const Login = connect(mapStateToProps, mapDispatchToProps)(LoginComponent);
