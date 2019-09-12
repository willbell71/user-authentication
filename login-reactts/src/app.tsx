import * as React from 'react';
import * as reactDOM from 'react-dom';
import { BrowserRouter, Redirect, Route, Switch } from 'react-router-dom';
import { Provider } from 'react-redux';

import { AppStore } from './store/app-store';
import { Dashboard } from './components/dashboard/dashboard';
import { Login } from './components/login/login';
import { Register } from './components/register/register';

import './styles.scss';

/**
 * App component.
 * @return {JSX.Element} render.
 */
function App(): JSX.Element {
  return (
    <Provider store={AppStore.getStore()}>
      <BrowserRouter>
        <Switch>
          <Route path="/" exact component={Dashboard}/>
          <Route path="/login" component={Login}/>
          <Route path="/register" component={Register}/>
          <Redirect from="*" to="/"/>
        </Switch>
      </BrowserRouter>
    </Provider>      
  );
}

reactDOM.render(<App/>, document.getElementById('app'));
