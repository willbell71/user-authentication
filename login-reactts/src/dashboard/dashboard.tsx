import * as React from 'react';

import {Header} from '../shared/header/header';
import {Unavailable} from './unavailable/unavailable';

import './styles.scss';

/**
 * Component state.
 * @property {string} title? - title of content, if available.
 * @property {string} body? - body of content, if available.
 */
type State = {
  title?: string;
  body?: string;
};

/**
 * Dashboard component.
 */
export class Dashboard extends React.Component<{}, State> {
  // @member {State} state - component state.
  public state: State = {
    title: undefined,
    body: undefined
  }

  /**
   * Get something from API.
   */
  public getSomething = (): void => {}

  /**
   * Log out user.
   */
  public logout = (): void => {};

  /**
   * Render.
   * @return {JSX.Element} component render.
   */
  public render(): JSX.Element {
    return (
      <>
        <Header title="Dashboard"/>
        <main className="container">
          <section className="content">
            <button className="btn btn--md" onClick={this.getSomething}>Get Something</button>

            <article className="content__article">
              <h6 className="content__article-title">Title</h6>
              <p><Unavailable value={this.state.title}/></p>
              <h6 className="content__article-title">Body</h6>
              <p><Unavailable value={this.state.body}/></p>
            </article>
          </section>

          <section className="logout">
            <button className="btn btn--md" onClick={this.logout}>Logout</button>
          </section>
        </main>
      </>
    );
  }
}
