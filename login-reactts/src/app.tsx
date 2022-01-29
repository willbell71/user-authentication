import React, { FC, useCallback } from 'react';
import reactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import { AppStore } from './store/app-store';
import { Dashboard } from './components/dashboard/dashboard';
import { Login } from './components/login/login';
import { Register } from './components/register/register';
import { TFormValidationRule } from './tform-validation-rule';

import './styles.scss';

/**
 * App component.
 */
const App: FC = () => {
  /**
   * Validate a list of values.
   * @param {FormValidationRule[]} validationRules -
   * @param {Record<string, string>} values -
   * @param {Record<string, string>} errorMsgs -
   * @return {boolean} if all rules pass validation.
   */
  const validator: (validationRules: TFormValidationRule[], values: Record<string, string>, errorMsgs: Record<string, string>) => boolean =
    useCallback((validationRules: TFormValidationRule[], values: Record<string, string>, errorMsgs: Record<string, string>): boolean => {
      // assume validation passed
      let valid: boolean = true;
      validationRules.forEach((rule: TFormValidationRule) => {
        if (!rule.validator(values[rule.prop])) {
          // set error message
          errorMsgs[rule.prop] = rule.error;
          // flag validation failed
          valid = false;
        }
      });

      return valid;
    }, []);

  /**
   * Render login component.
   * @return {JSX.Element} component render.
   */
  const loginComponent:() => JSX.Element = useCallback(() => {
    return (
      <Login validator={validator}/>
    );
  }, [validator]);

  /**
   * Render register component.
   * @return {JSX.Element} component render.
   */
  const registerComponent: () => JSX.Element = useCallback(() => {
    return (
      <Register validator={validator}/>
    );
  }, [validator]);

  /**
   * Render.
   * @return {JSX.Element} component render.
   */
  return (
    <Provider store={AppStore.getStore()}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/login" element={loginComponent()}/>
          <Route path="/register" element={registerComponent()}/>
        </Routes>
      </BrowserRouter>
    </Provider>
  );
};

reactDOM.render(<App/>, document.getElementById('app'));
