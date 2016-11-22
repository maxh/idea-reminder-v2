import { CALL_API } from '../middleware/api'

export const SET_AUTH = 'SET_AUTH'

export const setAuth = (userId, linkCode) => {
  return {
    type: SET_AUTH,
    userId: userId,
    linkCode: linkCode
  }
}

export const CLEAR_ERROR = 'CLEAR_ERROR'

export const clearError = () => {
  return {type: CLEAR_ERROR}
}


export const SUBSCRIBE_EMAIL_EDIT = 'SUBSCRIBE_EMAIL_EDIT'

export const editSubscribeEmail = (email) => {
  return {
    type: SUBSCRIBE_EMAIL_EDIT,
    subscribeEmail: email
  }
}


export const USER_REQUEST = 'USER_REQUEST'
export const USER_SUCCESS = 'USER_SUCCESS'
export const USER_FAILURE = 'USER_FAILURE'

const startUserRequest = (options) => {
  return (dispatch, getState) => {
    const userId = getState().user.userId;
    dispatch({[CALL_API]: {
      ...options,
      endpoint: `/users/${userId}`,
      types: [USER_REQUEST, USER_SUCCESS, USER_FAILURE],
    }});
  };
}

export const fetchUser = () => {
  return startUserRequest({
    method: 'GET'
  });
}

export const startVerify = () => {
  return startUserRequest({
    method: 'PATCH',
    content: {isVerified: true},
    page: 'verify'
  });
}

export const startUnsubscribe = () => {
  return startUserRequest({
    method: 'PATCH',
    content: {isEnabled: false},
    page: 'unsubscribe'
  });
}

export const startSubscribe = (email) => {
  return {
    [CALL_API]: {
      endpoint: '/users',
      types: [USER_REQUEST, USER_SUCCESS, USER_FAILURE],
      method: 'POST',
      content: {email: email},
      page: 'home'
    }
  };
}


export const IDEAS_REQUEST = 'IDEAS_REQUEST'
export const IDEAS_FAILURE = 'IDEAS_FAILURE'
export const IDEAS_SUCCESS = 'IDEAS_SUCCESS'

export const startList = (userId, linkCode) => {
  return {
    [CALL_API]: {
      endpoint: `/users/${userId}/ideas`,
      types: [IDEAS_REQUEST, IDEAS_SUCCESS, IDEAS_FAILURE],
      options: {
        method: 'GET',
        linkCode: linkCode
      }
    }
  };
}