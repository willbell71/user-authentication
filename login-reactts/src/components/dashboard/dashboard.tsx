import React, { Dispatch, FC, useCallback, useEffect } from 'react';
import { NavigateFunction, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector  } from 'react-redux';

import { getSomethingAction } from '../../store/actions/something/get-something-action';
import { Header } from '../shared/header/header';
import { logoutAction } from '../../store/actions/login/logout-action';
import { TLoginState } from '../../store/reducers/login-reducer';
import { TSomethingState } from '../../store/reducers/something-reducer';
import { Unavailable } from './unavailable/unavailable';
import { TStore } from '../../store/app-store';

import './styles.scss';

/**
 * Dashboard component.
 */
export const Dashboard: FC = (): JSX.Element => {
  const navigate: NavigateFunction = useNavigate();
  const { login, something }: { login: TLoginState, something: TSomethingState } = useSelector((state: TStore) => state);
  const dispatch: Dispatch<unknown> = useDispatch();

  const getSomething: () => void = useCallback(() => {
    dispatch(getSomethingAction());
  }, [dispatch]);

  const logout: () => void = useCallback(() => {
    dispatch(logoutAction());
  }, [dispatch]);

  useEffect(() => {
    if (!login.token) {
      navigate('/login');
    }
  }, [login, navigate]);

  return (
    <>
      <Header title="Dashboard" data-testid="header"/>
      <main className="container">
        <section className="content">
          <button className="btn btn--md" onClick={getSomething} data-testid="getsomething">Get Something</button>

          <article className="content__article">
            <h6 className="content__article-title">Title</h6>
            <p><Unavailable value={something.title} data-testid="unavailable-title"/></p>
            <h6 className="content__article-title">Body</h6>
            <p><Unavailable value={something.body} data-testid="unavailable-body"/></p>
          </article>
        </section>

        <section className="logout">
          <button className="btn btn--md" onClick={logout} data-testid="logout">Logout</button>
        </section>
      </main>
    </>
  );
};
