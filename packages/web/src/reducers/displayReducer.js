import { UPDATE_POPUP, RESET_STATE } from '@/types/actionTypes';
import { AGREE_POPUP } from '@/types/const';

const initialState = {
  isAgreePopupShown: false,
};

const displayReducer = (state = initialState, action) => {

  if (action.type === UPDATE_POPUP) {
    const { id, isShown } = action.payload;

    if (id === AGREE_POPUP) {
      return { ...state, isAgreePopupShown: isShown };
    }

    return state;
  }

  if (action.type === RESET_STATE) {
    return { ...initialState };
  }

  return state;
};

export default displayReducer;
