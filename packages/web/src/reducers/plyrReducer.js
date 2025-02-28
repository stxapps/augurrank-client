import { UPDATE_PLYR } from '@/types/actionTypes';
import { isObject, isString, mergePreds } from '@/utils';

const initialState = {
  stxAddr: null, // null: not yet, empty str: invalid, filled str: valid
  didFetch: null, // null: not yet, true: fetched, false: error
  data: null,
  prevFName: null,
  fetchingMore: null, // null: not fetching, true: fetching, false: error
};

const PlyrReducer = (state = initialState, action) => {

  if (action.type === UPDATE_PLYR) {
    const { stxAddr, didFetch, data, dataMore, prevFName, fetchingMore } = action.payload;

    let newState = structuredClone(state);
    if (stxAddr === null || isString(stxAddr)) {
      if (newState.stxAddr !== stxAddr) newState = { ...initialState, stxAddr };
    }

    if ([null, true, false].includes(didFetch)) newState.didFetch = didFetch;

    if (data === null) {
      newState.data = null;
    } else if (isObject(data)) {
      newState.data = { ...data, preds: {} };
      if (Array.isArray(data.preds)) {
        for (const pred of data.preds) {
          newState.data.preds[pred.id] = mergePreds(newState.data.preds[pred.id], pred);
        }
      }
    }

    if (isObject(dataMore) && Array.isArray(dataMore.preds)) {
      if (isObject(newState.data) && isObject(newState.data.preds)) {
        for (const pred of dataMore.preds) {
          newState.data.preds[pred.id] = mergePreds(newState.data.preds[pred.id], pred);
        }
      }
    }

    if (prevFName === null || isString(prevFName)) newState.prevFName = prevFName;
    if ([null, true, false].includes(fetchingMore)) newState.fetchingMore = fetchingMore;

    return newState;
  }

  return state;
};

export default PlyrReducer;
