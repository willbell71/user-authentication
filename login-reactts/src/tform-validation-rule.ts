/**
 * Form validation rule.
 * @property {string} prop - name of property to validate.
 * @property {string} error - error message to set if validation fails.
 * @property {(value: unknown) => boolean} - validation rule.
 */
export type TFormValidationRule = {
  prop: string;
  error: string;
  validator: (value: string) => boolean;
};
