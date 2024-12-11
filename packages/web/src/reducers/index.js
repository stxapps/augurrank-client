import { combineReducers } from 'redux-loop';

import windowReducer from './windowReducer';
import displayReducer from './displayReducer';
import joinNewsletterReducer from './joinNewsletterReducer';
import userReducer from './userReducer';
import gameBtcReducer from './gameBtcReducer';
import gameBtcPredsReducer from './gameBtcPredsReducer';
import meReducer from './meReducer';
import newsfeedReducer from './newsfeedReducer';

const reducers = combineReducers({
  window: windowReducer,
  display: displayReducer,
  joinNewsletter: joinNewsletterReducer,
  user: userReducer,
  gameBtc: gameBtcReducer,
  gameBtcPreds: gameBtcPredsReducer,
  me: meReducer,
  newsfeed: newsfeedReducer,
});

export default reducers;
