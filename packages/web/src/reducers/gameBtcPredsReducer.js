import {
  UPDATE_GAME_BTC, REMOVE_GAME_BTC_PREDS, RESET_STATE,
} from '@/types/actionTypes';
import { isObject, mergePreds } from '@/utils';

const initialState = {};

const gameBtcPredsReducer = (state = initialState, action) => {

  if (action.type === UPDATE_GAME_BTC) {
    const { pred, preds } = action.payload;

    const newState = { ...state };
    if (isObject(pred)) {
      newState[pred.id] = mergePreds(newState[pred.id], pred);
    }
    if (Array.isArray(preds)) {
      for (const pred of preds) {
        newState[pred.id] = mergePreds(newState[pred.id], pred);
      }
    }
    return newState;
  }

  if (action.type === REMOVE_GAME_BTC_PREDS) {
    const { ids } = action.payload;
    if (Array.isArray(ids)) {
      const newState = {};
      for (const id in state) {
        if (ids.includes(id)) continue;
        newState[id] = state[id];
      }
      return newState;
    }
  }

  if (action.type === RESET_STATE) {
    return { ...initialState };
  }

  return state;
};

export default gameBtcPredsReducer;
