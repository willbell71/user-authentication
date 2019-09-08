import * as React from 'react';
import {Link} from 'react-router-dom';

import {FormField} from '../shared/form-field/form-field';
import {Header} from '../shared/header/header';

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
 * Component state.
 * @property {string} formValues.email - form email input value.
 * @property {string} formValues.password - form password input value.
 * @property {string} errors.email - form email input error.
 * @property {string} errors.password - form password input error.
 * @property {string} errors.login - login action error.
 */
type State = {
  formValues: {
    email: string,
    password: string
  },
  errors: {
    email: string,
    password: string,
    login: string
  }
};

/**
 * Login component render.
 * @return {JSX.Element} render.
 */
export class Login extends React.Component<{}, State> {
  // @member {State} state - component state.
  public state: State = {
    formValues: {
      email: '',
      password: ''
    },
    errors: {
      email: '',
      password: '',
      login: ''
    }  
  };

  /**
   * Change input field value.
   * @param {React.ChangeEvent<HTMLInputElement>} event - event that fired change.
   */
  private changeInput = (event: React.ChangeEvent<HTMLInputElement>): void => {
    console.log('changeInput');
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
              <p className="form__field-error">{ this.state.errors.login }</p>
              <Link to="/register" className="btn btn--center btn--block btn--form">Register</Link>
            </form>
          </section>
        </main>
      </>
    );
  }
}

