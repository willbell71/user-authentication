import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { FormValidationRule } from '../core/form-services/form-validation-rule';
import { FormValidationService } from '../core/form-services/form-validation.service';
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
   * @param {FormValidationService} formValidationService - form validation service provider.
   * @param {LoginService} loginService - user login service provider.
   * @param {Router} router - router services provider.
   */
  constructor(private formValidationService: FormValidationService,
              private loginService: LoginService,
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
    const errors: LoginErrorMessages = {
      email: '',
      password: '',
      login: ''
    };

    const validationRules: FormValidationRule[] = [{
      prop: 'email',
      error: 'Please enter a valid email address',
      validator: value => value && value.length > 3 && -1 !== value.indexOf('@')
    }, {
      prop: 'password',
      error: 'Please enter a valid password',
      validator: value => value
    }];

    const passed: boolean = this.formValidationService.validator(validationRules, this.formValues, errors);
    return passed ? undefined : errors;
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
