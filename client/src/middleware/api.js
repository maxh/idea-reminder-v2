const API_ROOT = '/api';

const AUTH_HEADER = 'X-Google-Auth-Token-ID';

const makeApiCall = (options) => {
  const {endpoint, content, method, tokenId} = options;

  const path = API_ROOT + endpoint;
  const fetchOptions = {
    method: method || 'GET',
    headers: new Headers()
  };

  if (tokenId) {
    fetchOptions.headers.set(AUTH_HEADER, tokenId);
  }

  if (content) {
    fetchOptions.body = JSON.stringify(content);
    fetchOptions.headers.set('Content-Type', 'application/json');
  }

  return fetch(path, fetchOptions)
    .then(response =>
      response.json().then(json => {
        if (!response.ok) {
          return Promise.reject(json)
        }
        return Object.assign({}, json);
      })
    )
}

export const CALL_API = Symbol('Call API');

// A Redux middleware that interprets actions with CALL_API info specified.
// Performs the call and promises when such actions are dispatched.
export default store => next => action => {
  const callAPI = action[CALL_API]
  if (typeof callAPI === 'undefined') {
    return next(action)
  }

  const { endpoint, content, method, page, types } = callAPI

  if (typeof endpoint !== 'string') {
    throw new Error('Specify a string endpoint URL.')
  }
  if (!Array.isArray(types) || types.length !== 3) {
    throw new Error('Expected an array of three action types.')
  }
  if (!types.every(type => typeof type === 'string')) {
    throw new Error('Expected action types to be strings.')
  }

  const actionWith = data => {
    const finalAction = Object.assign({}, action, data)
    delete finalAction[CALL_API]
    return finalAction
  }

  const [ requestType, successType, failureType ] = types
  next(actionWith({ type: requestType }))

  const currentGoogleUser = store.getState().googleUser.current;
  const tokenId = currentGoogleUser && currentGoogleUser.tokenId;

  return makeApiCall({endpoint, content, method, tokenId}).then(
    response => next(actionWith({
      response,
      type: successType
    })),
    error => next(actionWith({
      type: failureType,
      page: page,
      errorMessage: error.message || 'Unknown server error.'
    }))
  )
}