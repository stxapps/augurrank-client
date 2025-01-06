import {
  getPublicKeyFromPrivate, publicKeyToBtcAddress,
} from '@stacks/encryption/dist/esm';
import Url from 'url-parse';
import {
  HTTP, GAME_BTC, PRED_STATUS_INIT, PRED_STATUS_IN_MEMPOOL, PRED_STATUS_PUT_OK,
  PRED_STATUS_PUT_ERROR, PRED_STATUS_CONFIRMED_OK, PRED_STATUS_CONFIRMED_ERROR,
  PRED_STATUS_VERIFIABLE, PRED_STATUS_VERIFYING, PRED_STATUS_VERIFIED_OK,
  PRED_STATUS_VERIFIED_ERROR, PDG, SCS,
} from '@/types/const';

export const containUrlProtocol = (url) => {
  const urlObj = new Url(url, {});
  return urlObj.protocol && urlObj.protocol !== '';
};

export const ensureContainUrlProtocol = (url) => {
  if (!containUrlProtocol(url)) return HTTP + url;
  return url;
};

export const extractUrl = (url) => {
  url = ensureContainUrlProtocol(url);
  const urlObj = new Url(url, {});
  return {
    host: urlObj.host,
    origin: urlObj.origin,
    pathname: urlObj.pathname,
    hash: urlObj.hash,
  };
};

export const getUrlPathQueryHash = (url) => {

  const urlObj = new Url(url, {});

  let i;
  if (!urlObj.protocol || urlObj.protocol === '') i = 1;
  else if (!urlObj.slashes) i = 2;
  else i = 3;

  return url.split('/').slice(i).join('/');
};

export const getUserUsername = (userData) => {
  if (!isObject(userData) || !isString(userData.username)) return '';
  return userData.username;
};

export const getUserImageUrl = (userData) => {

  let userImage = null;
  if (userData && userData.profile) {
    if (userData.profile.image) userImage = userData.profile.image;
    else if (
      userData.profile.decodedToken &&
      userData.profile.decodedToken.payload &&
      userData.profile.decodedToken.payload.claim &&
      userData.profile.decodedToken.payload.claim.image
    ) userImage = userData.profile.decodedToken.payload.claim.image;
  }

  let userImageUrl = null;
  if (userImage) {
    if (Array.isArray(userImage) && userImage.length > 0) {
      userImageUrl = userImage[0].contentUrl || null;
    }
  }

  return userImageUrl;
};

export const getUserStxAddr = (userData) => {
  const stxAddr = userData.profile.stxAddress.mainnet;
  return stxAddr;
};

export const getAppBtcAddr = (userData) => {
  const appPubKey = getPublicKeyFromPrivate(userData.appPrivateKey);
  const appBtcAddr = publicKeyToBtcAddress(appPubKey);
  return appBtcAddr;
};

export const throttle = (func, limit) => {
  let lastFunc;
  let lastRan;
  return function () {
    const context = this;
    const args = arguments;
    if (!lastRan) {
      func.apply(context, args);
      lastRan = Date.now();
    } else {
      clearTimeout(lastFunc);
      lastFunc = setTimeout(function () {
        if ((Date.now() - lastRan) >= limit) {
          func.apply(context, args);
          lastRan = Date.now();
        }
      }, limit - (Date.now() - lastRan));
    }
  };
};

export const sleep = ms => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

export const isObject = val => {
  return typeof val === 'object' && val !== null;
};

export const isString = val => {
  return typeof val === 'string';
};

export const isNumber = val => {
  return typeof val === 'number' && isFinite(val);
};

export const isZrOrPst = (number) => {
  return isNumber(number) && number >= 0;
};

export const randomString = (length) => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
  const charactersLength = characters.length;

  let result = '';
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};

export const upperCaseFirstChar = (str) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

export const localeNumber = (num) => {
  return num.toLocaleString();
};

export const validateEmail = email => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export const getWindowSize = () => {
  let width = null, height = null, visualWidth = null, visualHeight = null;
  if (typeof window !== 'undefined' && isObject(window)) {
    if (isNumber(window.innerWidth)) width = window.innerWidth;
    if (isNumber(window.innerHeight)) height = window.innerHeight;

    if (isObject(window.visualViewport)) {
      if (isNumber(window.visualViewport.width)) {
        visualWidth = window.visualViewport.width;
      }
      if (isNumber(window.visualViewport.height)) {
        visualHeight = window.visualViewport.height;
      }
    }
  }

  return { width, height, visualWidth, visualHeight };
};

export const getWindowInsets = () => {
  let top = null, right = null, bottom = null, left = null;
  if (
    typeof window !== 'undefined' &&
    isObject(window) &&
    isObject(document.documentElement)
  ) {
    const cs = window.getComputedStyle(document.documentElement);
    const st = cs.getPropertyValue('--env-safe-area-inset-top');
    const sr = cs.getPropertyValue('--env-safe-area-inset-right');
    const sb = cs.getPropertyValue('--env-safe-area-inset-bottom');
    const sl = cs.getPropertyValue('--env-safe-area-inset-left');

    // Assume always in pixels (px)
    const [nt, nr] = [parseFloat(st), parseFloat(sr)];
    const [nb, nl] = [parseFloat(sb), parseFloat(sl)];

    if (isNumber(nt)) top = nt;
    if (isNumber(nr)) right = nr;
    if (isNumber(nb)) bottom = nb;
    if (isNumber(nl)) left = nl;
  }

  return { top, right, bottom, left };
};

export const unionPreds = (data, unsavedPreds) => {
  const predsPerId = {}, newPredPerId = {};
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
  return newPredPerId;
};

export const sepPreds = (data) => {
  const btcGamePreds = [];
  if (Array.isArray(data.preds)) {
    for (const pred of data.preds) {
      if (pred.game === GAME_BTC) {
        btcGamePreds.push(pred);
      } else {
        console.log('Invalid game:', pred);
      }
    }
  }

  return { btcGamePreds };
};

export const mergePreds = (...preds) => {
  const bin = {
    updateDate: null,
    pStatus: { scs: null, updg: null },
    cStatus: { scs: null, updg: null },
    vStatus: { scs: null, updg: null },
  };

  let newPred = {};
  for (const pred of preds) {
    if (!isObject(pred)) continue;

    if (isNumber(pred.updateDate)) {
      if (!isNumber(bin.updateDate) || pred.updateDate > bin.updateDate) {
        bin.updateDate = pred.updateDate;
      }
    }
    if (isString(pred.pStatus)) {
      if (pred.pStatus === SCS) bin.pStatus.scs = pred.pStatus;
      else if (pred.pStatus !== PDG) bin.pStatus.updg = pred.pStatus;
    }
    if (isString(pred.cStatus)) {
      if (pred.cStatus === SCS) bin.cStatus.scs = pred.cStatus;
      else if (pred.cStatus !== PDG) bin.cStatus.updg = pred.cStatus;
    }
    if (isString(pred.vStatus)) {
      if (pred.vStatus === SCS) bin.vStatus.scs = pred.vStatus;
      else if (pred.vStatus !== PDG) bin.vStatus.updg = pred.vStatus;
    }

    newPred = { ...newPred, ...pred };
  }

  if (isNumber(bin.updateDate)) newPred.updateDate = bin.updateDate;

  if (isString(bin.pStatus.scs)) newPred.pStatus = bin.pStatus.scs;
  else if (isString(bin.pStatus.updg)) newPred.pStatus = bin.pStatus.updg;

  if (isString(bin.cStatus.scs)) newPred.cStatus = bin.cStatus.scs;
  else if (isString(bin.cStatus.updg)) newPred.cStatus = bin.cStatus.updg;

  if (isString(bin.vStatus.scs)) newPred.vStatus = bin.vStatus.scs;
  else if (isString(bin.vStatus.updg)) newPred.vStatus = bin.vStatus.updg;

  return newPred;
};

export const getPredStatus = (pred, burnHeight = null) => {
  if ('pStatus' in pred && ![PDG, SCS].includes(pred.pStatus)) {
    return PRED_STATUS_PUT_ERROR;
  }
  if ('cStatus' in pred && ![PDG, SCS].includes(pred.cStatus)) {
    return PRED_STATUS_CONFIRMED_ERROR;
  }
  if ('vStatus' in pred && ![PDG, SCS].includes(pred.vStatus)) {
    return PRED_STATUS_VERIFIED_ERROR;
  }

  if (pred.vStatus === SCS) return PRED_STATUS_VERIFIED_OK;
  if ('vTxId' in pred) return PRED_STATUS_VERIFYING;
  if (pred.cStatus === SCS) {
    if (
      isNumber(pred.targetBurnHeight) &&
      isNumber(burnHeight) &&
      pred.targetBurnHeight < burnHeight
    ) {
      return PRED_STATUS_VERIFIABLE;
    }
    return PRED_STATUS_CONFIRMED_OK;
  }
  if (pred.pStatus === SCS) return PRED_STATUS_PUT_OK;
  if ('cTxId' in pred) return PRED_STATUS_IN_MEMPOOL;
  return PRED_STATUS_INIT;
};

export const getPendingPred = (preds, burnHeight) => {
  const { pred } = getPndgPredWthSts(preds, burnHeight);
  return pred;
};

export const getPndgPredWthSts = (preds, burnHeight) => {
  const stdPreds = Object.values(preds).sort((a, b) => b.createDate - a.createDate);
  for (const pred of stdPreds) {
    const status = getPredStatus(pred, burnHeight);

    if ([
      PRED_STATUS_VERIFIED_ERROR, PRED_STATUS_VERIFIED_OK, PRED_STATUS_VERIFYING,
      PRED_STATUS_VERIFIABLE,
    ].includes(status)) return { pred: null, status: null };

    if ([PRED_STATUS_CONFIRMED_ERROR].includes(status)) continue;

    if ([
      PRED_STATUS_CONFIRMED_OK, PRED_STATUS_PUT_ERROR, PRED_STATUS_PUT_OK,
      PRED_STATUS_IN_MEMPOOL, PRED_STATUS_INIT,
    ].includes(status)) return { pred, status };
  }
  return { pred: null, status: null };
};

export const deriveTxInfo = (txInfo) => {
  const obj = {
    txId: txInfo.tx_id,
    status: txInfo.tx_status,
    height: null,
    burnHeight: null,
    result: null,
    vls: null,
  };
  if (isNumber(txInfo.block_height)) obj.height = txInfo.block_height;
  if (isNumber(txInfo.burn_block_height)) obj.burnHeight = txInfo.burn_block_height;
  if (isObject(txInfo.tx_result) && isString(txInfo.tx_result.repr)) {
    obj.result = txInfo.tx_result.repr;
  }
  if (Array.isArray(txInfo.events)) {
    obj.vls = [];
    for (const evt of txInfo.events) {
      obj.vls.push(evt.contract_log.value.repr);
    }
  }
  return obj;
};

const getPredNumber = (regex, txInfo) => {
  try {
    const match = txInfo.result.match(regex);
    if (match) {
      const nmbr = parseInt(match[1]);
      if (isNumber(nmbr)) return nmbr;
    }
  } catch (error) {
    // txInfo.result might not be string.
  }

  return -1;
};

export const getPredSeq = (txInfo) => {
  const regex = /\(seq\s+u(\d+)\)/; // (ok (tuple (seq u532)))
  return getPredNumber(regex, txInfo);
};

export const getFetchMeMoreParams = (gameBtcPreds) => {
  const [game, operator, excludingIds] = ['me', '<=', []];

  const preds = Object.values(gameBtcPreds);

  let createDate = null;
  for (const pred of preds) {
    if (createDate === null || pred.createDate < createDate) {
      createDate = pred.createDate;
    }
  }
  for (const pred of preds) {
    if (pred.createDate === createDate) excludingIds.push(pred.id);
  }

  return { game, createDate, operator, excludingIds };
};
