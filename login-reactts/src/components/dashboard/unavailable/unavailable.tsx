import * as React from 'react';

import './styles.scss';

/**
 * Component props.
 * @property {string | null} value? - value to render, if available.
 */
type TProps = {
  value?: string | null;
};

/**
 * Unavailable component render.
 * @return {JSX.Element} render.
 */
export function Unavailable(props: TProps): JSX.Element {
  return (
    <>{ props.value ? props.value : 'Unavailable' }</>
  );
}
