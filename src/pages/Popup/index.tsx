import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { Store } from 'webext-redux';
import Popup from './Popup';
import './index.css';

const store = new Store();

store.ready().then(() => {
  render(
    <Provider store={store}>
      <Popup />
    </Provider>,
    window.document.querySelector('#app-container')
  );
});
