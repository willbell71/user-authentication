import * as React from 'react';

import './styles.scss';

/**
 * Component props.
 * @property {string} title - header title text.
 */
type TProps = {
  title: string;
};

/**
 * Render.
 * @param {Props} props - component properties.
 * @return {JSX.Element} render.
 */
export function Header(props: TProps): JSX.Element {
  return (
    <header>
      <h1 className="header">{ props.title }</h1>
    </header>
  );
}
