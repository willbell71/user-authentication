import { combineReducers, Reducer } from 'redux';

import { loginReducer } from './login-reducer';
import { somethingReducer } from './something-reducer';
import { TAction } from '../actions/taction';
import { TLoginActionPayload } from '../actions/login/tlogin-action-payload';
import { TStore } from '../app-store';

export const rootReducer: Reducer<TStore, TAction<TLoginActionPayload>> = combineReducers({
  login: loginReducer,
  something: somethingReducer
});
