import * as ActionTypes from '../actions'

function linkCode(state = null, action) {
  switch (action.type) {
    case ActionTypes.SET_AUTH:
      return action.linkCode || state;
    default:
      return state;
  }
}

function authLib(state = {isLoading: false}, action) {
  switch (action.type) {
    case 'AUTH_LIB_LOAD_REQUEST':
      return {
        isLoading: true,
        promise: action.promise
      };
    case 'AUTH_LIB_LOAD_SUCCESS':
      return {
        ...state,
        isLoading: false,
        instance: window.gapi.auth2.getAuthInstance()        
      }
    default:
      return state;
  }
}

function googleUser(state = {isFetching: false}, action) {
  switch (action.type) {
    case 'GOOGLE_SIGN_IN_REQUEST':
    case 'GOOGLE_SIGN_OUT_REQUEST':
      return {
        isFetching: true
      };
    case 'GOOGLE_SIGN_IN_SUCCESS':
      return {
        isFetching: false,
        current: action.googleUser
      };
    case 'GOOGLE_SIGN_OUT_SUCCESS':
      return {
        isFetching: false,
        current: null
      };
  default:
    return state;
  }
}

function error(state = '', action) {
  switch (action.type) {
    case ActionTypes.USER_FAILURE:
    case ActionTypes.IDEAS_FAILURE:
      return action.errorMessage;
    case ActionTypes.CLEAR_ERROR:
      return '';
    default:
      return state;
  }
}

function unsubscribe(state = {}, action) {
  switch (action.type) {
    case ActionTypes.IDEAS_REQUEST:
      return {
        ...state,
        isLoading: true
      };
    case ActionTypes.IDEAS_SUCCESS:
      return {
        ...state,
        isLoading: false,
        ideas: action.response.ideas
      };
    case ActionTypes.IDEAS_FAILURE:
      return {
        ...state,
        isLoading: false,
        errorMessage: action.errorMessage
      };
    default:
      return state;
  }
}

function ideas(state = {}, action) {
  switch (action.type) {
    case ActionTypes.IDEAS_REQUEST:
      return {
        ...state,
        isLoading: true
      };
    case ActionTypes.IDEAS_SUCCESS:
      return {
        ...state,
        isLoading: false,
        ideas: action.response.ideas
      };
    case ActionTypes.IDEAS_FAILURE:
      return {
        ...state,
        isLoading: false,
        errorMessage: action.errorMessage
      };
    default:
      return state;
  }
}

export default {
  error,
  authLib,
  linkCode,
  ideas,
  googleUser
};