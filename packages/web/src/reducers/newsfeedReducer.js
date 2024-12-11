import { RESET_STATE } from '@/types/actionTypes';

const initialState = {

};

const newsfeedReducer = (state = initialState, action) => {

  if (action.type === RESET_STATE) {
    return { ...initialState };
  }

  return state;
};

export default newsfeedReducer;
