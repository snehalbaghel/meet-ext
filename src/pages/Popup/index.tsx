import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { Store, applyMiddleware } from 'webext-redux';
import Popup from './Popup';
import './index.css';
import { ThemeProvider } from 'styled-components';
import thunkMiddleware from 'redux-thunk';

let store = new Store();

store = applyMiddleware(store, thunkMiddleware);

const theme = {
  commandBlue: '#006E9B',
  errorRedLight: '#ffcdd2',
  errorRed: '#E06F5D',
  errorRedDark: '#CE4A50',
  grey: '#D4D4D4',
  greyDarkest: '#757575',
  greyDarker: '#a5a5a5',
  greyLight: '#ebebeb',
  greyLighter: '#F2F3F3',
  greyLightest: '#F0F0F0',
  funPurple: '#F0F0FA',
};

store.ready().then(() => {
  render(
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <Popup />
      </ThemeProvider>
    </Provider>,
    window.document.querySelector('#app-container')
  );
});
