import { combineReducers } from 'redux-loop';

import windowReducer from './windowReducer';
import displayReducer from './displayReducer';
import joinNewsletterReducer from './joinNewsletterReducer';
import userReducer from './userReducer';
import meReducer from './meReducer';
import gameBtcReducer from './gameBtcReducer';
import gameBtcPredsReducer from './gameBtcPredsReducer';
import newsfeedReducer from './newsfeedReducer';

const reducers = combineReducers({
  window: windowReducer,
  display: displayReducer,
  joinNewsletter: joinNewsletterReducer,
  user: userReducer,
  me: meReducer,
  gameBtc: gameBtcReducer,
  gameBtcPreds: gameBtcPredsReducer,
  newsfeed: newsfeedReducer,
});

export default reducers;
