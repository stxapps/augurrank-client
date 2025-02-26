import { createSelector } from 'reselect';

import {
  PRED_STATUS_CONFIRMED_ERROR, PRED_STATUS_VERIFIED_OK, PRED_STATUS_VERIFIED_ERROR,
} from '@/types/const';
import {
  isObject, isNumber, isFldStr, getPndgPredWthSts, getPredStatus, parseAvatar, isString,
} from '@/utils';

const _getInsets = (insetTop, insetRight, insetBottom, insetLeft) => {
  let [top, right, bottom, left] = [0, 0, 0, 0];
  if (isNumber(insetTop)) top = Math.round(insetTop);
  if (isNumber(insetRight)) right = Math.round(insetRight);
  if (isNumber(insetBottom)) bottom = Math.round(insetBottom);
  if (isNumber(insetLeft)) left = Math.round(insetLeft);
  return { left, top, right, bottom };
};

export const getSafeAreaFrame = createSelector(
  state => state.window.width,
  state => state.window.height,
  state => state.window.visualWidth,
  state => state.window.visualHeight,
  state => state.window.insetTop,
  state => state.window.insetRight,
  state => state.window.insetBottom,
  state => state.window.insetLeft,
  (
    windowWidth, windowHeight, visualWidth, visualHeight,
    insetTop, insetRight, insetBottom, insetLeft
  ) => {

    [windowWidth, windowHeight] = [Math.round(windowWidth), Math.round(windowHeight)];

    let [width, height] = [windowWidth, windowHeight];

    if (isNumber(visualWidth)) {
      visualWidth = Math.round(visualWidth);
      width = visualWidth;
    } else {
      visualWidth = windowWidth;
    }

    if (isNumber(visualHeight)) {
      visualHeight = Math.round(visualHeight);
      height = visualHeight;
    } else {
      visualHeight = windowHeight;
    }

    const assumeKeyboard = windowHeight - visualHeight > 80;

    const insets = _getInsets(insetTop, insetRight, insetBottom, insetLeft);
    width = width - insets.left - insets.right;
    height = height - insets.top - (assumeKeyboard ? 0 : insets.bottom);

    return {
      x: 0, y: 0, width, height, windowWidth, windowHeight, visualWidth, visualHeight,
    };
  }
);

export const getSafeAreaInsets = createSelector(
  state => state.window.insetTop,
  state => state.window.insetRight,
  state => state.window.insetBottom,
  state => state.window.insetLeft,
  (insetTop, insetRight, insetBottom, insetLeft) => {
    const insets = _getInsets(insetTop, insetRight, insetBottom, insetLeft);
    return insets;
  }
);

export const getPndgGameBtcPredWthSts = createSelector(
  state => state.gameBtc.burnHeight,
  state => state.gameBtcPreds,
  (burnHeight, preds) => {
    return getPndgPredWthSts(preds, burnHeight);
  }
);

export const getMeStats = createSelector(
  state => state.gameBtc.burnHeight,
  state => state.gameBtcPreds,
  state => state.me.stats,
  (burnHeight, gameBtcPreds, stats) => {
    const res = {
      nWins: 0, nLosses: 0, nPending: 0, nContDays: 0, nContWins: 0, maxContDays: 0,
      maxContWins: 0,
    };

    for (const pred of Object.values(gameBtcPreds)) {
      const status = getPredStatus(pred, burnHeight);
      if (![
        PRED_STATUS_CONFIRMED_ERROR, PRED_STATUS_VERIFIED_OK,
        PRED_STATUS_VERIFIED_ERROR,
      ].includes(status)) res.nPending += 1;
    }

    if (isObject(stats)) {
      for (const [key, value] of Object.entries(stats)) {
        if (!isNumber(value)) continue;

        if (key.endsWith('-up-verified_ok-TRUE-count')) {
          res.nWins += value;
        } else if (key.endsWith('-up-verified_ok-FALSE-count')) {
          res.nLosses += value;
        } else if (key.endsWith('-down-verified_ok-TRUE-count')) {
          res.nWins += value;
        } else if (key.endsWith('-down-verified_ok-FALSE-count')) {
          res.nLosses += value;
        } else if (key.endsWith('-confirmed_ok-count-cont-day')) {
          res.nContDays = value;
        } else if (key.endsWith('-verified_ok-TRUE-count-cont')) {
          res.nContWins = value;
        } else if (key.endsWith('-confirmed_ok-max-cont-day')) {
          res.maxContDays = value;
        } else if (key.endsWith('-verified_ok-TRUE-max-cont')) {
          res.maxContWins = value;
        }
      }
    }

    return res;
  }
);

export const getMePredsWthSts = createSelector(
  state => state.gameBtc.burnHeight,
  state => state.gameBtcPreds,
  (burnHeight, gameBtcPreds) => {
    const predsWthSts = [];
    for (const pred of Object.values(gameBtcPreds)) {
      const status = getPredStatus(pred, burnHeight);
      predsWthSts.push({ pred, status });
    }

    predsWthSts.sort((a, b) => b.pred.createDate - a.pred.createDate);
    return predsWthSts;
  }
);

export const getAvtWthObj = createSelector(
  state => state.user.avatar,
  (str) => {
    const obj = parseAvatar(str);
    return { str, obj };
  }
);

export const getMeEdtrAvtWthObj = createSelector(
  state => state.meEditor.avatar,
  (str) => {
    const obj = parseAvatar(str);
    return { str, obj };
  }
);

export const getAvlbAvtsWthObj = createSelector(
  state => state.meEditor.avlbAvts,
  (strs) => {
    if (!Array.isArray(strs)) return null;

    const avlbAvts = [], keys = [];
    for (const str of strs) {
      const obj = parseAvatar(str);
      if (!isFldStr(obj.principal) || !isFldStr(obj.id)) continue;

      const key = obj.principal + obj.id;
      if (keys.includes(key)) continue;

      avlbAvts.push({ str, obj });
      keys.push(key);
    }
    return avlbAvts;
  }
);

export const getAvlbAvtsHasMore = createSelector(
  state => state.meEditor.nftOffset,
  state => state.meEditor.nftLimit,
  state => state.meEditor.nftTotal,
  (nftOffset, nftLimit, nftTotal) => {
    if (!isNumber(nftOffset) || !isNumber(nftLimit) || !isNumber(nftTotal)) return null;
    return nftOffset + nftLimit < nftTotal;
  }
);

export const getPlyrStats = createSelector(
  state => state.plyr.data,
  (data) => {
    const res = {
      nWins: 0, nLosses: 0, nPending: 0, nContDays: 0, nContWins: 0, maxContDays: 0,
      maxContWins: 0,
    };

    if (isObject(data) && isObject(data.stats)) {
      for (const [key, value] of Object.entries(data.stats)) {
        if (!isNumber(value)) continue;

        if (key.endsWith('-up-verified_ok-TRUE-count')) {
          res.nWins += value;
        } else if (key.endsWith('-up-verified_ok-FALSE-count')) {
          res.nLosses += value;
        } else if (key.endsWith('-down-verified_ok-TRUE-count')) {
          res.nWins += value;
        } else if (key.endsWith('-down-verified_ok-FALSE-count')) {
          res.nLosses += value;
        } else if (key.endsWith('-confirmed_ok-count-cont-day')) {
          res.nContDays = value;
        } else if (key.endsWith('-verified_ok-TRUE-count-cont')) {
          res.nContWins = value;
        } else if (key.endsWith('-confirmed_ok-max-cont-day')) {
          res.maxContDays = value;
        } else if (key.endsWith('-verified_ok-TRUE-max-cont')) {
          res.maxContWins = value;
        }
      }
    }

    return res;
  }
);

export const getPlyrPredsWthSts = createSelector(
  state => state.gameBtc.burnHeight,
  state => state.plyr.data,
  (burnHeight, data) => {
    const predsWthSts = [];
    if (isObject(data) && isObject(data.preds)) {
      for (const pred of Object.values(data.preds)) {
        const status = getPredStatus(pred, burnHeight);
        predsWthSts.push({ pred, status });
      }

      predsWthSts.sort((a, b) => b.pred.createDate - a.pred.createDate);
    }
    return predsWthSts;
  }
);

export const getPlyrPredsHasMore = createSelector(
  state => state.plyr.prevFName,
  (prevFName) => {
    return isFldStr(prevFName);
  }
);

export const getLdbBtcPlyrs = createSelector(
  state => state.ldbBtc.data,
  state => state.user.stxAddr,
  state => state.user.username,
  state => state.user.avatar,
  (data, uStxAddr, uUsername, uAvatar) => {
    const plyrs = [];
    if (!isObject(data)) return plyrs;

    const tss = Object.keys(data);
    if (tss.length === 0) return plyrs;

    const stss = tss.map(ts => parseInt(ts, 10)).sort((a, b) => b - a);
    const { totals: curTotals, users: curUsers } = data[stss[0]];
    const prevTotals = stss.length > 1 ? data[stss[1]].totals : null;

    const curSums = [], prevSums = [];
    for (const stxAddr in curTotals) {
      let nWins = 0, nLoses = 0, nNA = 0;
      if (isObject(curTotals[stxAddr]['up-verified_ok-TRUE-count'])) {
        nWins += curTotals[stxAddr]['up-verified_ok-TRUE-count'].outcome;
      }
      if (isObject(curTotals[stxAddr]['down-verified_ok-TRUE-count'])) {
        nWins += curTotals[stxAddr]['down-verified_ok-TRUE-count'].outcome;
      }
      if (isObject(curTotals[stxAddr]['up-verified_ok-FALSE-count'])) {
        nLoses += curTotals[stxAddr]['up-verified_ok-FALSE-count'].outcome;
      }
      if (isObject(curTotals[stxAddr]['down-verified_ok-FALSE-count'])) {
        nLoses += curTotals[stxAddr]['down-verified_ok-FALSE-count'].outcome;
      }
      if (isObject(curTotals[stxAddr]['up-verified_ok-N/A-count'])) {
        nNA += curTotals[stxAddr]['up-verified_ok-N/A-count'].outcome;
      }
      if (isObject(curTotals[stxAddr]['down-verified_ok-N/A-count'])) {
        nNA += curTotals[stxAddr]['down-verified_ok-N/A-count'].outcome;
      }
      curSums.push({ stxAddr, nWins, nLoses, nNA });
    }
    curSums.sort((a, b) => b.nWins - a.nWins);

    if (isObject(prevTotals)) {
      for (const stxAddr in prevTotals) {
        let nWins = 0;
        if (isObject(prevTotals[stxAddr]['up-verified_ok-TRUE-count'])) {
          nWins += prevTotals[stxAddr]['up-verified_ok-TRUE-count'].outcome;
        }
        if (isObject(prevTotals[stxAddr]['down-verified_ok-TRUE-count'])) {
          nWins += prevTotals[stxAddr]['down-verified_ok-TRUE-count'].outcome;
        }
        prevSums.push({ stxAddr, nWins });
      }
      prevSums.sort((a, b) => b.nWins - a.nWins);
    }

    for (let i = 0; i < curSums.length; i++) {
      const { stxAddr, nWins, nLoses, nNA } = curSums[i];

      let username = null, isUser = false; const avtWthObj = { str: null, obj: {} };
      if (isObject(curUsers[stxAddr])) {
        if (isFldStr(curUsers[stxAddr].username)) {
          username = curUsers[stxAddr].username;
        }
        if (isFldStr(curUsers[stxAddr].avatar)) {
          avtWthObj.str = curUsers[stxAddr].avatar;
          avtWthObj.obj = parseAvatar(avtWthObj.str);
        }
      }

      let rankChange = null;
      const prevRank = prevSums.findIndex(sum => sum.stxAddr === stxAddr);
      if (prevRank > -1) rankChange = i - prevRank;

      if (stxAddr === uStxAddr) {
        if (isString(uUsername)) username = uUsername;
        if (isString(uAvatar)) {
          avtWthObj.str = uAvatar;
          avtWthObj.obj = parseAvatar(avtWthObj.str);
        }
        isUser = true;
      }

      plyrs.push({
        stxAddr, username, avtWthObj, rankChange, nWins, nLoses, nNA, isUser,
      });
    }

    return plyrs;
  }
);
