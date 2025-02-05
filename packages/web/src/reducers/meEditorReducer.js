import { UPDATE_ME_EDITOR, RESET_STATE } from '@/types/actionTypes';
import { isString, isNumber } from '@/utils';

const initialState = {
  username: null,
  avatar: null,
  bio: null,
  didFetch: null, // null: not yet, true: fetched, false: error
  avlbUsns: null,
  avlbAvts: null,
  nftOffset: null,
  nftLimit: null,
  nftTotal: null,
  fetchingMore: null, // null: not fetching, true: fetching, false: error
};

const meEditorReducer = (state = initialState, action) => {

  if (action.type === UPDATE_ME_EDITOR) {
    const {
      username, avatar, bio, didFetch, avlbUsns, avlbAvts, moreAvlbAvts,
      nftOffset, nftLimit, nftTotal, fetchingMore,
    } = action.payload;

    const newState = { ...state };
    if (username === null || isString(username)) newState.username = username;
    if (avatar === null || isString(avatar)) newState.avatar = avatar;
    if (bio === null || isString(bio)) newState.bio = bio;

    if ([null, true, false].includes(didFetch)) newState.didFetch = didFetch;

    if (avlbUsns === null) newState.avlbUsns = avlbUsns;
    else if (Array.isArray(avlbUsns)) newState.avlbUsns = [...avlbUsns];

    if (avlbAvts === null) newState.avlbAvts = avlbAvts;
    else if (Array.isArray(avlbAvts)) newState.avlbAvts = [...avlbAvts];

    if (Array.isArray(moreAvlbAvts) && Array.isArray(newState.avlbAvts)) {
      newState.avlbAvts = [...newState.avlbAvts, ...moreAvlbAvts];
    }

    if (nftOffset === null || isNumber(nftOffset)) newState.nftOffset = nftOffset;
    if (nftLimit === null || isNumber(nftLimit)) newState.nftLimit = nftLimit;
    if (nftTotal === null || isNumber(nftTotal)) newState.nftTotal = nftTotal;

    if ([null, true, false].includes(fetchingMore)) newState.fetchingMore = fetchingMore;

    return newState;
  }

  if (action.type === RESET_STATE) {
    return { ...initialState };
  }

  return state;
};

export default meEditorReducer;
