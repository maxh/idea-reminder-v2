import { CALL_API } from '../middleware/api'


export const SUBSCRIBE_REQUEST = 'SUBSCRIBE_REQUEST'
export const SUBSCRIBE_FAILURE = 'SUBSCRIBE_FAILURE'
export const SUBSCRIBE_SUCCESS = 'SUBSCRIBE_SUCCESS'
export const SUBSCRIBE_EDIT = 'SUBSCRIBE_EDIT'

export const startSubscribe = (email) => {
  return {
    [CALL_API]: {
      endpoint: '/users',
      types: [SUBSCRIBE_REQUEST, SUBSCRIBE_SUCCESS, SUBSCRIBE_FAILURE],
      options: {
        method: 'POST',
        content: {email: email}
      }
    }
  };
}

export const editEmail = (email) => {
  return {
    type: SUBSCRIBE_EDIT,
    email: email
  }
}


export const VERIFY_REQUEST = 'VERIFY_REQUEST'
export const VERIFY_SUCCESS = 'VERIFY_SUCCESS'
export const VERIFY_FAILURE = 'VERIFY_FAILURE'

export const startVerify = (userId, linkCode) => {
  return {
    [CALL_API]: {
      endpoint: `/users/${userId}`,
      types: [VERIFY_REQUEST, VERIFY_SUCCESS, VERIFY_FAILURE],
      options: {
        method: 'PATCH',
        linkCode: linkCode,
        content: {isVerified: true}
      }
    }
  };
}


export const LIST_REQUEST = 'LIST_REQUEST'
export const LIST_FAILURE = 'LIST_FAILURE'
export const LIST_SUCCESS = 'LIST_SUCCESS'

export const startList = (userId, linkCode) => {
  return {
    [CALL_API]: {
      endpoint: `/users/${userId}/ideas`,
      types: [LIST_REQUEST, LIST_SUCCESS, LIST_FAILURE],
      options: {
        method: 'GET',
        linkCode: linkCode
      }
    }
  };
}


export const UNSUBSCRIBE_REQUEST = 'UNSUBSCRIBE_REQUEST'
export const UNSUBSCRIBE_FAILURE = 'UNSUBSCRIBE_FAILURE'
export const UNSUBSCRIBE_SUCCESS = 'UNSUBSCRIBE_SUCCESS'

export const startUnsubscribe = (userId, linkCode) => {
  return {
    [CALL_API]: {
      endpoint: `/users/${userId}`,
      types: [UNSUBSCRIBE_REQUEST, UNSUBSCRIBE_SUCCESS, UNSUBSCRIBE_FAILURE],
      options: {
        method: 'PATCH',
        linkCode: linkCode,
        content: {isEnabled: false}
      }
    }
  };
}