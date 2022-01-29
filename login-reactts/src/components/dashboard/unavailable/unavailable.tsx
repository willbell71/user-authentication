import React, { FC } from 'react';

import './styles.scss';

/**
 * Component props.
 * @property {string | null} value - value to render, if available.
 */
type TProps = {
  value: string | null;
};

/**
 * Unavailable component render.
 * @param {TProps} props - component properties.
 * @return {JSX.Element} render.
 */
export const Unavailable: FC<TProps> = ({ value }: TProps): JSX.Element => {
  return (
    <>{ value ? value : 'Unavailable' }</>
  );
};
