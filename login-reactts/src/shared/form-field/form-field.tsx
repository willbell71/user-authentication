import * as React from 'react';

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
 */
type Props = {
  id: string;
  label: string;
  type: 'text' | 'password';
  name: string;
  value: string;
  changeInput: (event: React.ChangeEvent<HTMLInputElement>) => void;
  error: string;
};

/**
 * Render.
 * @param {Props} props - component properties.
 * @return {JSX.Element} render.
 */
export function FormField(props: Props): JSX.Element {
  return (
    <React.Fragment key={ props.id }>
      <label className="form__field">{ props.label }
        <input 
          className="form__input"
          id={ props.id }
          type={ props.type }
          name={ props.name }
          value={ props.value }
          onChange={ props.changeInput }/>
        <p className="form__field-error">{ props.error }</p>
      </label>
    </React.Fragment>
  );
}
