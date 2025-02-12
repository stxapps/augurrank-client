import { PostConditionMode, Cl, Pc } from '@stacks/transactions/dist/esm';

import walletApi from '@/apis/wallet';
import dataApi from '@/apis/data';
import { updatePopup, updateUser, updateErrorPopup } from '@/actions';
import {
  UPDATE_GAME_BTC, REMOVE_GAME_BTC_PREDS, UPDATE_ME, UPDATE_ME_EDITOR,
} from '@/types/actionTypes';
import {
  AGREE_POPUP, CONTRACT_ADDR, GAME_BTC, GAME_BTC_CONTRACT_NAME, GAME_BTC_FUNCTION_NAME,
  GAME_BTC_FEE, GAME_BTC_LEAD_BURN_HEIGHT, PRED_STATUS_IN_MEMPOOL, PRED_STATUS_PUT_OK,
  PRED_STATUS_PUT_ERROR, PRED_STATUS_VERIFIABLE, PRED_STATUS_VERIFYING, PDG, SCS,
  ABT_BY_RES, ABT_BY_NF, ERR_NOT_FOUND, N_PREDS,
} from '@/types/const';
import {
  getSignInStatus, isObject, isNumber, isFldStr, randomString, unionPreds, sepPreds,
  getPredStatus, getPendingPred, deriveTxInfo, getPredSeq, getFetchMeMoreParams,
  getWalletErrorText, isAvatarEqual,
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
  const preds = getState().gameBtcPreds;
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

  const preds = getState().gameBtcPreds;
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

export const fetchGameBtc = (doForce = false, doLoad = false) => async (
  dispatch, getState
) => {
  const signInStatus = getSignInStatus(getState().user);
  if (signInStatus !== 3) return;

  if (!doForce && vars.gameBtc.didFetch) return;
  vars.gameBtc.didFetch = true;

  let data = null;
  if (doLoad) dispatch(updateGameBtc({ didFetch: null }));
  try {
    data = await dataApi.fetchGame(GAME_BTC);
  } catch (error) {
    console.log('fetchGameBtc error:', error);
    dispatch(updateGameBtc({ didFetch: false }));
    return;
  }

  const burnHeight = getState().gameBtc.burnHeight;
  const unsavedPreds = dataApi.getUnsavedPreds(GAME_BTC);

  const newPredPerId = unionPreds(data, unsavedPreds);

  for (const pred of unsavedPreds) {
    const newPred = newPredPerId[pred.id];
    const status = getPredStatus(newPred, burnHeight);
    if (status === PRED_STATUS_IN_MEMPOOL) {
      newPred.pStatus = ABT_BY_RES;
      dataApi.putUnsavedPred(newPred);
    } else if (status === PRED_STATUS_PUT_ERROR) {
      // still the same, retry in refreshPreds
    } else {
      dataApi.deleteUnsavedPred(pred.id);
    }
  }

  const newData = {};
  for (const key in data) {
    if (['pred', 'preds'].includes(key)) continue;
    newData[key] = data[key];
  }
  newData.preds = Object.values(newPredPerId);

  dispatch(updateGameBtc({ ...newData, didFetch: true }));

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

export const fetchMe = (doForce = false, doLoad = false) => async (
  dispatch, getState
) => {
  const signInStatus = getSignInStatus(getState().user);
  if (signInStatus !== 3) return;

  if (!doForce && vars.me.didFetch) return;
  vars.me.didFetch = true;

  let data = null;
  if (doLoad) dispatch(updateMe({ didFetch: null }));
  try {
    data = await dataApi.fetchMe();
  } catch (error) {
    console.log('fetchMe error:', error);
    dispatch(updateMe({ didFetch: false }));
    return;
  }

  // should getUnsavedPreds for all games if not yet done?

  const sepRst = sepPreds(data);
  data.gameBtcPreds = sepRst.gameBtcPreds;

  dispatch(updateMe({ ...data, didFetch: true }));

  setTimeout(() => {
    dispatch(refreshPreds());
  }, 1000); // Call refreshPreds after state updated.
};

export const fetchMeMore = (doForce = false) => async (dispatch, getState) => {
  const signInStatus = getSignInStatus(getState().user);
  if (signInStatus !== 3) return;

  const fetchingMore = getState().me.fetchingMore;
  if (fetchingMore === true) return;
  if (!doForce && fetchingMore !== null) return;
  dispatch(updateMe({ fetchingMore: true }));

  const gameBtcPreds = getState().gameBtcPreds;
  const {
    game, createDate, operator, excludingIds,
  } = getFetchMeMoreParams(gameBtcPreds);

  let data;
  try {
    data = await dataApi.fetchPreds(
      null, game, createDate, operator, excludingIds
    );
  } catch (error) {
    console.log('fetchMeMore error:', error);
    dispatch(updateMe({ fetchingMore: false }));
    return;
  }

  const sepRst = sepPreds(data);
  data.gameBtcPreds = sepRst.gameBtcPreds;

  dispatch(updateMe({ ...data, fetchingMore: null }));

  setTimeout(() => {
    dispatch(refreshPreds());
  }, 1000); // Call refreshPreds after state updated.
};

export const updateMe = (payload) => {
  return { type: UPDATE_ME, payload };
};

export const showMeEditorPopup = () => async (dispatch, getState) => {
  const didFetch = getState().me.didFetch;
  if (didFetch !== true) {
    console.log('In showMeEditorPopup, invalid me.didFetch');
    return;
  }

  let { username, avatar, bio } = getState().user;
  if (!isFldStr(username)) username = '';
  if (!isFldStr(avatar)) avatar = '';
  if (!isFldStr(bio)) bio = '';

  dispatch(updateMeEditor({ username, avatar, bio, renderCode: null }));
};

export const fetchAvlbUsns = (doForce = false, doLoad = false) => async (
  dispatch, getState
) => {
  const signInStatus = getSignInStatus(getState().user);
  if (signInStatus !== 3) return;

  if (getState().meEditor.renderCode !== 1) return;

  if (!doForce && vars.meEditor.didFthAvlbUsns) return;
  vars.meEditor.didFthAvlbUsns = true;

  let data = null;
  if (doLoad) dispatch(updateMeEditor({ didFthAvlbUsns: null }));
  try {
    const res = await dataApi.fetchBnsNames();
    data = { avlbUsns: res };
  } catch (error) {
    console.log('fetchAvlbUsns error:', error);
    dispatch(updateMeEditor({ didFthAvlbUsns: false }));
    return;
  }

  dispatch(updateMeEditor({ ...data, didFthAvlbUsns: true }));
};

export const fetchAvlbAvts = (doForce = false, doLoad = false) => async (
  dispatch, getState
) => {
  const signInStatus = getSignInStatus(getState().user);
  if (signInStatus !== 3) return;

  if (getState().meEditor.renderCode !== 2) return;

  if (!doForce && vars.meEditor.didFthAvlbAvts) return;
  vars.meEditor.didFthAvlbAvts = true;

  let data = null;
  if (doLoad) dispatch(updateMeEditor({ didFthAvlbAvts: null }));
  try {
    const res = await dataApi.fetchNfts(0, 10);
    data = {
      avlbAvts: res.nfts,
      nftOffset: res.offset, nftLimit: res.limit, nftTotal: res.total,
    };
  } catch (error) {
    console.log('fetchAvlbAvts error:', error);
    dispatch(updateMeEditor({ didFthAvlbAvts: false }));
    return;
  }

  dispatch(updateMeEditor({ ...data, didFthAvlbAvts: true }));
};

export const fetchAvlbAvtsMore = (doForce = false) => async (dispatch, getState) => {
  const signInStatus = getSignInStatus(getState().user);
  if (signInStatus !== 3) return;

  const fthgAvlbAvtsMore = getState().meEditor.fthgAvlbAvtsMore;
  if (fthgAvlbAvtsMore === true) return;
  if (!doForce && fthgAvlbAvtsMore !== null) return;
  dispatch(updateMeEditor({ fthgAvlbAvtsMore: true }));

  const { nftOffset, nftLimit, nftTotal } = getState().meEditor;
  if (!isNumber(nftOffset) || !isNumber(nftLimit) || !isNumber(nftTotal)) return;
  if (nftOffset + nftLimit >= nftTotal) return;

  let data;
  try {
    const res = await dataApi.fetchNfts(nftOffset + nftLimit, nftLimit);
    data = {
      avlbAvtsMore: res.nfts,
      nftOffset: res.offset, nftLimit: res.limit, nftTotal: res.total,
    };
  } catch (error) {
    console.log('fetchAvlbAvtsMore error:', error);
    dispatch(updateMeEditor({ fthgAvlbAvtsMore: false }));
    return;
  }

  dispatch(updateMeEditor({ ...data, fthgAvlbAvtsMore: null }));
};

export const updateMeEditor = (payload) => {
  return { type: UPDATE_ME_EDITOR, payload };
};

export const updateMeData = (doForce = false) => async (
  dispatch, getState
) => {
  const { user, meEditor } = getState();

  if (meEditor.saving === true) return;
  if (!doForce && meEditor.saving !== null) return;

  const newUser = {}; let isDiff = false;
  if (isFldStr(meEditor.username)) {
    if (!isFldStr(user.username) || user.username !== meEditor.username) {
      [newUser.username, isDiff] = [meEditor.username, true];
    }
  } else if (isFldStr(user.username)) {
    [newUser.username, isDiff] = ['', true];
  }
  if (isFldStr(meEditor.avatar)) {
    if (!isFldStr(user.avatar) || !isAvatarEqual(user.avatar, meEditor.avatar)) {
      [newUser.avatar, isDiff] = [meEditor.avatar, true];
    }
  } else if (isFldStr(user.avatar)) {
    [newUser.avatar, isDiff] = ['', true];
  }
  if (isFldStr(meEditor.bio)) {
    if (!isFldStr(user.bio) || user.bio !== meEditor.bio) {
      [newUser.bio, isDiff] = [meEditor.bio, true];
    }
  } else if (isFldStr(user.bio)) {
    [newUser.bio, isDiff] = ['', true];
  }
  if (!isDiff) {
    dispatch(updateMeEditor({ username: null, avatar: null, bio: null, saving: null }));
    return;
  }

  dispatch(updateMeEditor({ saving: true }));
  try {
    await dataApi.putUser(newUser);
  } catch (error) {
    dispatch(updateMeEditor({ saving: false }));
    return;
  }

  dispatch(updateUser(newUser));
  dispatch(updateMeEditor({ username: null, avatar: null, bio: null, saving: null }));
};

export const agreeTerms = () => async (dispatch, getState) => {
  dispatch(updatePopup(AGREE_POPUP, false));
  dispatch(updateUser({ didAgreeTerms: true }));

  const pred = vars.agreeTerms.pred;
  if (pred.game === GAME_BTC) {
    dispatch(callGameBtcContract(pred));
  } else {
    console.log('In agreeTerms, invalid game:', pred);
  }
};

export const cancelAgreeTerms = () => async (dispatch, getState) => {
  dispatch(updatePopup(AGREE_POPUP, false));

  const pred = vars.agreeTerms.pred;
  if (pred.game === GAME_BTC) {
    dispatch(removeGameBtcPreds([pred.id]));
  } else {
    console.log('In cancelAgreeTerms, invalid game:', pred);
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
    if ([PRED_STATUS_VERIFIABLE, PRED_STATUS_VERIFYING].includes(status)) {
      verifiablePreds.push(pred);
    }
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
    return;
  }

  vars.refreshPreds.isRunning = false;
  vars.refreshPreds.seq = 0;
};

const retryPutErrorPreds = async (preds, dispatch) => {
  for (const pred of preds) {
    const newPred = { ...pred, pStatus: SCS };
    try {
      await dataApi.putPred(newPred);
    } catch (error) {
      console.log('retryPutErrorPreds error:', error);
      continue; // Do it later.
    }

    if (newPred.game === GAME_BTC) {
      dispatch(updateGameBtc({ pred: newPred }));
    } else {
      console.log('In retryPutErrorPreds, invalid game:', newPred);
    }
    dataApi.deleteUnsavedPred(newPred.id);
  }
};

const refreshUnconfirmedPreds = async (preds, dispatch) => {
  for (const pred of preds) {
    let txInfo;
    try {
      txInfo = await dataApi.fetchTxInfo(pred.cTxId);
    } catch (error) {
      if (error.message !== ERR_NOT_FOUND) {
        continue; // server error, network error, do it later or by server.
      }
      if (Date.now() - pred.createDate < 60 * 60 * 1000) {
        continue; // wait a bit more, maybe the api lacks behind.
      }

      // Not in mempool anymore like cannot confirm i.e. wrong nonce, not enough fee
      txInfo = { tx_id: pred.cTxId, tx_status: ABT_BY_NF };
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

    try {
      await dataApi.putPred(newPred);
    } catch (error) {
      console.log('refreshUnconfirmedPreds error:', error);
      continue; // Do it later or by server.
    }

    if (newPred.game === GAME_BTC) {
      dispatch(updateGameBtc({ pred: newPred }));
    } else {
      console.log('In refreshUnconfirmedPreds, invalid game:', newPred);
    }
  }
};

const refreshVerifiablePreds = async (preds, dispatch) => {
  const ids = preds.slice(0, N_PREDS).map(pred => pred.id);
  if (ids.length === 0) return;

  let data;
  try {
    data = await dataApi.fetchPreds(ids, null, null, null, null, true);
  } catch (error) {
    console.log('refreshVerifiablePreds error:', error);
    return; // Do it later.
  }

  const sepRst = sepPreds(data);
  dispatch(updateGameBtc({ preds: sepRst.gameBtcPreds }));
  dispatch(updateMe({ stats: data.meStats }));
};

export const predictGameBtc = (value) => async (dispatch, getState) => {
  const { stxAddr } = getState().user;
  const now = Date.now();

  const id = `${stxAddr}-${now}${randomString(7)}`;
  const [game, contract] = [GAME_BTC, GAME_BTC_CONTRACT_NAME];
  const [createDate, updateDate] = [now, now];
  const pred = { id, stxAddr, game, contract, value, createDate, updateDate };

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
  const { stxAddr, stxPubKey } = getState().user;
  const condition = Pc.principal(stxAddr).willSendEq(GAME_BTC_FEE).ustx();

  let data;
  try {
    data = await walletApi.contractCall({
      stxAddress: stxAddr,
      publicKey: stxPubKey,
      sponsored: false,
      network: 'mainnet',
      contractAddress: CONTRACT_ADDR,
      contractName: GAME_BTC_CONTRACT_NAME,
      functionName: GAME_BTC_FUNCTION_NAME,
      functionArgs: [Cl.stringAscii(pred.value)],
      postConditionMode: PostConditionMode.Deny,
      postConditions: [condition],
    });
  } catch (error) {
    console.log('In callGameBtcContract, error:', error);
    dispatch(removeGameBtcPreds([pred.id]));
    if (
      (isObject(error.error) && [4001, -32000].includes(error.error.code)) ||
      error === 'cancel'
    ) {
      return;
    }

    dispatch(updateErrorPopup(getWalletErrorText(error.message)));
    return;
  }

  const newPred = { ...pred, cTxId: data.txId };
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
