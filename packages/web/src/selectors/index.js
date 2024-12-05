import { createSelector } from 'reselect';

import { isNumber } from '../utils';

export const getSafeAreaFrame = createSelector(
  state => state.window.width,
  state => state.window.height,
  state => state.window.visualWidth,
  state => state.window.visualHeight,
  (windowWidth, windowHeight, visualWidth, visualHeight) => {

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
    let [top, right, bottom, left] = [0, 0, 0, 0];
    if (isNumber(insetTop)) top = Math.round(insetTop);
    if (isNumber(insetRight)) right = Math.round(insetRight);
    if (isNumber(insetBottom)) bottom = Math.round(insetBottom);
    if (isNumber(insetLeft)) left = Math.round(insetLeft);
    return { top, right, bottom, left }
  }
);
