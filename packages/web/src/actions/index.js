import userSession from '@/userSession';
import { showConnect, showSignMessage, deleteSelectedWallet } from '@/connectWrapper';
import idxApi from '@/apis';
import {
  INIT, UPDATE_WINDOW, UPDATE_USER, UPDATE_POPUP, UPDATE_JOIN_NEWSLETTER, RESET_STATE,
} from '@/types/actionTypes';
import {
  APP_NAME, APP_ICON_NAME, STX_TST_STR, ADD_NEWSLETTER_EMAIL_URL, VALID,
  JOIN_NEWSLETTER_STATUS_JOINING, JOIN_NEWSLETTER_STATUS_INVALID,
  JOIN_NEWSLETTER_STATUS_COMMIT, JOIN_NEWSLETTER_STATUS_ROLLBACK,
} from '@/types/const';
import {
  extractUrl, getUrlPathQueryHash, throttle, isObject, validateEmail, getWindowInsets,
} from '@/utils';
import vars from '@/vars';

let _didInit;
export const init = () => async (dispatch, getState) => {
  if (_didInit) return;
  _didInit = true;

  const {
    stxAddr, stxPubKey, stxSigStr, username, avatar, bio, didAgreeTerms,
  } = idxApi.getLocalUser();
  dispatch({
    type: INIT,
    payload: { stxAddr, stxPubKey, stxSigStr, username, avatar, bio, didAgreeTerms },
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
  const payload = { stxAddr: '', stxPubKey: '', stxSigStr: '' };
  await resetState(payload, dispatch);

  userSession.signUserOut();
  deleteSelectedWallet();
};

export const connectWallet = () => async (dispatch, getState) => {
  const appIconUrl = extractUrl(window.location.href).origin + '/' + APP_ICON_NAME;
  showConnect({
    userSession: userSession._userSession,
    appDetails: { name: APP_NAME, icon: appIconUrl },
    sendToSignIn: false,
    redirectTo: '/' + getUrlPathQueryHash(window.location.href),
    onFinish: () => {
      const userSessionData = userSession.loadUserData();
      const stxAddr = userSessionData.profile.stxAddress.mainnet;

      const user = { stxAddr, stxPubKey: '', stxSigStr: '' };
      dispatch(updateUser(user));

      dispatch(signStxTstStr());
    },
  });
};

export const signStxTstStr = () => async (dispatch, getState) => {
  const { stxAddr } = getState().user;
  const appIconUrl = extractUrl(window.location.href).origin + '/' + APP_ICON_NAME;
  showSignMessage({
    userSession: userSession._userSession,
    appDetails: { name: APP_NAME, icon: appIconUrl },
    network: 'mainnet',
    stxAddress: stxAddr,
    message: STX_TST_STR,
    onFinish: async (sigObj) => {
      const { stxAddr } = getState().user;
      const payload = { stxAddr, stxPubKey: '', stxSigStr: '' };
      await resetState(payload, dispatch);

      const [stxPubKey, stxSigStr] = [sigObj.publicKey, sigObj.signature];
      const user = { stxAddr, stxPubKey, stxSigStr };
      dispatch(updateUser(user));
    },
  });
};

const resetState = async (payload, dispatch) => {
  idxApi.deleteLocalFiles();

  vars.gameBtc.didFetch = false;
  vars.me.didFetch = false;

  dispatch({ type: RESET_STATE, payload });
};

export const updateUser = (payload) => {
  return { type: UPDATE_USER, payload };
};

export const updateLocalUser = () => async (dispatch, getState) => {
  const user = getState().user;
  idxApi.putLocalUser(user);
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
