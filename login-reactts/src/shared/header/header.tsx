import * as React from 'react';

import './styles.scss';

/**
 * Component props.
 * @property {string} title - header title text.
 */
type Props = {
  title: string;
};

/**
 * Header component.
 */
export class Header extends React.Component<Props> {
  /**
   * Render.
   * @return {JSX.Element} render.
   */
  render(): JSX.Element {
    return (
      <header>
        <h1 className="header">{ this.props.title }</h1>
      </header>
    )
  }
}
