import { combineReducers } from 'redux'
import * as ActionTypes from '../actions'

/**

State tree design:

  {
    ideas: {
      isLoading: boolean,
      errorMessage: string,
      ideas: [...]
    },
    user: {
      isLoading: boolean,
      errorMessage: string,
      subscribeEmail: string,
      user: {...}
    }
  }

 */


function user(state = {}, action) {
  switch (action.type) {
    case ActionTypes.USER_REQUEST:
      return {
        ...state,
        isLoading: true,
        errorMessage: undefined
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
        isLoading: false,
        errorMessage: action.errorMessage
      };
    case ActionTypes.SUBSCRIBE_EMAIL_EDIT:
      return {
        ...state,
        subscribeEmail: action.subscribeEmail,
        errorMessage: undefined
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

const rootReducer = combineReducers({ideas, user});

export default rootReducer;