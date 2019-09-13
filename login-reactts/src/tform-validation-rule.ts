/**
 * Form validation rule.
 * @property {string} prop - name of property to validate.
 * @property {string} error - error message to set if validation fails.
 * @property {(value: any) => boolean} - validation rule.
 */
export type FormValidationRule = {
  prop: string;
  error: string;
  validator: (value: any) => boolean;
};
