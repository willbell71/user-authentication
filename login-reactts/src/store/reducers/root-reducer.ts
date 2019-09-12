import {combineReducers, Reducer} from 'redux';

import { loginReducer } from './login-reducer';
import { somethingReducer } from './something-reducer';

export const rootReducer: Reducer = combineReducers({
  login: loginReducer,
  something: somethingReducer
});
