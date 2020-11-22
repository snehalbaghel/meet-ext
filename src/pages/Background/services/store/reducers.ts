import { combineReducers } from 'redux';
import footerReducer from './footer/reducer';
import usersReducer from './users/reducer';

const rootReducer = combineReducers({
  users: usersReducer,
  footer: footerReducer,
});

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;
