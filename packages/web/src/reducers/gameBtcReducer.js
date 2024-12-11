import { UPDATE_GAME_BTC, RESET_STATE } from '@/types/actionTypes';
//import { GAME_STATUS_INIT } from '@/types/const';
import { isString, isNumber } from '@/utils';

const initialState = {
  price: null,
  burnHeight: null,
  didFetch: null,
  //status: GAME_STATUS_INIT,
};

const gameBtcReducer = (state = initialState, action) => {

  if (action.type === UPDATE_GAME_BTC) {
    const { price, burnHeight, didFetch } = action.payload;

    const newState = { ...state };
    if (price === null || isNumber(price)) newState.price = price;
    if (burnHeight === null || isNumber(burnHeight)) newState.burnHeight = burnHeight;
    if (didFetch === null || [true, false].includes(didFetch)) {
      newState.didFetch = didFetch;
    }
    //if (isString(status)) newState.status = status;

    return newState;
  }

  if (action.type === RESET_STATE) {
    return { ...state, didFetch: null };
  }

  return state;
};

export default gameBtcReducer;
