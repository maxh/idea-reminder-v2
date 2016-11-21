import React from 'react';
import ReactDOM from 'react-dom';
import 'bootstrap/dist/css/bootstrap.css';
import App from './components/App';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import rootReducer from './reducers/index.js';
import thunk from 'redux-thunk';
import api from './middleware/api.js';
import './index.css';

const store = createStore(
  rootReducer,
  applyMiddleware(thunk, api)
);

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
)
