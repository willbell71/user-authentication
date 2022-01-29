import React, { FC } from 'react';

import './styles.scss';

/**
 * Component props.
 * @property {string} title - header title text.
 */
export type TProps = {
  title: string;
};

/**
 * Render.
 * @param {Props} props - component properties.
 * @return {JSX.Element} render.
 */
export const Header: FC<TProps> = ({ title }: TProps): JSX.Element => (
  <header>
    <h1 className="header" data-testid="title">{ title }</h1>
  </header>
);
