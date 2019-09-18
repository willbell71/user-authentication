import * as React from 'react';
import { connect, ConnectedComponentClass } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { AnyAction, bindActionCreators, Dispatch } from 'redux';

import { getSomethingAction } from '../../store/actions/something/get-something-action';
import { Header } from '../shared/header/header';
import { logoutAction } from '../../store/actions/login/logout-action';
import { TAction } from '../../store/actions/taction';
import { TLoginActionPayload } from '../../store/actions/login/tlogin-action-payload';
import { TLoginState } from '../../store/reducers/login-reducer';
import { TSomethingActionPayload } from '../../store/actions/something/tsomething-action-payload';
import { TSomethingState } from '../../store/reducers/something-reducer';
import { Unavailable } from './unavailable/unavailable';

import './styles.scss';

/**
 * Component properties.
 * @property {logoutAction} actions.logout - logout action.
 * @property {getSomethingAction} actions.getSomething - get something action.
 * @property {LoginState} login - login state.
 * @property {SomethingState} something - something state.
 */
export type TProps = {
  actions: {
    logout: typeof logoutAction,
    getSomething: typeof getSomethingAction
  },
  login: TLoginState,
  something: TSomethingState
};

/**
 * Dashboard component.
 */
export class DashboardComponent extends React.Component<TProps, {}> {
  /**
   * Get something from API.
   */
  public getSomething: () => void = (): void => {
    this.props.actions.getSomething();
  };

  /**
   * Log out user.
   */
  public logout: () => void = (): void => {
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
export const mapStateToProps: (state: {login: TLoginState, something: TSomethingState}) =>
  {login: TLoginState, something: TSomethingState} =
  (state: {login: TLoginState, something: TSomethingState}) => ({
    login: state.login,
    something: state.something
  });

// map store actions to props
export const mapDispatchToProps: (dispatch: Dispatch<AnyAction>) => {
  actions: {
    logout: () => (dispatch: (action: TAction<TLoginActionPayload>) => void) => Promise<void>,
    getSomething: () => (dispatch: (action: TAction<TSomethingActionPayload>) => void) => Promise<void>
  }
} = (dispatch: Dispatch<AnyAction>) => ({
  actions: bindActionCreators({
    logout: logoutAction,
    getSomething: getSomethingAction
  }, dispatch)
});

// connect component to store and export wrapper
export const Dashboard: ConnectedComponentClass<typeof DashboardComponent, {}> =
  connect(mapStateToProps, mapDispatchToProps)(DashboardComponent);
