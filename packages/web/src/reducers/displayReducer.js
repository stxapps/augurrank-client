import {
  UPDATE_POPUP, UPDATE_WALLET_POPUP, UPDATE_ERROR_POPUP, RESET_STATE,
} from '@/types/actionTypes';
import { AGREE_POPUP } from '@/types/const';

const initialState = {
  isAgreePopupShown: false,
  installedWalletIds: null,
  errorPopupTitle: null,
  errorPopupBody: null,
};

const displayReducer = (state = initialState, action) => {

  if (action.type === UPDATE_POPUP) {
    const { id, isShown } = action.payload;

    if (id === AGREE_POPUP) {
      return { ...state, isAgreePopupShown: isShown };
    }

    return state;
  }

  if (action.type === UPDATE_WALLET_POPUP) {
    const { installedWalletIds } = action.payload;

    const newState = { ...state };
    if (Array.isArray(installedWalletIds)) {
      newState.installedWalletIds = [...installedWalletIds];
    } else {
      newState.installedWalletIds = null;
    }
    return newState;
  }

  if (action.type === UPDATE_ERROR_POPUP) {
    const { title, body } = action.payload;
    return { ...state, errorPopupTitle: title, errorPopupBody: body };
  }

  if (action.type === RESET_STATE) {
    return { ...initialState };
  }

  return state;
};

export default displayReducer;
