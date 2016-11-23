import { CALL_API } from '../middleware/api'

import { push } from 'react-router-redux'

const fetchAuthLib = (callback) => {
  const firstScriptEl = document.getElementsByTagName('script')[0];
  let scriptEl = document.createElement('script');
  scriptEl.id = 'google-gapi';
  scriptEl.src = '//apis.google.com/js/client:platform.js';
  scriptEl.onload = callback;
  firstScriptEl.parentNode.insertBefore(scriptEl, firstScriptEl);
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

export const ensureAuthLibLoaded = () => {
  return (dispatch, getState) => {
    const authLib = getState().authLib;
    if (authLib.promise) {
      return authLib.promise;  // Already loading.
    }

    const promise = new Promise((resolve, reject) => {
      fetchAuthLib(() => {
        const params = {
          client_id: '116575144698-gk68303mu8j2snb048ajsdq9mhe3s56u.apps.googleusercontent.com'
        };
        window.gapi.load('auth2', () => {
          window.gapi.auth2.init(params).then(() => {
            resolve(dispatch({type: 'AUTH_LIB_LOAD_SUCCESS'}));
          });
        });
      });
    });
    return dispatch({type: 'AUTH_LIB_LOAD_REQUEST', promise: promise});
  }
}

export const attemptAutoSignIn = () => {
  return (dispatch, getState) => {
    return dispatch(ensureAuthLibLoaded()).then(() => {
      let auth2 = getState().authLib.instance;
      if (auth2.isSignedIn.get()) {
        return dispatch(finishSignIn(auth2.currentUser.get()));
      } else {
        return Promise.resolve();
      }
    });
  };
}

export const startSignIn = () => {
  return (dispatch, getState) => {
    dispatch({type: 'GOOGLE_SIGN_IN_REQUEST'})
    getState().authLib.instance.signIn().then((res) => {
      dispatch(finishSignIn(res));
    });
  };
}

export const startSignOut = (email) => {
  return (dispatch, getState) => {
    dispatch({type: 'GOOGLE_SIGN_OUT_SUCCESS'})
    getState().authLib.instance.signOut().then(() => {
      dispatch({type: 'GOOGLE_SIGN_OUT_SUCCESS'})
    })
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
    return dispatch(attemptAutoSignIn()).then(() => {
      return dispatch({
        [CALL_API]: {
          endpoint: `/responses`,
          types: [IDEAS_REQUEST, IDEAS_SUCCESS, IDEAS_FAILURE],
        }
      });
    });
  }  
}
