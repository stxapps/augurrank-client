import { UPDATE_ME_EDITOR, RESET_STATE } from '@/types/actionTypes';
import { isString, isNumber } from '@/utils';
import { initialMeEditorState as initialState } from '../types/initialStates';

const meEditorReducer = (state = initialState, action) => {

  if (action.type === UPDATE_ME_EDITOR) {
    const {
      username, avatar, bio, renderCode, didFthAvlbUsns, avlbUsns, didFthAvlbAvts,
      avlbAvts, avlbAvtsMore, nftOffset, nftLimit, nftTotal, fthgAvlbAvtsMore, saving,
    } = action.payload;

    const newState = { ...state };
    if (username === null || isString(username)) newState.username = username;
    if (avatar === null || isString(avatar)) newState.avatar = avatar;
    if (bio === null || isString(bio)) newState.bio = bio;

    if (renderCode === null || isNumber(renderCode)) newState.renderCode = renderCode;

    if ([null, true, false].includes(didFthAvlbUsns)) {
      newState.didFthAvlbUsns = didFthAvlbUsns;
    }
    if (avlbUsns === null) newState.avlbUsns = avlbUsns;
    else if (Array.isArray(avlbUsns)) newState.avlbUsns = [...avlbUsns];

    if ([null, true, false].includes(didFthAvlbAvts)) {
      newState.didFthAvlbAvts = didFthAvlbAvts;
    }
    if (avlbAvts === null) newState.avlbAvts = avlbAvts;
    else if (Array.isArray(avlbAvts)) newState.avlbAvts = [...avlbAvts];

    if (Array.isArray(avlbAvtsMore) && Array.isArray(newState.avlbAvts)) {
      newState.avlbAvts = [...newState.avlbAvts, ...avlbAvtsMore];
    }

    if (nftOffset === null || isNumber(nftOffset)) newState.nftOffset = nftOffset;
    if (nftLimit === null || isNumber(nftLimit)) newState.nftLimit = nftLimit;
    if (nftTotal === null || isNumber(nftTotal)) newState.nftTotal = nftTotal;

    if ([null, true, false].includes(fthgAvlbAvtsMore)) {
      newState.fthgAvlbAvtsMore = fthgAvlbAvtsMore;
    }
    if ([null, true, false].includes(saving)) newState.saving = saving;

    return newState;
  }

  if (action.type === RESET_STATE) {
    return { ...initialState };
  }

  return state;
};

export default meEditorReducer;
