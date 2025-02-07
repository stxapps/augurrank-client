import idxApi from '@/apis';
import walletApi from '@/apis/wallet';
import {
  INIT, UPDATE_WINDOW, UPDATE_USER, UPDATE_POPUP, UPDATE_JOIN_NEWSLETTER,
  UPDATE_WALLET_POPUP, UPDATE_ERROR_POPUP, RESET_STATE,
} from '@/types/actionTypes';
import {
  STX_TST_STR, ADD_NEWSLETTER_EMAIL_URL, VALID, JOIN_NEWSLETTER_STATUS_JOINING,
  JOIN_NEWSLETTER_STATUS_INVALID, JOIN_NEWSLETTER_STATUS_COMMIT,
  JOIN_NEWSLETTER_STATUS_ROLLBACK,
} from '@/types/const';
import {
  throttle, isObject, validateEmail, getWindowInsets, getWalletErrorText,
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

  try {
    await walletApi.disconnect();
  } catch (error) {
    console.log('In signOut, error:', error);
  }
};

export const chooseWallet = () => async (dispatch, getState) => {
  const installedWalletIds = walletApi.getInstalledWalletIds();
  if (installedWalletIds.length === 1) {
    dispatch(connectWallet(installedWalletIds[0]));
    return;
  }

  dispatch(updateWalletPopup({ installedWalletIds }));
};

export const connectWallet = (walletId) => async (dispatch, getState) => {
  let data;
  try {
    data = await walletApi.connect(walletId);
  } catch (error) {
    console.log('In connectWallet, error:', error);
    if (isObject(error.error) && [4001, -32000].includes(error.error.code)) return;

    dispatch(updateErrorPopup(getWalletErrorText(error.message)));
    return;
  }

  const user = { stxAddr: data.stxAddr, stxPubKey: data.stxPubKey, stxSigStr: '' };
  dispatch(updateUser(user));

  dispatch(signStxTstStr());
};

export const signStxTstStr = () => async (dispatch, getState) => {
  const { stxAddr, stxPubKey } = getState().user;

  let data;
  try {
    data = await walletApi.signMessage(stxPubKey, STX_TST_STR);
  } catch (error) {
    console.log('In signStxTstStr, error:', error);
    if (isObject(error.error) && [4001, -32000].includes(error.error.code)) return;

    dispatch(updateErrorPopup(getWalletErrorText(error.message)));
    return;
  }

  const payload = { stxAddr, stxPubKey, stxSigStr: '' };
  await resetState(payload, dispatch);

  const user = { stxSigStr: data.stxSigStr };
  dispatch(updateUser(user));
};

const resetState = async (payload, dispatch) => {
  idxApi.deleteLocalFiles();

  vars.gameBtc.didFetch = false;
  vars.me.didFetch = false;
  [vars.meEditor.didFthAvlbUsns, vars.meEditor.didFthAvlbAvts] = [false, false];

  dispatch({ type: RESET_STATE, payload });
};

export const updatePopup = (id, isShown, anchorPosition) => {
  return {
    type: UPDATE_POPUP,
    payload: { id, isShown, anchorPosition },
  };
};

export const updateUser = (payload) => {
  return { type: UPDATE_USER, payload };
};

export const updateLocalUser = () => async (dispatch, getState) => {
  const user = getState().user;
  idxApi.putLocalUser(user);
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

export const updateWalletPopup = (payload) => {
  return { type: UPDATE_WALLET_POPUP, payload };
};

export const updateErrorPopup = (payload) => {
  return { type: UPDATE_ERROR_POPUP, payload };
};
