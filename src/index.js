import firebase from 'firebase/firebase-browser';
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { Provider } from 'react-redux';
import { createStore, combineReducers } from 'redux';

import './index.css';
import 'bootstrap/dist/css/bootstrap.css';

var config = {
  apiKey: 'AIzaSyDjcb-gDiFSbjnb6Q10bKxAPnjX1rn2OWk',
  authDomain: 'idea-reminder-v2.firebaseapp.com',
  databaseURL: 'https://idea-reminder-v2.firebaseio.com',
  storageBucket: 'idea-reminder-v2.appspot.com',
  messagingSenderId: '168244505801'
};

firebase.initializeApp(config);

function user(state = {isFetching: true}, action) {
  switch (action.type) {
    case 'SET_USER':
      return {
      	isFetching: false,
      	current: action.user
      };
  default:
    return state;
  }
}
const reducer = combineReducers({user});

const store = createStore(reducer);

firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
     store.dispatch({
      type: 'SET_USER',
      user: user
    });
  }
});

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
)
