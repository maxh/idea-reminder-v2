import { combineReducers } from 'redux'
import { SubscribeStatus } from '../actions/index.js'


function subscribe(state = {status: SubscribeStatus.EDIT}, action) {
  let update;
  switch (action.type) {
    case 'SUBSCRIBE_EDIT':
      update = {
        status: SubscribeStatus.EDIT,
        email: action.email,
        errorMessage: null
      }
      break;
    case 'SUBSCRIBE_REQUEST':
      update = {status: SubscribeStatus.LOAD}
      break;
    case 'SUBSCRIBE_FAILURE':
      update = {
        status: SubscribeStatus.FAILURE,
        errorMessage: action.errorMessage
      };
      break;
    case 'SUBSCRIBE_SUCCESS':
      update = {status: SubscribeStatus.SUCCESS};
      break;
    default:
      update = {};
  }
  return Object.assign({}, state, update);
}

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

function verify(state = {isFetching: true}, action) {
  let update;
  switch (action.type) {
    case 'VERIFY_SUCCESS':
      update = {
        isFetching: false,
        verifiedEmail: action.email
      };
      break;
    case 'VERIFY_FAILURE':
      update = {
        isFetching: false,
        errorMessage: action.errorMessage
      };
      break;
    default:
      update = {};
  }
  return Object.assign({}, state, update);
}

const rootReducer = combineReducers({user, subscribe, verify});

export default rootReducer;