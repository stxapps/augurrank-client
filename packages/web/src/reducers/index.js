import { combineReducers } from 'redux-loop';

import windowReducer from './windowReducer';
import displayReducer from './displayReducer';
import joinNewsletterReducer from './joinNewsletterReducer';
import userReducer from './userReducer';
import meReducer from './meReducer';
import meEditorReducer from './meEditorReducer';
import gameBtcReducer from './gameBtcReducer';
import gameBtcPredsReducer from './gameBtcPredsReducer';
import ldbBtcReducer from './ldbBtcReducer';
import newsfeedReducer from './newsfeedReducer';

const reducers = combineReducers({
  window: windowReducer,
  display: displayReducer,
  joinNewsletter: joinNewsletterReducer,
  user: userReducer,
  me: meReducer,
  meEditor: meEditorReducer,
  gameBtc: gameBtcReducer,
  gameBtcPreds: gameBtcPredsReducer,
  ldbBtc: ldbBtcReducer,
  newsfeed: newsfeedReducer,
});

export default reducers;
