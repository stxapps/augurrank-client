import { showContractCall } from '@stacks/connect';
import { PostConditionMode, Cl, Pc } from '@stacks/transactions/dist/esm';

import userSession from '@/userSession';
import idxApi from '@/apis';
import dataApi from '@/apis/data';
import { updateUser, updatePopup } from '@/actions';
import { UPDATE_GAME_BTC, REMOVE_GAME_BTC_PREDS, UPDATE_ME } from '@/types/actionTypes';
import {
  AGREE_POPUP, CONTRACT_ADDR, GAME_BTC, GAME_BTC_CONTRACT_NAME, GAME_BTC_FUNCTION_NAME,
  GAME_BTC_FEE, GAME_BTC_LEAD_BURN_HEIGHT, PRED_STATUS_IN_MEMPOOL, PRED_STATUS_PUT_OK,
  PRED_STATUS_PUT_ERROR, PRED_STATUS_VERIFIABLE, PDG, SCS, ABT_BY_RES, ABT_BY_NF,
  NOT_FOUND_ERROR,
} from '@/types/const';
import {
  getUserStxAddr, getAppBtcAddr, isObject, randomString, mergePreds, getPredStatus,
  getPendingPred, deriveTxInfo, getPredSeq,
} from '@/utils';
import vars from '@/vars';

export const fetchBtcPrice = (doForce = false, doLoad = false) => async (
  dispatch, getState
) => {
  if (!doForce && vars.btcPrice.didFetch) return;
  vars.btcPrice.didFetch = true;

  clearTimeout(vars.btcPrice.timeId);

  let price = null;
  if (doLoad) dispatch(updateGameBtc({ price }));
  try {
    price = await dataApi.fetchBtcPrice();
  } catch (error) {
    console.log('fetchBtcPrice error:', error);
    dispatch(updateGameBtc({ price: -1 }));
    return;
  }

  dispatch(updateGameBtc({ price }));

  const burnHeight = getState().gameBtc.burnHeight;
  const preds = getState().preds;
  const pendingPred = getPendingPred(preds, burnHeight);
  const ms = getBtcPriceTime(pendingPred);

  vars.btcPrice.timeId = setTimeout(() => {
    dispatch(fetchBtcPrice(true, false));
  }, ms);
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

  let burnHeight = null;
  if (doLoad) dispatch(updateGameBtc({ burnHeight }));
  try {
    burnHeight = await dataApi.fetchBurnHeight();
  } catch (error) {
    console.log('fetchBurnHeight error:', error);
    dispatch(updateGameBtc({ burnHeight: -1 }));
    return;
  }

  dispatch(updateGameBtc({ burnHeight }));

  const preds = getState().preds;
  const pendingPred = getPendingPred(preds, burnHeight);
  const ms = getBurnHeightTime(pendingPred);

  vars.burnHeight.timeId = setTimeout(() => {
    dispatch(fetchBurnHeight(true, false));
  }, ms);
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

  let data;
  try {
    data = await dataApi.fetchGame(GAME_BTC);
  } catch (error) {
    console.log('fetchGameBtc error:', error);
    dispatch(updateGameBtc({ didFetch: false }));
    return;
  }

  const burnHeight = getState().gameBtc.burnHeight;
  const unsavedPreds = dataApi.getUnsavedPreds(GAME_BTC);

  const predsPerId = {}, newPredPerId = {}, newData = {};
  if (isObject(data.pred)) {
    if (!Array.isArray(predsPerId[data.pred.id])) predsPerId[data.pred.id] = [];
    predsPerId[data.pred.id].push(data.pred);
  }
  if (Array.isArray(data.preds)) {
    for (const pred of data.preds) {
      if (!Array.isArray(predsPerId[pred.id])) predsPerId[pred.id] = [];
      predsPerId[pred.id].push(pred);
    }
  }
  for (const pred of unsavedPreds) {
    if (!Array.isArray(predsPerId[pred.id])) predsPerId[pred.id] = [];
    predsPerId[pred.id].push(pred);
  }
  for (const preds of Object.values(predsPerId)) {
    const newPred = mergePreds(...preds);
    newPredPerId[newPred.id] = newPred;
  }

  for (const pred of unsavedPreds) {
    const newPred = newPredPerId[pred.id];
    const status = getPredStatus(newPred, burnHeight);
    if (status === PRED_STATUS_IN_MEMPOOL) {
      newPredPerId[pred.id] = { ...newPred, pStatus: ABT_BY_RES };
      dataApi.putUnsavedPred(newPred);
    } else if (status === PRED_STATUS_PUT_ERROR) {
      // still the same, retry in refreshPreds
    } else {
      dataApi.deleteUnsavedPred(pred.id);
    }
  }

  for (const key in data) {
    if (['pred', 'preds'].includes(key)) continue;
    newData[key] = data[key];
  }
  newData.preds = Object.values(newPredPerId);

  dispatch(updateGameBtc({ ...newData, didFetch: true }));

  if (data.didAgreeTerms === true) idxApi.putExtraUserData(true);

  setTimeout(() => {
    dispatch(refreshPreds());
  }, 1000); // Call refreshPreds after state updated.
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



  setTimeout(() => {
    dispatch(refreshPreds());
  }, 1000); // Call refreshPreds after state updated.
};

export const updateMe = (payload) => {
  return { type: UPDATE_ME, payload };
};

export const fetchMeMorePreds = () => async (dispatch, getState) => {

};

export const agreeTerms = () => async (dispatch, getState) => {
  dispatch(updatePopup(AGREE_POPUP, false));
  dispatch(updateUser({ didAgreeTerms: true }));
  idxApi.putExtraUserData(true);

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

const refreshPreds = (doForce = false) => async (dispatch, getState) => {
  if (!doForce && vars.refreshPreds.isRunning) return;
  vars.refreshPreds.isRunning = true;

  clearTimeout(vars.refreshPreds.timeId);

  const burnHeight = getState().gameBtc.burnHeight;
  const preds = getState().gameBtcPreds;

  const putErrorPreds = [], unconfirmedPreds = [], verifiablePreds = [];
  for (const pred of Object.values(preds)) {
    const status = getPredStatus(pred, burnHeight);
    if (status === PRED_STATUS_PUT_ERROR) putErrorPreds.push(pred);
    if (status === PRED_STATUS_PUT_OK) unconfirmedPreds.push(pred);
    if (status === PRED_STATUS_VERIFIABLE) verifiablePreds.push(pred);
  }

  if (
    putErrorPreds.length === 0 &&
    unconfirmedPreds.length === 0 &&
    verifiablePreds.length === 0
  ) {
    vars.refreshPreds.isRunning = false;
    vars.refreshPreds.seq = 0;
    return;
  }

  await retryPutErrorPreds(putErrorPreds, dispatch);
  await refreshUnconfirmedPreds(unconfirmedPreds, dispatch);
  await refreshVerifiablePreds(verifiablePreds, dispatch);

  // Loop for putErrorPreds and unconfirmedPreds for now
  if (putErrorPreds.length > 0 || unconfirmedPreds.length > 0) {
    const seq = vars.refreshPreds.seq;
    const ms = Math.max(Math.min(Math.round(
      (0.8217 * seq ^ 2 + 2.6469 * seq + 5.7343) * 1000
    ), 5 * 60 * 1000), 5 * 1000);
    vars.refreshPreds.timeId = setTimeout(() => {
      dispatch(refreshPreds(true));
    }, ms);
    vars.refreshPreds.seq += 1;
  }
};

const retryPutErrorPreds = async (preds, dispatch) => {
  for (const pred of preds) {
    const newPred = { ...pred, pStatus: SCS };
    try {
      await dataApi.putPred(newPred);
    } catch (error) {
      console.log('retryPutErrorPreds error:', error);
      continue; // Do it later
    }

    dispatch(updateGameBtc({ pred: newPred }));
    dataApi.deleteUnsavedPred(newPred.id);
  }
};

const refreshUnconfirmedPreds = async (preds, dispatch) => {
  for (const pred of preds) {
    let txInfo;
    try {
      txInfo = await dataApi.fetchTxInfo(pred.txId);
    } catch (error) {
      if (error.message !== NOT_FOUND_ERROR) {
        continue; // server error, network error, do it later or by server.
      }
      if (Date.now() - pred.createDate < 60 * 60 * 1000) {
        continue; // wait a bit more, maybe the api lacks behind.
      }

      // Not in mempool anymore like cannot confirm i.e. wrong nonce, not enough fee
      txInfo = { tx_id: pred.txId, status: ABT_BY_NF };
    }
    txInfo = deriveTxInfo(txInfo);
    if (txInfo.status === PDG) continue;

    const newPred = { ...pred };
    newPred.cStatus = txInfo.status;
    if (txInfo.status !== ABT_BY_NF) {
      newPred.anchorHeight = txInfo.height;
      newPred.anchorBurnHeight = txInfo.burnHeight;
    }
    if (txInfo.status === SCS) {
      if (pred.game === GAME_BTC) {
        newPred.seq = getPredSeq(txInfo);
        newPred.targetBurnHeight = txInfo.burnHeight + GAME_BTC_LEAD_BURN_HEIGHT;
      }
    }

    dispatch(updateGameBtc({ pred: newPred }));
    try {
      await dataApi.putPred(newPred);
    } catch (error) {
      console.log('refreshUnconfirmedPreds error:', error);
      continue; // Do it later or by server.
    }
  }
};

const refreshVerifiablePreds = async (preds, dispatch) => {
  const ids = preds.slice(0, 30).map(pred => pred.id);
  let sPreds;
  try {
    sPreds = await dataApi.fetchPreds(ids);
  } catch (error) {
    console.log('refreshVerifiablePreds error:', error);
    return; // Do it later or by server.
  }
  dispatch(updateGameBtc({ preds: sPreds }));
};

export const predictGameBtc = (value) => async (dispatch, getState) => {
  const userData = userSession.loadUserData();
  const appBtcAddr = getAppBtcAddr(userData);
  const now = Date.now();

  const id = `${appBtcAddr}-${now}${randomString(7)}`;
  const [game, contract] = [GAME_BTC, GAME_BTC_CONTRACT_NAME];
  const [createDate, updateDate] = [now, now];
  const stxAddr = getUserStxAddr(userData);
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
  const stxAddr = getUserStxAddr(userData);
  const condition = Pc.principal(stxAddr).willSendEq(GAME_BTC_FEE).ustx();

  const onFinish = async (res) => {
    const newPred = { ...pred, cTxId: res.txId };
    dispatch(updateGameBtc({ pred: newPred }));
    dataApi.putUnsavedPred(newPred);

    newPred.pStatus = SCS;
    try {
      await dataApi.putPred(newPred);
    } catch (error) {
      newPred.pStatus = ABT_BY_RES;
      dispatch(updateGameBtc({ pred: newPred }));
      dataApi.putUnsavedPred(newPred);
      return;
    }

    dispatch(updateGameBtc({ pred: newPred }));
    dataApi.deleteUnsavedPred(newPred.id);

    setTimeout(() => {
      dispatch(refreshPreds());
    }, 5 * 1000); // Wait a while before calling refreshPreds.
  };
  const onCancel = () => {
    dispatch(removeGameBtcPreds([pred.id]));
  };

  showContractCall({
    network: 'mainnet',
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
