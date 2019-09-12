import * as React from 'react';
import { connect } from 'react-redux';
import { AnyAction, bindActionCreators, Dispatch } from 'redux';
import { Redirect } from 'react-router-dom';

import { Header } from '../shared/header/header';
import { Unavailable } from './unavailable/unavailable';
import { logoutAction } from '../../store/actions/login/logout-action';
import { LoginState } from '../../store/reducers/login-reducer';
import { getSomethingAction } from '../../store/actions/something/get-action';
import { SomethingState } from '../../store/reducers/something-reducer';

import './styles.scss';

/**
 * Props.
 * @property {logoutAction} actions.logout - logout action.
 * @property {getSomethingAction} actions.getSomething - get something action.
 * @property {LoginState} login - login state.
 * @property {SomethingState} something - something state.
 */
export type Props = {
  actions: {
    logout: typeof logoutAction,
    getSomething: typeof getSomethingAction
  },
  login: LoginState,
  something: SomethingState
};

/**
 * Dashboard component.
 */
export class DashboardComponent extends React.Component<Props, {}> {
  /**
   * Get something from API.
   */
  public getSomething = (): void => {
    this.props.actions.getSomething();
  }

  /**
   * Log out user.
   */
  public logout = (): void => {
    this.props.actions.logout();
  };

  /**
   * Render.
   * @return {JSX.Element} component render.
   */
  public render(): JSX.Element {
    return (
      <>
        {!this.props.login.token && <Redirect to="/login"/>}
        <Header title="Dashboard"/>
        <main className="container">
          <section className="content">
            <button className="btn btn--md" onClick={this.getSomething}>Get Something</button>

            <article className="content__article">
              <h6 className="content__article-title">Title</h6>
              <p><Unavailable value={this.props.something.title}/></p>
              <h6 className="content__article-title">Body</h6>
              <p><Unavailable value={this.props.something.body}/></p>
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

// map store state to props
export const mapStateToProps = (state: {login: LoginState, something: SomethingState}) => ({
  login: state.login,
  something: state.something
});

// map store actions to props
export const mapDispatchToProps = (dispatch: Dispatch<AnyAction>) => ({
  actions: bindActionCreators({
    logout: logoutAction,
    getSomething: getSomethingAction
  }, dispatch)
});

// connect component to store and export wrapper
export const Dashboard = connect(mapStateToProps, mapDispatchToProps)(DashboardComponent);
