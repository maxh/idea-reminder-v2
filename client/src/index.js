import React from 'react';
import ReactDOM from 'react-dom';
import 'bootstrap/dist/css/bootstrap.css';
import App from './components/App';
import { Provider } from 'react-redux';
import { combineReducers, createStore, applyMiddleware } from 'redux';
import reducers from './reducers/index.js';
import thunk from 'redux-thunk';
import api from './middleware/api.js';
import './index.css';
import { syncHistoryWithStore, routerMiddleware, routerReducer, push } from 'react-router-redux'
import { browserHistory } from 'react-router';
import { clearError, attemptAutoSignIn, ensureAccountCreated } from './actions/index.js';


const store = createStore(
  combineReducers({
    ...reducers,
    routing: routerReducer
  }),
  applyMiddleware(thunk, api, routerMiddleware(browserHistory))
);

// Create an enhanced history that syncs navigation events with the store
const history = syncHistoryWithStore(browserHistory, store)

// When the user changes the route, clear the error.
history.listen(location => clearError())

// When the user signs in, ensure they have an account in our backend.
// When the user signs out, leave them on the home page.
const monitorSignInState = () => {
  let current
  store.subscribe(() => {
    let previous = current
    current = store.getState().googleUser.current;
    if (previous !== current) {
      if (current) {
        store.dispatch(ensureAccountCreated(current));
      } else {
        store.dispatch(push('/'));
      }
    }
  })
}
monitorSignInState();

store.dispatch(attemptAutoSignIn())

ReactDOM.render(
  <Provider store={store}>
    <App history={history} />
  </Provider>,
  document.getElementById('root')
)