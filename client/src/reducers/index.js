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
        isLoading: false    
      }
    case 'AUTH_LIB_LOAD_FAILURE':
      return {
        ...state,
        isLoading: false,
        error: action.error     
      }
    default:
      return state;
  }
}

function googleUser(state = {isLoading: false}, action) {
  switch (action.type) {
    case 'GOOGLE_SIGN_IN_REQUEST':
    case 'GOOGLE_SIGN_OUT_REQUEST':
      return {
        isLoading: true,
        error: undefined
      };
    case 'GOOGLE_SIGN_IN_SUCCESS':
      return {
        isLoading: false,
        current: action.googleUser
      };
    case 'GOOGLE_SIGN_OUT_SUCCESS':
      return {
        isLoading: false,
        current: undefined
      };
    case 'GOOGLE_SIGN_IN_FAILURE':
    case 'GOOGLE_SIGN_OUT_FAILURE':
      return {
        isLoading: false,
        error: action.error
      };
  default:
    return state;
  }
}

function account(state = {isLoading: false}, action) {
  switch (action.type) {
    case ActionTypes.ACCOUNT_REQUEST:
      return {
        ...state,
        isLoading: true,
        error: undefined
      };
    case ActionTypes.ACCOUNT_SUCCESS:
      return {
        ...state,
        isLoading: false,
        current: action.response
      };
    case ActionTypes.ACCOUNT_FAILURE:
      return {
        ...state,
        isLoading: false,
        error: action.error
      };
    default:
      return state;
  }
}

function unsubscribe(state = {isLoading: false}, action) {
  switch (action.type) {
    case 'UNSUBSCRIBE_REQUEST':
      return {
        ...state,
        isLoading: true,
        error: undefined
      };
    case 'UNSUBSCRIBE_SUCCESS':
      return {
        ...state,
        isLoading: false,
        isSuccess: true
      };
    case 'UNSUBSCRIBE_FAILURE':
      return {
        ...state,
        isLoading: false,
        error: action.error
      };
    default:
      return state;
  }
}

function ideas(state = {}, action) {
  switch (action.type) {
    case ActionTypes.IDEAS_REQUEST:
      const endpoint = action.endpoint;
      const split = endpoint && endpoint.split('=');
      let page = split && split[1];
      page = page ? parseInt(page) : 1;
      return {
        ...state,
        isLoading: true,
        currentPage: page,
        error: undefined
      };
    case ActionTypes.IDEAS_SUCCESS:
      return {
        ...state,
        isLoading: false,
        ideas: action.response.ideas,
        links: action.response.links
      };
    case ActionTypes.IDEAS_FAILURE:
      return {
        ...state,
        isLoading: false,
        error: action.error
      };
    default:
      return state;
  }
}

export default {
  account,
  authLib,
  linkCode,
  ideas,
  googleUser,
  unsubscribe
};
