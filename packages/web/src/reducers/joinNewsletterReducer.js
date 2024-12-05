import { UPDATE_JOIN_NEWSLETTER_STATE } from '@/types/actionTypes';
import { JOIN_NEWSLETTER_STATUS_INIT } from '@/types/const';

const initialState = {
  status: JOIN_NEWSLETTER_STATUS_INIT,
  email: '',
  extraMsg: ''
};

const joinNewsletterReducer = (state = initialState, action) => {

  if (action.type === UPDATE_JOIN_NEWSLETTER_STATE) {
    return { ...state, ...action.payload };
  }

  return state;
};

export default joinNewsletterReducer;
