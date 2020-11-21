import { applyMiddleware, createStore } from 'redux';
import rootReducer from './reducers';
import thunk from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';
import { createLogger } from 'redux-logger';
import { alias } from 'webext-redux';
import aliases from './aliases';

const getEnhancers = () => {
  if (process.env.NODE_ENV === 'development') {
    console.info('Developmet environment enabled!');
    return composeWithDevTools(
      applyMiddleware(alias(aliases), thunk, createLogger())
    );
  } else {
    return applyMiddleware(alias(aliases), thunk);
  }
};

const store = createStore(rootReducer, getEnhancers());

export default store;
