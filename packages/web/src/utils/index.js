import {
  getPublicKeyFromPrivate, publicKeyToBtcAddress,
} from '@stacks/encryption/dist/esm';
import Url from 'url-parse';
import {
  HTTP, PRED_STATUS_INIT, PRED_STATUS_IN_MEMPOOL, PRED_STATUS_PUT_OK,
  PRED_STATUS_PUT_ERROR, PRED_STATUS_CONFIRMED_OK, PRED_STATUS_CONFIRMED_ERROR,
  PRED_STATUS_VERIFIABLE, PRED_STATUS_VERIFYING, PRED_STATUS_VERIFIED_OK,
  PRED_STATUS_VERIFIED_ERROR, SCS,
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

export const randomString = (length) => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
  const charactersLength = characters.length;

  let result = '';
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
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

export const getPredStatus = (pred, burnHeight = null) => {
  if ('pStatus' in pred && pred.pStatus !== SCS) return PRED_STATUS_PUT_ERROR;
  if ('cStatus' in pred && pred.cStatus !== SCS) {
    return PRED_STATUS_CONFIRMED_ERROR;
  }
  if ('vStatus' in pred && pred.vStatus !== SCS) return PRED_STATUS_VERIFIED_ERROR;

  if ('vStatus' in pred) return PRED_STATUS_VERIFIED_OK;
  if ('vTxId' in pred) return PRED_STATUS_VERIFYING;
  if ('cStatus' in pred) {
    if (
      isNumber(pred.targetBurnHeight) &&
      isNumber(burnHeight) &&
      pred.targetBurnHeight < burnHeight
    ) {
      return PRED_STATUS_VERIFIABLE;
    }
    return PRED_STATUS_CONFIRMED_OK;
  }
  if ('pStatus' in pred) return PRED_STATUS_PUT_OK;
  if ('cTxId' in pred) return PRED_STATUS_IN_MEMPOOL;
  return PRED_STATUS_INIT;
};

export const getPendingPred = (preds, burnHeight) => {
  const stdPreds = Object.values(preds).sort((a, b) => b.createDate - a.createDate);
  for (const pred of stdPreds) {
    const status = getPredStatus(pred, burnHeight);

    if ([
      PRED_STATUS_VERIFIED_ERROR, PRED_STATUS_VERIFIED_OK, PRED_STATUS_VERIFYING,
      PRED_STATUS_VERIFIABLE,
    ].includes(status)) return null;

    if ([PRED_STATUS_CONFIRMED_ERROR].includes(status)) continue;

    if ([
      PRED_STATUS_CONFIRMED_OK, PRED_STATUS_PUT_ERROR, PRED_STATUS_PUT_OK,
      PRED_STATUS_IN_MEMPOOL, PRED_STATUS_INIT,
    ].includes(status)) return pred;
  }
  return null;
};

export const deriveTxInfo = (txInfo) => {
  const obj = {
    txId: txInfo.tx_id,
    height: txInfo.block_height,
    burnHeight: txInfo.burn_block_height,
    status: txInfo.tx_status,
    result: txInfo.tx_result.repr,
    vls: [],
  };
  if (Array.isArray(txInfo.events)) {
    for (const evt of txInfo.events) {
      obj.vls.push(evt.contract_log.value.repr);
    }
  }
  return obj;
};
