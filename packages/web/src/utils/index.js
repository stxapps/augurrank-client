import Url from 'url-parse';
import {
  HTTP, PRED_STATUS_INIT, PRED_STATUS_IN_MEMPOOL, PRED_STATUS_CONFIRMED,
  PRED_STATUS_VERIFYING, PRED_STATUS_VERIFIED,
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
  let stxAddr = null;
  if (
    isObject(userData) &&
    isObject(userData.profile) &&
    isObject(userData.profile.stxAddress) &&
    isString(userData.profile.stxAddress.mainnet)
  ) {
    stxAddr = userData.profile.stxAddress.mainnet;
  }
  return stxAddr;
};

export const getUserIdAddr = (userData) => {
  if (!isObject(userData) || !isString(userData.identityAddress)) return '';
  return userData.identityAddress;
};

export const getUserStxAddrOrThrow = (userData) => {
  const stxAddr = getUserStxAddr(userData);
  if (isString(stxAddr) && stxAddr.length > 0) return stxAddr;
  throw new Error('Invalid stxAddr');
};

export const getUserIdAddrOrThrow = (userData) => {
  const idAddr = getUserIdAddr(userData);
  if (isString(idAddr) && idAddr.length > 0) return idAddr;
  throw new Error('Invalid idAddr');
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

export const getNewestPred = (preds) => {
  let newestPred = null;
  for (const cid in preds) {
    const pred = preds[cid];
    if (!isObject(newestPred) || pred.createDate > newestPred.createDate) {
      newestPred = pred;
    }
  }
  return newestPred;
};

export const getPendingPred = (preds, burnHeight) => {
  const newestPred = getNewestPred(preds);
  if (!isObject(newestPred)) return null;

  if ([true, false].includes(newestPred.correct)) return null;

  if (
    isNumber(burnHeight) && burnHeight > 0 && isNumber(newestPred.anchorBurnHeight)
  ) {
    if (burnHeight > newestPred.anchorBurnHeight + 100) return null;
  }

  return newestPred;
};

export const getPredStatus = (pred) => {
  if ('vResult' in pred) return PRED_STATUS_VERIFIED;
  if ('vTxId' in pred) return PRED_STATUS_VERIFYING;
  if ('result' in pred) return PRED_STATUS_CONFIRMED;
  if ('txId' in pred) return PRED_STATUS_IN_MEMPOOL;
  return PRED_STATUS_INIT;
};

export const deriveTxInfo = (txInfo) => {
  /*{
  obj.tx_status
  obj.tx_result,
      obj.block_height,
  obj.burn_block_height,
  obj.events[0],
    }*/

  return {};
};
