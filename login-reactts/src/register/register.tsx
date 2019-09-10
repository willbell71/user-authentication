import * as React from 'react';
import { Link, Redirect } from 'react-router-dom';

import { FormField } from '../shared/form-field/form-field';
import { Header } from '../shared/header/header';

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
  },
  loggedIn: boolean
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
    },
    loggedIn: false
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

    // clear previous errors
    this.setState({
      errors: {
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: '',
        register: ''
      }
    });

    // validate form

    // login
    fetch('http://localhost:8080/api/v1/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        firstName: this.state.formValues.firstName,
        lastName: this.state.formValues.lastName,
        email: this.state.formValues.email,
        password: this.state.formValues.password,
        confirmPassword: this.state.formValues.confirmPassword
      })
    })
      .then((res: Response) => {
        if (200 === res.status) {
          // flagged logged in
          this.setState({loggedIn: true});
        } else {
          // display error
          this.setState((state: State) => ({
            errors: {
              ...state.errors,
              register: 'Please try again'
            }
          }));          
        }
      })
      .catch(() => this.setState((state: State) => {
        return {
          errors: {
            ...state.errors,
            register: 'Please check your connection and try again'
          }
        };
      }));
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
        {this.state.loggedIn && <Redirect to="/"/>}
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
