import { UPDATE_LDB_BTC, RESET_STATE } from '@/types/actionTypes';
import { isObject, isNumber } from '@/utils';

const initialState = {
  didFetch: null, // null: not yet, true: fetched, false: error
  data: null,
  prevTs: null,
};

const ldbBtcReducer = (state = initialState, action) => {

  if (action.type === UPDATE_LDB_BTC) {
    const { didFetch, data, prevTs } = action.payload;

    const newState = { ...state };
    if ([null, true, false].includes(didFetch)) newState.didFetch = didFetch;

    if (data === null) newState.data = null;
    else if (isObject(data)) newState.data = { ...data };

    if (prevTs === null || isNumber(prevTs)) newState.prevTs = prevTs;

    return newState;
  }

  if (action.type === RESET_STATE) {
    return state;
  }

  return state;
};

export default ldbBtcReducer;
