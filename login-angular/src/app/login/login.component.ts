import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { LoginService } from '../core/login-services/login.service';

/**
 * Login error messages.
 * @property {string} email - error message for email field.
 * @property {string} password - error message for password field.
 * @property {string} login - error message for login attempt.
 */
interface LoginErrorMessages {
  email: string;
  password: string;
  login: string;
}

/**
 * Login form values.
 * @property {string} email - email field value.
 * @property {string} password - password field value.
 */
interface LoginFormValues {
  email: string;
  password: string;
}

/**
 * Login component.
 */
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  // @member {LoginErrorMessages} errors - error messages.
  public errors: LoginErrorMessages = {
    email: '',
    password: '',
    login: ''
  };

  // @member {LoginFormValues} formValues - form values.
  public formValues: LoginFormValues = {
    email: '',
    password: ''
  };

  /**
   * Constructor.
   */
  constructor(private loginService: LoginService,
              private router: Router) { }

  /**
   * On init lifecycle callback.
   */
  public ngOnInit(): void {}

  /**
   * Clear form validation errors.
   */
  private clearFormValidationErrors(): void {
    this.errors = {
      email: '',
      password: '',
      login: ''
    };
  }

  /**
   * Validate form values.
   * @return {LoginErrorMessages|void} returns error messages for form or nothing if form values passes validation.
   */
  private validateForm(): LoginErrorMessages|void {
    const {email, password} = this.formValues;

    // validate email
    if (!email || email.length < 3 || -1 === email.indexOf('@')) {
      return {
        email: 'Please enter a valid email address',
        password: '',
        login: ''
      };
    }

    // validate password
    if (!password) {
      return {
        email: '',
        password: 'Please enter a valid password',
        login: ''
      };
    }

    return;
  }

  /**
   * Login action.
   * @param {Event} event - click event.
   */
  public login(event: Event): void {
    event.preventDefault();

    const errors = this.validateForm();
    if (!errors) {
      this.clearFormValidationErrors();

      const {email, password} = this.formValues;
      this.loginService.login(email, password)
        .subscribe(success => {
          if (success) {
            this.router.navigate(['/']);
          } else {
            // display login failed
            this.errors.login = 'Please try again';
          }
        }, () => {
          // display login failed
          this.errors.login = 'Please check your connection and try again';
        });
    } else {
      this.errors = errors;
    }
  }
}
