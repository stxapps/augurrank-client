import userSession from '@/userSession';
import { showConnect } from '@/connectWrapper';
import idxApi from '@/apis';
import {
  INIT, UPDATE_WINDOW, UPDATE_USER, UPDATE_POPUP, UPDATE_JOIN_NEWSLETTER, RESET_STATE,
} from '@/types/actionTypes';
import {
  APP_NAME, APP_ICON_NAME, ADD_NEWSLETTER_EMAIL_URL, VALID,
  JOIN_NEWSLETTER_STATUS_JOINING, JOIN_NEWSLETTER_STATUS_INVALID,
  JOIN_NEWSLETTER_STATUS_COMMIT, JOIN_NEWSLETTER_STATUS_ROLLBACK,
} from '@/types/const';
import {
  extractUrl, getUrlPathQueryHash, getUserUsername, getUserImageUrl, getUserStxAddr,
  throttle, isObject, validateEmail, getWindowInsets,
} from '@/utils';
import vars from '@/vars';

let _didInit;
export const init = () => async (dispatch, getState) => {
  if (_didInit) return;
  _didInit = true;

  const isUserSignedIn = userSession.isUserSignedIn();

  let username = null, userImage = null, userStxAddr = null, didAgreeTerms = null;
  if (isUserSignedIn) {
    const userData = userSession.loadUserData();
    username = getUserUsername(userData);
    userImage = getUserImageUrl(userData);
    userStxAddr = getUserStxAddr(userData);

    const extraUserData = idxApi.getExtraUserData();
    didAgreeTerms = extraUserData.didAgreeTerms;
  }

  dispatch({
    type: INIT,
    payload: { isUserSignedIn, username, userImage, userStxAddr, didAgreeTerms },
  });

  window.addEventListener('resize', throttle(() => {
    const insets = getWindowInsets();
    dispatch({
      type: UPDATE_WINDOW,
      payload: {
        width: window.innerWidth,
        height: window.innerHeight,
        insetTop: insets.top,
        insetRight: insets.right,
        insetBottom: insets.bottom,
        insetLeft: insets.left,
      },
    });
  }, 16));
  if (isObject(window.visualViewport)) {
    window.visualViewport.addEventListener('resize', throttle(() => {
      const insets = getWindowInsets();
      dispatch({
        type: UPDATE_WINDOW,
        payload: {
          visualWidth: window.visualViewport.width,
          visualHeight: window.visualViewport.height,
          insetTop: insets.top,
          insetRight: insets.right,
          insetBottom: insets.bottom,
          insetLeft: insets.left,
        },
      });
    }, 16));
  }
};

export const signOut = () => async (dispatch, getState) => {
  userSession.signUserOut();
  await resetState(dispatch);
};

export const signIn = () => async (dispatch, getState) => {
  const appIconUrl = extractUrl(window.location.href).origin + '/' + APP_ICON_NAME;
  showConnect({
    appDetails: { name: APP_NAME, icon: appIconUrl },
    redirectTo: '/' + getUrlPathQueryHash(window.location.href),
    onFinish: () => dispatch(updateUserSignedIn()),
    userSession: userSession._userSession,
    sendToSignIn: false,
  });
};

const updateUserSignedIn = () => async (dispatch, getState) => {
  await resetState(dispatch);

  const userData = userSession.loadUserData();
  dispatch(updateUser({
    isUserSignedIn: true,
    username: getUserUsername(userData),
    image: getUserImageUrl(userData),
    stxAddr: getUserStxAddr(userData),
  }));
};

const resetState = async (dispatch) => {
  idxApi.deleteAllLocalFiles();

  vars.gameBtc.didFetch = false;
  vars.me.didFetch = false;

  dispatch({ type: RESET_STATE });
};

export const updateUser = (payload) => {
  return { type: UPDATE_USER, payload };
};

export const updatePopup = (id, isShown, anchorPosition) => {
  return {
    type: UPDATE_POPUP,
    payload: { id, isShown, anchorPosition },
  };
};

export const joinNewsletter = () => async (dispatch, getState) => {
  const { email } = getState().joinNewsletter;

  if (!validateEmail(email)) {
    dispatch(updateJoinNewsletter({
      status: JOIN_NEWSLETTER_STATUS_INVALID, extraMsg: '',
    }));
    return;
  }

  dispatch(updateJoinNewsletter({
    status: JOIN_NEWSLETTER_STATUS_JOINING, extraMsg: '',
  }));
  try {
    const res = await fetch(ADD_NEWSLETTER_EMAIL_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      referrerPolicy: 'strict-origin',
      body: JSON.stringify({ email }),
    });
    if (!res.ok) {
      const extraMsg = res.statusText;
      dispatch(updateJoinNewsletter({
        status: JOIN_NEWSLETTER_STATUS_ROLLBACK, extraMsg,
      }));
      return;
    }

    const json = await res.json();
    if (json.status !== VALID) {
      const extraMsg = 'Invalid reqBody or email';
      dispatch(updateJoinNewsletter({
        status: JOIN_NEWSLETTER_STATUS_ROLLBACK, extraMsg,
      }));
      return;
    }

    dispatch(updateJoinNewsletter({
      status: JOIN_NEWSLETTER_STATUS_COMMIT, extraMsg: '',
    }));
  } catch (error) {
    const extraMsg = error.message;
    dispatch(updateJoinNewsletter({
      status: JOIN_NEWSLETTER_STATUS_ROLLBACK, extraMsg,
    }));
  }
};

export const updateJoinNewsletter = (payload) => {
  return { type: UPDATE_JOIN_NEWSLETTER, payload };
};
