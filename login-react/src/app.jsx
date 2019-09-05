import React from 'react';
import reactDOM from 'react-dom';
import {BrowserRouter, Redirect,　Route, Switch} from 'react-router-dom';

import {Dashboard} from './dashboard/dashboard.jsx';
import {Login} from './login/login.jsx';
import {Register} from './register/register.jsx';

import './styles.scss';

/**
 * App component.
 * @return {JSX} render.
 */
function App() {
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
