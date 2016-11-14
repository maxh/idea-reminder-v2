import fetch from 'isomorphic-fetch'

export const VERIFY_REQUEST = 'VERIFY_REQUEST'
export const VERIFY_FAILURE = 'VERIFY_FAILURE'
export const VERIFY_SUCCESS = 'VERIFY_SUCCESS'
export const SUBSCRIBE_REQUEST = 'SUBSCRIBE_REQUEST'
export const SUBSCRIBE_FAILURE = 'SUBSCRIBE_FAILURE'
export const SUBSCRIBE_SUCCESS = 'SUBSCRIBE_SUCCESS'
export const SUBSCRIBE_EDIT = 'SUBSCRIBE_EDIT'

export const SubscribeStatus = {
  EDIT: 'edit',
  LOAD: 'load',
  FAILURE: 'failure',
  SUCCESS: 'success'
};

function serverFailure(actionType, errorMessage) {
  return {
    type: actionType,
    errorMessage: errorMessage || 'Unknown server error.'
  }
}

export function startSubscribe(email) {
  return dispatch => {
  	dispatch({type: SUBSCRIBE_REQUEST});
    let options = {
    	method: 'POST',
      headers: new Headers({'Content-Type': 'application/json'}),
    	body: JSON.stringify({'email': email})
    };
    return fetch('/api/users', options)
        .then(response => {
          if (response.ok) {
            dispatch({type: SUBSCRIBE_SUCCESS});
          } else {
            var contentType = response.headers.get('content-type');
            if (contentType && contentType.indexOf('application/json') !== -1) {
              return response.json().then(json => {
                throw Error(json['message']);
              });
            } else {
              throw Error();
            }
          }
        })
        .catch(error => {
          dispatch(serverFailure(SUBSCRIBE_FAILURE, error.message));
        });
  };
}

export function editEmail(email) {
  return {
    type: SUBSCRIBE_EDIT,
    email: email
  }
}

function verifySuccess(email) {
  return {
    type: VERIFY_SUCCESS,
    email: email
  }
}

export function startVerify(userId, linkCode) {
  return dispatch => {
    dispatch({type: VERIFY_REQUEST});
    let options = {
      method: 'PATCH',
      headers: new Headers({
        'Content-Type': 'application/json',
        'X-IdeaReminder-LinkCode': linkCode
      }),
      body: JSON.stringify({'isVerified': true})
    };
    return fetch(`/api/users/${userId}`, options)
        .then(response => {
          var contentType = response.headers.get('content-type');
          if (contentType && contentType.indexOf('application/json') !== -1) {
            return response.json().then(json => {
              if (response.ok) {
                dispatch(verifySuccess(json['email']));
              } else {
                throw Error(json['message']);
              }
            });
          } else {
            throw Error();
          }
        })
        .catch(error => {
          dispatch(serverFailure(VERIFY_FAILURE, error.message));
        });
  };
}