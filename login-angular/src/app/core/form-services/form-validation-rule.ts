/**
 * Form validation rule.
 * @property {string} prop - name of property to validate.
 * @property {string} error - error message to generate when validation fails.
 * @property {() => boolean} validator - function to run for validation, returns true if validation passes.
 */
export interface FormValidationRule {
  prop: string;
  error: string;
  validator(value: any): () => boolean;
}
