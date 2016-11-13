import firebase from 'firebase/firebase-browser';
import React from 'react';
import ReactDOM from 'react-dom';
import 'bootstrap/dist/css/bootstrap.css';
import App from './components/App/App.js';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import rootReducer from './reducers/index.js';
import thunk from 'redux-thunk';
import './index.css';

const store = createStore(
  rootReducer,
  applyMiddleware(thunk)
);

firebase.initializeApp({
  apiKey: 'AIzaSyDjcb-gDiFSbjnb6Q10bKxAPnjX1rn2OWk',
  authDomain: 'idea-reminder-v2.firebaseapp.com',
  databaseURL: 'https://idea-reminder-v2.firebaseio.com',
  storageBucket: 'idea-reminder-v2.appspot.com',
  messagingSenderId: '168244505801'
});

firebase.auth().onAuthStateChanged(function(user) {
   store.dispatch({
    type: 'SET_USER',
    user: user
  });
});

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
)
