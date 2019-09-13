import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { FormValidationRule } from '../core/form-services/form-validation-rule';
import { FormValidationService } from '../core/form-services/form-validation.service';
import { RegisterService } from '../core/register-services/register.service';

/**
 * Register error messages.
 * @property {string} firstName - error message for first name field.
 * @property {string} lastName - error message for last name field.
 * @property {string} email - error message for email field.
 * @property {string} password - error message for password field.
 * @property {string} confirmPassword - error message for confirm password field.
 * @property {string} register - error message for register attempt.
 */
interface RegisterErrorMessages {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  register: string;
}

/**
 * Register form values.
 * @property {string} firstName - first name field value.
 * @property {string} lastName - last name field value.
 * @property {string} email - email field value.
 * @property {string} password - password field value.
 * @property {string} confirmPassword - confirm password field value.
 */
interface RegisterFormValues {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

/**
 * New user registration component.
 */
@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  // @member {RegisterErrorMessages} errors - error messages.
  public errors: RegisterErrorMessages = {
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    register: ''
  };

  // @member {RegisterFormValues} formValues - form values.
  public formValues: RegisterFormValues = {
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: ''
  };

  /**
   * Constructor.
   * @param {FormValidationService} formValidationService - form validation service provider.
   * @param {RegisterService} registerService - user register service provider.
   * @param {Router} router - router services provider.
   */
  constructor(private formValidationService: FormValidationService,
              private registerService: RegisterService,
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
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
      register: ''
    };
  }

  /**
   * Validate form values.
   * @return {RegisterErrorMessages|void} returns error messages for form or nothing if form values passes validation.
   */
  private validateForm(): RegisterErrorMessages|void {
    const errors: RegisterErrorMessages = {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
      register: ''
    };

    const validationRules: FormValidationRule[] = [{
      prop: 'firstName',
      error: 'Please enter a valid first name',
      validator: value => value
    }, {
      prop: 'lastName',
      error: 'Please enter a valid last name',
      validator: value => value
    }, {
      prop: 'email',
      error: 'Please enter a valid email address',
      validator: value => value && value.length > 3 && -1 !== value.indexOf('@')
    }, {
      prop: 'password',
      error: 'Please enter a valid password',
      validator: value => value
    }, {
      prop: 'password',
      error: 'Please use at least 6 characters',
      validator: value => value.length >= 6
    }, {
      prop: 'confirmPassword',
      error: 'Passwords must match',
      validator: value => value === this.formValues.password
    }];

    const passed: boolean = this.formValidationService.validator(validationRules, this.formValues, errors);
    return passed ? undefined : errors;
  }

  /**
   * Register action.
   * @param {Event} event - click event.
   */
  public register(event: Event): void {
    event.preventDefault();

    const errors = this.validateForm();
    if (!errors) {
      this.clearFormValidationErrors();

      const {firstName, lastName, email, password} = this.formValues;
      this.registerService.register(firstName, lastName, email, password)
        .subscribe(success => {
          if (success) {
            this.router.navigate(['/']);
          } else {
            // display register failed
            this.errors.register = 'Please try again';
          }
        }, () => {
          // display register failed
          this.errors.register = 'Please check your connection and try again';
        });
    } else {
      this.errors = errors;
    }
  }
}
