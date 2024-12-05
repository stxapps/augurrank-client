import { showConnect } from '@stacks/connect';

import userSession from '@/userSession';
import {
  INIT, UPDATE_WINDOW, UPDATE_USER, RESET_STATE, UPDATE_JOIN_NEWSLETTER_STATE,
} from '@/types/actionTypes';
import {
  APP_NAME, APP_ICON_NAME, ADD_NEWSLETTER_EMAIL_URL, VALID,
  JOIN_NEWSLETTER_STATUS_JOINING, JOIN_NEWSLETTER_STATUS_INVALID,
  JOIN_NEWSLETTER_STATUS_COMMIT, JOIN_NEWSLETTER_STATUS_ROLLBACK,
} from '@/types/const';
import {
  extractUrl, getUrlPathQueryHash, getUserUsername, getUserImageUrl, throttle, isObject,
  validateEmail, getWindowInsets,
} from '@/utils';

let _didInit;
export const init = () => async (dispatch, getState) => {
  if (_didInit) return;
  _didInit = true;

  const isUserSignedIn = userSession.isUserSignedIn();

  let username = null, userImage = null;
  if (isUserSignedIn) {
    const userData = userSession.loadUserData();
    username = getUserUsername(userData);
    userImage = getUserImageUrl(userData);
  }

  dispatch({ type: INIT, payload: { isUserSignedIn, username, userImage } });

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
  const authOptions = {
    appDetails: { name: APP_NAME, icon: appIconUrl },
    redirectTo: '/' + getUrlPathQueryHash(window.location.href),
    onFinish: () => dispatch(updateUserSignedIn()),
    userSession: userSession._userSession,
    sendToSignIn: false,
  };
  showConnect(authOptions);
};

const updateUserSignedIn = () => async (dispatch, getState) => {
  await resetState(dispatch);

  const userData = userSession.loadUserData();
  dispatch({
    type: UPDATE_USER,
    payload: {
      isUserSignedIn: true,
      username: getUserUsername(userData),
      image: getUserImageUrl(userData),
    },
  });
};

const resetState = async (dispatch) => {
  dispatch({ type: RESET_STATE });
};

export const updateJoinNewsletterState = (state) => {
  return { type: UPDATE_JOIN_NEWSLETTER_STATE, payload: state };
};

export const joinNewsletter = () => async (dispatch, getState) => {
  const { email } = getState().joinNewsletter;

  if (!validateEmail(email)) {
    dispatch(updateJoinNewsletterState({
      status: JOIN_NEWSLETTER_STATUS_INVALID, extraMsg: ''
    }));
    return;
  }

  dispatch(updateJoinNewsletterState({
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
      dispatch(updateJoinNewsletterState({
        status: JOIN_NEWSLETTER_STATUS_ROLLBACK, extraMsg
      }));
      return;
    }

    const json = await res.json();
    if (json.status !== VALID) {
      const extraMsg = 'Invalid reqBody or email';
      dispatch(updateJoinNewsletterState({
        status: JOIN_NEWSLETTER_STATUS_ROLLBACK, extraMsg
      }));
      return;
    }

    dispatch(updateJoinNewsletterState({
      status: JOIN_NEWSLETTER_STATUS_COMMIT, extraMsg: ''
    }));
  } catch (error) {
    const extraMsg = error.message;
    dispatch(updateJoinNewsletterState({
      status: JOIN_NEWSLETTER_STATUS_ROLLBACK, extraMsg
    }));
  }
};
