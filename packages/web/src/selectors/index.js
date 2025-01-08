import { createSelector } from 'reselect';

import {
  PRED_STATUS_CONFIRMED_ERROR, PRED_STATUS_VERIFIED_OK, PRED_STATUS_VERIFIED_ERROR,
} from '@/types/const';
import { isObject, isNumber, getPndgPredWthSts, getPredStatus } from '@/utils';

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
  state => state.gameBtcPreds,
  state => state.me.stats,
  (gameBtcPreds, stats) => {
    const meStats = {
      nWins: 0, nLosses: 0, nPending: 0, nContDays: 0, nContWins: 0, maxContDays: 0,
      maxContWins: 0,
    };

    for (const pred of Object.values(gameBtcPreds)) {
      const status = getPredStatus(pred);
      if (![
        PRED_STATUS_CONFIRMED_ERROR, PRED_STATUS_VERIFIED_OK,
        PRED_STATUS_VERIFIED_ERROR,
      ].includes(status)) meStats.nPending += 1;
    }

    if (isObject(stats)) {
      for (const [key, value] of Object.entries(stats)) {
        if (!isNumber(value)) continue;

        if (key.endsWith('-up-verified_ok-TRUE-count')) {
          meStats.nWins += value;
        } else if (key.endsWith('-up-verified_ok-FALSE-count')) {
          meStats.nLosses += value;
        } else if (key.endsWith('-down-verified_ok-TRUE-count')) {
          meStats.nWins += value;
        } else if (key.endsWith('-down-verified_ok-FALSE-count')) {
          meStats.nLosses += value;
        } else if (key.endsWith('-confirmed_ok-count-cont-day')) {
          meStats.nContDays = value;
        } else if (key.endsWith('-verified_ok-TRUE-count-cont')) {
          meStats.nContWins = value;
        } else if (key.endsWith('-confirmed_ok-max-cont-day')) {
          meStats.maxContDays = value;
        } else if (key.endsWith('-verified_ok-TRUE-max-cont')) {
          meStats.maxContWins = value;
        }
      }
    }

    return meStats;
  }
);

export const getMePreds = createSelector(
  state => state.gameBtcPreds,
  (gameBtcPreds) => {
    const preds = Object.values(gameBtcPreds);
    preds.sort((a, b) => b.createDate - a.createDate);
    return preds;
  }
);
