import { CALL_API } from '../middleware/api'


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

export const startSubscribe = (email) => {
  return {
    [CALL_API]: {
      endpoint: '/users',
      types: [USER_REQUEST, USER_SUCCESS, USER_FAILURE],
      options: {
        method: 'POST',
        content: {email: email}
      }
    }
  };
}

export const startVerify = (userId, linkCode) => {
  return {
    [CALL_API]: {
      endpoint: `/users/${userId}`,
      types: [USER_REQUEST, USER_SUCCESS, USER_FAILURE],
      options: {
        method: 'PATCH',
        linkCode: linkCode,
        content: {isVerified: true}
      }
    }
  };
}

export const startUnsubscribe = (userId, linkCode) => {
  return {
    [CALL_API]: {
      endpoint: `/users/${userId}`,
      types: [USER_REQUEST, USER_SUCCESS, USER_FAILURE],
      options: {
        method: 'PATCH',
        linkCode: linkCode,
        content: {isEnabled: false}
      }
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