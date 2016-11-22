import * as ActionTypes from '../actions'

/**

State tree design:

  {
    linkCode: string,
    ideas: {
      isLoading: boolean,
      errorMessage: string,
      ideas: [...]
    },
    error: {
      [page]: string,

    },
    user: {
      isLoading: boolean,
      subscribeEmail: string,
      userId: string,
      user: {...}
    }
  }

 */


function linkCode(state = null, action) {
  switch (action.type) {
    case ActionTypes.SET_AUTH:
      return action.linkCode || state;
    default:
      return state;
  }
}

function user(state = {}, action) {
  switch (action.type) {
    case ActionTypes.SET_AUTH:
      return {
        ...state,
        userId: action.userId
      };
    case ActionTypes.USER_REQUEST:
      return {
        ...state,
        isLoading: true
      };
    case ActionTypes.USER_SUCCESS:
      return {
        ...state,
        isLoading: false,
        user: action.response
      };
    case ActionTypes.USER_FAILURE:
      return {
        ...state,
        isLoading: false
      };
    case ActionTypes.SUBSCRIBE_EMAIL_EDIT:
      return {
        ...state,
        subscribeEmail: action.subscribeEmail
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
  linkCode,
  ideas,
  user
};