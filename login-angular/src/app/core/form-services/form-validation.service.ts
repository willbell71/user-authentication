import { Injectable } from '@angular/core';

import { FormValidationRule } from './form-validation-rule';

@Injectable({
  providedIn: 'root'
})
export class FormValidationService {
  /**
   * Constructor.
   */
  constructor() {}

  /**
   * Validate a set of values against a list of rules.
   * @param {FormValidationRule[]} validationRules - list of validation rules.
   * @param {any} values - values to validate.
   * @param {any} errorMsgs - error messages for values that fail validation.
   */
  public validator(validationRules: FormValidationRule[], values: any, errorMsgs: any): boolean {
    // assume validation passed
    let valid = true;
    validationRules.forEach(rule => {
      if (!rule.validator(values[rule.prop])) {
        // set error message
        errorMsgs[rule.prop] = rule.error;
        // flag validation failed
        valid = false;
      }
    });

    return valid;
  }
}
