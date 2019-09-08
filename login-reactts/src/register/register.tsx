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
 * @property {string} formValues.firstName - form first name input value.
 * @property {string} formValues.lastName - form last name input value.
 * @property {string} formValues.email - form email input value.
 * @property {string} formValues.password - form password input value.
 * @property {string} formValues.confirmPassword - form confirm password input value.
 * @property {string} errors.firstName - form first name input error.
 * @property {string} errors.lastName - form last name input error.
 * @property {string} errors.email - form email input error.
 * @property {string} errors.password - form password input error.
 * @property {string} errors.confirmPassword - form confirm password input error.
 * @property {string} errors.register - register action error.
 */
type State = {
  formValues: {
    firstName: string,
    lastName: string,
    email: string,
    password: string,
    confirmPassword: string
  },
  errors: {
    firstName: string,
    lastName: string,
    email: string,
    password: string,
    confirmPassword: string,
    register: string
  }
};

/**
 * Register component.
 */
export class Register extends React.Component<{}, State> {
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
      confirmPassword: '',
      register: ''
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
   * Register a new user.
   */
  public register = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>): void => {
    event.preventDefault();
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
              <p className="form__field-error">{ this.state.errors.register }</p>
              <Link to="/login" className="btn btn--center btn--block btn--form">Login</Link>
            </form>
          </section>
        </main>
      </>
    );
  }
}
