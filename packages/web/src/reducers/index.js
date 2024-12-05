import { combineReducers } from 'redux-loop';

import windowReducer from './windowReducer';
import displayReducer from './displayReducer';
import joinNewsletterReducer from './joinNewsletterReducer';
import userReducer from './userReducer';
import gamesReducer from './gamesReducer';
import meReducer from './meReducer';
import newsfeedReducer from './newsfeedReducer';

const reducers = combineReducers({
  window: windowReducer,
  display: displayReducer,
  joinNewsletter: joinNewsletterReducer,
  user: userReducer,
  games: gamesReducer,
  me: meReducer,
  newsfeed: newsfeedReducer,
});

export default reducers;
