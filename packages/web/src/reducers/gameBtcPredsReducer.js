import {
  UPDATE_GAME_BTC, REMOVE_GAME_BTC_PREDS, RESET_STATE,
} from '@/types/actionTypes';
import { isObject } from '@/utils';

const initialState = {};

const gameBtcPredsReducer = (state = initialState, action) => {

  if (action.type === UPDATE_GAME_BTC) {
    const { pred } = action.payload;
    if (isObject(pred)) {
      const newState = { ...state };
      newState[pred.id] = { ...newState[pred.id], ...pred };
      return newState;
    }
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
