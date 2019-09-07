import * as React from 'react';
import * as reactDOM from 'react-dom';
import {BrowserRouter, Redirect,　Route, Switch} from 'react-router-dom';

import {Dashboard} from './dashboard/dashboard';
import {Login} from './login/login';
import {Register} from './register/register';

import './styles.scss';

/**
 * App component.
 * @return {JSX.Element} render.
 */
function App(): JSX.Element {
  return (
    <BrowserRouter>
      <Switch>
        <Route path="/" exact component={Dashboard}/>
        <Route path="/login" component={Login}/>
        <Route path="/register" component={Register}/>
        <Redirect from="*" to="/"/>
      </Switch>
    </BrowserRouter>
  );
}

reactDOM.render(<App/>, document.getElementById('app'));
