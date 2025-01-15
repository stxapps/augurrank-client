import { UPDATE_GAME_BTC, RESET_STATE } from '@/types/actionTypes';
import { isObject, isNumber } from '@/utils';

const initialState = {
  price: null,
  burnHeight: null,
  didFetch: null, // didFetch: null: not yet, true: fetched, false: error
  stats: null,
};

const gameBtcReducer = (state = initialState, action) => {

  if (action.type === UPDATE_GAME_BTC) {
    const { price, burnHeight, didFetch, stats } = action.payload;

    const newState = { ...state };
    if (price === null || isNumber(price)) newState.price = price;
    if (burnHeight === null || isNumber(burnHeight)) newState.burnHeight = burnHeight;
    if ([null, true, false].includes(didFetch)) {
      newState.didFetch = didFetch;
    }
    if (stats === null) newState.stats = null;
    else if (isObject(stats)) newState.stats = { ...stats };

    return newState;
  }

  if (action.type === RESET_STATE) {
    return { ...initialState, price: state.price, burnHeight: state.burnHeight };
  }

  return state;
};

export default gameBtcReducer;
