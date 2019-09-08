import * as React from 'react';

import './styles.scss';

/**
 * Component props.
 * @property {string} value? - value to render, if available.
 */
type Props = {
  value?: string;
};

/**
 * Unavailable component render.
 * @return {JSX.Element} render.
 */
export function Unavailable(props: Props): JSX.Element {
  return (
    <>{ props.value ? props.value : 'Unavailable' }</>
  );
}
