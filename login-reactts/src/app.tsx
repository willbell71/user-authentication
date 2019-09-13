import * as React from 'react';
import * as reactDOM from 'react-dom';
import { BrowserRouter, Redirect, Route, Switch } from 'react-router-dom';
import { Provider } from 'react-redux';

import { AppStore } from './store/app-store';
import { Dashboard } from './components/dashboard/dashboard';
import { FormValidationRule } from './tform-validation-rule';
import { Login } from './components/login/login';
import { Register } from './components/register/register';

import './styles.scss';

/**
 * App component.
 */
class App extends React.Component {
  /**
   * Validate a list of values.
   * @param {FormValidationRule[]} validationRules -
   * @param {any} values -
   * @param {any} errorMsgs -
   * @return {boolean} if all rules pass validation.
   */
  private validator: (validationRules: FormValidationRule[], values: any, errorMsgs: any) => boolean =
    (validationRules: FormValidationRule[], values: any, errorMsgs: any) => {
      // assume validation passed
      let valid: boolean = true;
      validationRules.forEach((rule: FormValidationRule) => {
        if (!rule.validator(values[rule.prop])) {
          // set error message
          errorMsgs[rule.prop] = rule.error;
          // flag validation failed
          valid = false;
        }
      });

      return valid;
    };

  /**
   * Render login component.
   * @return {JSX.Element} component render.
   */
  private loginComponent: () => JSX.Element = () => {
    return (
      <Login validator={this.validator}/>
    );
  }

  /**
   * Render register component.
   * @return {JSX.Element} component render.
   */
  private registerComponent: () => JSX.Element = () => {
    return (
      <Register validator={this.validator}/>
    );
  };

  /**
   * Render.
   * @return {JSX.Element} component render.
   */
  public render(): JSX.Element {
    return (
      <Provider store={AppStore.getStore()}>
        <BrowserRouter>
          <Switch>
            <Route path="/" exact component={Dashboard}/>
            <Route path="/login" component={this.loginComponent}/>
            <Route path="/register" component={this.registerComponent}/>
            <Redirect from="*" to="/"/>
          </Switch>
        </BrowserRouter>
      </Provider>
    );
  }
}

reactDOM.render(<App/>, document.getElementById('app'));
