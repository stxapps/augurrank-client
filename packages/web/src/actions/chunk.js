import { showContractCall } from '@stacks/connect';
import { PostConditionMode, Cl, Pc } from '@stacks/transactions/dist/esm';
import { STACKS_MAINNET } from '@stacks/network/dist/esm';

import userSession from '@/userSession';
import idxApi from '@/apis';
import dataApi from '@/apis/data';
import { updateUser, updatePopup } from '@/actions';
import { UPDATE_GAME_BTC, REMOVE_GAME_BTC_PREDS, UPDATE_ME } from '@/types/actionTypes';
import {
  AGREE_POPUP, CONTRACT_ADDR, GAME_BTC, GAME_BTC_CONTRACT_NAME, GAME_BTC_FUNCTION_NAME,
  GAME_BTC_FEE, PRED_STATUS_IN_MEMPOOL,
} from '@/types/const';
import {
  getUserStxAddrOrThrow, getUserIdAddrOrThrow, isObject, randomString, getPendingPred,
  getPredStatus, deriveTxInfo,
} from '@/utils';
import vars from '@/vars';

export const fetchBtcPrice = (doForce = false, doLoad = false) => async (
  dispatch, getState
) => {
  if (!doForce && vars.btcPrice.didFetch) return;
  vars.btcPrice.didFetch = true;

  clearTimeout(vars.btcPrice.timeId);

  if (doLoad) dispatch(updateGameBtc({ price: null }));
  try {
    const price = await dataApi.fetchBtcPrice();
    dispatch(updateGameBtc({ price }));

    const burnHeight = getState().gameBtc.burnHeight;
    const preds = getState().preds;
    const pendingPred = getPendingPred(preds, burnHeight);
    const ms = getBtcPriceTime(pendingPred);

    vars.btcPrice.timeId = setTimeout(() => {
      dispatch(fetchBtcPrice(true, false));
    }, ms);
  } catch (error) {
    dispatch(updateGameBtc({ price: -1 }));
  }
};

const getBtcPriceTime = (pendingPred) => {
  const dms = 10 * 60 * 1000;
  if (!isObject(pendingPred)) return dms;

  const diff = Date.now() - pendingPred.createDate;
  if (diff < 8 * 60 * 60 * 1000) return 100 * 60 * 1000;
  if (diff < 12 * 60 * 60 * 1000) return 60 * 60 * 1000;
  if (diff < 16 * 60 * 60 * 1000) return 20 * 60 * 1000;
  return dms;
};

export const fetchBurnHeight = (doForce = false, doLoad = false) => async (
  dispatch, getState
) => {
  if (!doForce && vars.burnHeight.didFetch) return;
  vars.burnHeight.didFetch = true;

  clearTimeout(vars.burnHeight.timeId);

  if (doLoad) dispatch(updateGameBtc({ burnHeight: null }));
  try {
    const burnHeight = await dataApi.fetchBurnHeight();
    dispatch(updateGameBtc({ burnHeight }));

    const preds = getState().preds;
    const pendingPred = getPendingPred(preds, burnHeight);
    const ms = getBurnHeightTime(pendingPred);

    vars.burnHeight.timeId = setTimeout(() => {
      dispatch(fetchBurnHeight(true, false));
    }, ms);
  } catch (error) {
    dispatch(updateGameBtc({ burnHeight: -1 }));
  }
};

const getBurnHeightTime = (pendingPred) => {
  const dms = 10 * 60 * 1000;
  if (!isObject(pendingPred)) return dms;

  const diff = Date.now() - pendingPred.createDate;
  if (diff < 8 * 60 * 60 * 1000) return 100 * 60 * 1000;
  if (diff < 12 * 60 * 60 * 1000) return 60 * 60 * 1000;
  if (diff < 16 * 60 * 60 * 1000) return 20 * 60 * 1000;
  return dms;
};

export const fetchGameBtc = (doForce = false) => async (dispatch, getState) => {
  const isUserSignedIn = getState().user.isUserSignedIn;
  if (!isUserSignedIn) return;

  if (!doForce && vars.gameBtc.didFetch) return;
  vars.gameBtc.didFetch = true;

  try {
    const data = await dataApi.fetchGame(GAME_BTC);
    dispatch(updateGameBtc({ ...data, didFetch: true }));

    if (data.didAgreeTerms === true) {
      idxApi.saveExtraUserData(true);
    }
    setTimeout(() => {
      dispatch(refreshPendingPreds());
    }, 1000); // Call refreshPendingPreds after state updated.
  } catch (error) {
    dispatch(updateGameBtc({ didFetch: false }));
  }
};

export const updateGameBtc = (payload) => {
  return { type: UPDATE_GAME_BTC, payload };
};

export const removeGameBtcPreds = (ids) => {
  return { type: REMOVE_GAME_BTC_PREDS, payload: { ids } };
};

export const fetchMe = (doForce = false) => async (dispatch, getState) => {
  const isUserSignedIn = getState().user.isUserSignedIn;
  if (!isUserSignedIn) return;

  if (!doForce && vars.me.didFetch) return;
  vars.me.didFetch = true;


};

export const updateMe = (payload) => {
  return { type: UPDATE_ME, payload };
};

export const agreeTerms = () => async (dispatch, getState) => {
  dispatch(updatePopup(AGREE_POPUP, false));
  dispatch(updateUser({ didAgreeTerms: true }));
  idxApi.saveExtraUserData(true);

  const pred = vars.agreeTerms.pred;
  if (pred.game === GAME_BTC) {
    dispatch(callGameBtcContract(pred));
  } else {
    console.log('Invalid pred.game:', pred);
  }
};

export const cancelAgreeTerms = () => async (dispatch, getState) => {
  dispatch(updatePopup(AGREE_POPUP, false));

  const pred = vars.agreeTerms.pred;
  if (pred.game === GAME_BTC) {
    dispatch(removeGameBtcPreds([pred.id]));
  } else {
    console.log('Invalid pred.game:', pred);
  }
};

const refreshPendingPreds = () => async (dispatch, getState) => {
  if (vars.pendingPreds.isRunning) return;
  vars.pendingPreds.isRunning = true;

  clearTimeout(vars.pendingPreds.timeId);

  const preds = getState().gameBtcPreds;

  const pendingPreds = [];
  for (const pred of Object.values(preds)) {
    if (getPredStatus(pred) !== PRED_STATUS_IN_MEMPOOL) continue;
    pendingPreds.push(pred);
  }

  if (pendingPreds.length === 0) {
    vars.pendingPreds.isRunning = false;
    return;
  }

  for (const pred of pendingPreds) {
    let txInfo;
    try {
      txInfo = await dataApi.fetchTxInfo(pred.txId);
    } catch (error) {
      continue; // Do it later or by server.
    }

    txInfo = deriveTxInfo(txInfo);
    if (txInfo.status === '') {

    }
    // confirmed error?
    // error -> show error and retry?
    const newPred = { id: pred.id }; // put only new attrs to prevent race conditions!
    dispatch(updateGameBtc({ pred: newPred }));
  }

  vars.pendingPreds.timeId = setTimeout(() => {
    dispatch(refreshPendingPreds());
  }, 5000);
};

export const predictGameBtc = (value) => async (dispatch, getState) => {
  const userData = userSession.loadUserData();
  const idAddr = getUserIdAddrOrThrow(userData);
  const now = Date.now();

  const id = `${idAddr}-${now}${randomString(7)}`;
  const [game, contract] = [GAME_BTC, GAME_BTC_CONTRACT_NAME];
  const [createDate, updateDate] = [now, now];
  const stxAddr = getUserStxAddrOrThrow(userData);
  const pred = { id, game, contract, value, createDate, updateDate, stxAddr };

  dispatch(updateGameBtc({ pred }));

  const didAgreeTerms = getState().user.didAgreeTerms;
  if (!didAgreeTerms) {
    vars.agreeTerms.pred = pred;
    dispatch(updatePopup(AGREE_POPUP, true));
    return;
  }

  dispatch(callGameBtcContract(pred));
};

const callGameBtcContract = (pred) => async (dispatch, getState) => {
  const userData = userSession.loadUserData();
  const stxAddr = getUserStxAddrOrThrow(userData);
  const condition = Pc.principal(stxAddr).willSendEq(GAME_BTC_FEE).ustx();

  const onFinish = async (res) => {
    // WHEN user confirms pop-up
    // success -> get txId, upload to the server, keep refresh
    if (res.success) {
      console.log('Transaction successful with ID:', res.txid);

      const newPred = { id: pred.id, txId: res.txid } // put only new attrs is enough.
      dispatch(updateGameBtc({ pred: newPred }));

      try {
        await dataApi.putPred(pred);
      } catch (error) {

      }

      setTimeout(() => {
        dispatch(refreshPendingPreds());
      }, 5000); // Wait a while before calling refreshPendingPreds.
    } else {
      console.error('Transaction failed with error:', res.error);
    }
  };
  const onCancel = () => {
    // WHEN user cancels/closes pop-up
    // cancel -> remove the pred
  };

  showContractCall({
    network: STACKS_MAINNET,
    contractAddress: CONTRACT_ADDR,
    contractName: GAME_BTC_CONTRACT_NAME,
    functionName: GAME_BTC_FUNCTION_NAME,
    functionArgs: [Cl.stringAscii(pred.value)],
    postConditionMode: PostConditionMode.Deny,
    postConditions: [condition],
    onFinish: onFinish,
    onCancel: onCancel,
  });
};
