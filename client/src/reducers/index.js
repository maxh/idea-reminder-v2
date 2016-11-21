import { combineReducers } from 'redux'
import * as ActionTypes from '../actions'


function subscribe(state = {isFetching: false}, action) {
  switch (action.type) {
    case ActionTypes.SUBSCRIBE_EDIT:
      return {
        ...state,
        email: action.email,
        errorMessage: null
      };
    case ActionTypes.SUBSCRIBE_REQUEST:
      return {
        ...state,
        isFetching: true
      };
    case ActionTypes.SUBSCRIBE_FAILURE:
      return {
        ...state,
        isFetching: false,
        errorMessage: action.errorMessage
      };
    case ActionTypes.SUBSCRIBE_SUCCESS:
      return {
        ...state,
        isFetching: false,
        isDone: true
      };
    default:
      return state;
  }
}

function verify(state = {isFetching: true}, action) {
  switch (action.type) {
    case ActionTypes.VERIFY_SUCCESS:
      return {
        ...state,
        isFetching: false,
        verifiedEmail: action.response.email
      };
    case ActionTypes.VERIFY_FAILURE:
      return {
        ...state,
        isFetching: false,
        errorMessage: action.errorMessage
      };
    default:
      return state;
  }
}

function list(state = {isFetching: true}, action) {
  switch (action.type) {
    case ActionTypes.LIST_SUCCESS:
      return {
        ...state,
        isFetching: false,
        ideas: action.response.ideas
      };
    case ActionTypes.LIST_FAILURE:
      return {
        ...state,
        isFetching: false,
        errorMessage: action.errorMessage
      };
    default:
      return state;
  }
}

function unsubscribe(state = {}, action) {
  switch (action.type) {
    case ActionTypes.UNSUBSCRIBE_SUCCESS:
      return {
        ...state,
        isFetching: false,
        isDone: true
      };
    case ActionTypes.UNSUBSCRIBE_FAILURE:
      return {
        ...state,
        isFetching: false,
        errorMessage: action.errorMessage
      };
    default:
      return state;
  }
}

const rootReducer = combineReducers({subscribe, verify, list, unsubscribe});

export default rootReducer;