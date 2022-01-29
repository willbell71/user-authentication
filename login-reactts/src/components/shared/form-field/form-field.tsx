import React, { FC } from 'react';

import './styles.scss';

/**
 * Component props.
 * @property {string} id - field id.
 * @property {string} label - label caption.
 * @property {string} type - input type ( text or password).
 * @property {string} name - input name.
 * @property {string} value - input value.
 * @property {event: React.ChangeEvent<HTMLInputElement>) => void} changeInput - input change event handler.
 * @property {string} error - error feedback.
 * @property {string} testid - test id to query dom in tests.
 */
export type TProps = {
  id: string;
  label: string;
  type: 'text' | 'password';
  name: string;
  value: string;
  changeInput: (event: React.ChangeEvent<HTMLInputElement>) => void;
  error: string;
  testid: string;
};

/**
 * Render.
 * @param {Props} props - component properties.
 * @return {JSX.Element} render.
 */
export const FormField: FC<TProps> = ({ id, label, type, name, value, changeInput, error, testid }: TProps): JSX.Element => (
  <React.Fragment key={ id }>
    <label className="form__field" data-testid="label">{ label }
      <input
        className="form__input"
        id={ id }
        type={ type }
        name={ name }
        value={ value }
        onChange={ changeInput }
        data-testid={ testid }
      />
      <p className="form__field-error" data-testid="error">{ error }</p>
    </label>
  </React.Fragment>
);
