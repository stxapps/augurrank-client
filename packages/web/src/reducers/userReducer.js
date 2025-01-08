import { INIT, UPDATE_USER, UPDATE_GAME_BTC, RESET_STATE } from '../types/actionTypes';

const initialState = {
  isUserSignedIn: null,
  username: null,
  image: null,
  stxAddr: null,
  didAgreeTerms: null,
};

const userReducer = (state = initialState, action) => {

  if (action.type === INIT) {
    return {
      ...state,
      isUserSignedIn: action.payload.isUserSignedIn,
      username: action.payload.username,
      image: action.payload.userImage,
      stxAddr: action.payload.userStxAddr,
      didAgreeTerms: action.payload.didAgreeTerms,
    };
  }

  if (action.type === UPDATE_USER) {
    return { ...state, ...action.payload };
  }

  if (action.type === UPDATE_GAME_BTC) {
    const { didAgreeTerms } = action.payload;
    if (didAgreeTerms === true) {
      return { ...state, didAgreeTerms };
    }
  }

  if (action.type === RESET_STATE) {
    return { ...initialState, isUserSignedIn: false };
  }

  return state;
};

export default userReducer;
