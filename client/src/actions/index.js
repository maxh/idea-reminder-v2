import { CALL_API } from '../middleware/api'

import { push } from 'react-router-redux'

const AUTH_CLIENT_ID = '116575144698-gk68303mu8j2snb048ajsdq9mhe3s56u.apps.googleusercontent.com'

const fetchAuthLib = () => {
  return new Promise(function(resolve, reject) {
    const firstScriptEl = document.getElementsByTagName('script')[0];
    let scriptEl = document.createElement('script');
    scriptEl.id = 'google-gapi';
    scriptEl.src = '//apis.google.com/js/client:platform.js';
    scriptEl.onload = resolve;
    scriptEl.onerror = reject;
    firstScriptEl.parentNode.insertBefore(scriptEl, firstScriptEl);
  });
}

const finishSignIn = (res) => {
  const basicProfile = res.getBasicProfile();
  const authResponse = res.getAuthResponse();
  res.googleId = basicProfile.getId();
  res.tokenObj = authResponse;
  res.tokenId = authResponse.id_token;
  res.accessToken = authResponse.access_token;
  res.profileObj = {
    googleId: basicProfile.getId(),
    imageUrl: basicProfile.getImageUrl(),
    email: basicProfile.getEmail(),
    name: basicProfile.getName(),
    givenName: basicProfile.getGivenName(),
    familyName: basicProfile.getFamilyName(),
  };
  return {
    type: 'GOOGLE_SIGN_IN_SUCCESS',
    googleUser: res
  };
}

export const pushPath = (path) => {
  return push(path);
}

const ensureAuthLibLoaded = () => {
  return (dispatch, getState) => {
    const authLib = getState().authLib;
    if (authLib.promise) {
      return authLib.promise;  // Already loading.
    }

    const promise = new Promise((resolve, reject) => {
      fetchAuthLib()
          .then(() => {
            const params = {client_id: AUTH_CLIENT_ID};
            window.gapi.load('auth2', () => {
              window.gapi.auth2.init(params).then(() => {
                resolve(dispatch({type: 'AUTH_LIB_LOAD_SUCCESS'}));
              });
            });
          })
          .catch((error) => {
            dispatch({
              type: 'AUTH_LIB_LOAD_FAILURE',
              error: 'Unable to load authentication library. Try refreshing.'
            });
          })
    });

    dispatch({type: 'AUTH_LIB_LOAD_REQUEST', promise: promise});
    return promise;
  }
}

const withAuth = (dispatch, func) => {
  return dispatch(ensureAuthLibLoaded()).then(() => {
    return func(window.gapi.auth2.getAuthInstance());
  })
}

export const attemptAutoSignIn = () => {
  return dispatch => {
    dispatch({type: 'GOOGLE_SIGN_IN_REQUEST'});
    return withAuth(dispatch, auth => {
      if (auth.isSignedIn.get()) {
        return dispatch(finishSignIn(auth.currentUser.get()));
      } else {
        dispatch({type: 'GOOGLE_SIGN_OUT_SUCCESS'});
      }
    });
  };
}

export const startSignIn = () => {
  return dispatch => {
    dispatch({type: 'GOOGLE_SIGN_IN_REQUEST'})
    return withAuth(dispatch, auth =>
      auth.signIn().then(
          res => dispatch(finishSignIn(res)),
          error => dispatch({
            type: 'GOOGLE_SIGN_IN_FAILURE',
            error: 'Unable to sign in. Try refreshing.'
          }))
    );
  };
}

export const startSignOut = (email) => {
  return dispatch => {
    dispatch({type: 'GOOGLE_SIGN_OUT_REQUEST'})
    return withAuth(dispatch, auth =>
      auth.signOut().then(() => {
        dispatch({type: 'GOOGLE_SIGN_OUT_SUCCESS'})
      }));
  };
}


export const ACCOUNT_REQUEST = 'ACCOUNT_REQUEST'
export const ACCOUNT_SUCCESS = 'ACCOUNT_SUCCESS'
export const ACCOUNT_FAILURE = 'ACCOUNT_FAILURE'

export const ensureAccountCreated = (googleUser) => {
  return {
    [CALL_API]: {
      endpoint: `/account`,
      types: [ACCOUNT_REQUEST, ACCOUNT_SUCCESS, ACCOUNT_FAILURE],
      method: 'POST'
    }
  }; 
}

export const updateAccount = (update) => {
  return {
    [CALL_API]: {
      endpoint: `/account`,
      types: [ACCOUNT_REQUEST, ACCOUNT_SUCCESS, ACCOUNT_FAILURE],
      method: 'PATCH',
      content: update
    }
  };
}

export const loadAccount = () => {
  return {
    [CALL_API]: {
      endpoint: `/account`,
      types: [ACCOUNT_REQUEST, ACCOUNT_SUCCESS, ACCOUNT_FAILURE],
      method: 'GET'
    }
  };
}

export const startUnsubscribe = () => {
  return updateAccount({isEnabled: false});
}


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


export const IDEAS_REQUEST = 'IDEAS_REQUEST'
export const IDEAS_FAILURE = 'IDEAS_FAILURE'
export const IDEAS_SUCCESS = 'IDEAS_SUCCESS'

export const startList = () => {
  return (dispatch, getState) => {
    return dispatch({
      [CALL_API]: {
        endpoint: `/responses`,
        types: [IDEAS_REQUEST, IDEAS_SUCCESS, IDEAS_FAILURE],
      }
    });
  }  
}
