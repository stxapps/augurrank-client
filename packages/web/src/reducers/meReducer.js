import { UPDATE_ME, RESET_STATE } from '@/types/actionTypes';
import { isObject } from '@/utils';

const initialState = {
  didFetch: null, // null: not yet, true: fetched, false: error
  stats: null,
  hasMore: null, // null: n/a, true: has more, false: no more
  fetchingMore: null, // null: not fetching, true: fetching, false: error
};

const meReducer = (state = initialState, action) => {

  if (action.type === UPDATE_ME) {
    const { didFetch, stats, hasMore, fetchingMore } = action.payload;

    const newState = { ...state };
    if ([null, true, false].includes(didFetch)) {
      newState.didFetch = didFetch;
    }
    if (stats === null) {
      newState.stats = null;
    } else if (isObject(stats)) {
      newState.stats = { ...stats };
    }
    if ([null, true, false].includes(hasMore)) {
      newState.hasMore = hasMore;
    }
    if ([null, true, false].includes(fetchingMore)) {
      newState.fetchingMore = fetchingMore;
    }

    return newState;
  }

  if (action.type === RESET_STATE) {
    return { ...initialState };
  }

  return state;
};

export default meReducer;
