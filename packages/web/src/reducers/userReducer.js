import { loop, Cmd } from 'redux-loop';

import { updateLocalUser } from '../actions';
import {
  INIT, UPDATE_USER, UPDATE_GAME_BTC, UPDATE_ME, RESET_STATE,
} from '../types/actionTypes';
import { isString } from '../utils';

const initialState = {
  stxAddr: null, // null: n/a, '': no value, str: has value
  stxPubKey: null, // same as above
  stxSigStr: null, // same as above
  username: null, // same as above
  avatar: null, // same as above
  bio: null, // same as above
  didAgreeTerms: null, // null or false: n/a or did not agree, true: agreed
};

const userReducer = (state = initialState, action) => {

  if (action.type === INIT) {
    return {
      ...state,
      stxAddr: action.payload.stxAddr,
      stxPubKey: action.payload.stxPubKey,
      stxSigStr: action.payload.stxSigStr,
      username: action.payload.username,
      avatar: action.payload.avatar,
      bio: action.payload.bio,
      didAgreeTerms: action.payload.didAgreeTerms,
    };
  }

  if (action.type === UPDATE_USER) {
    const newState = { ...state, ...action.payload };
    return loop(
      newState, Cmd.run(updateLocalUser(), { args: [Cmd.dispatch, Cmd.getState] })
    );
  }

  if (action.type === UPDATE_GAME_BTC) {
    const { didAgreeTerms } = action.payload;

    const newState = { ...state };
    if (didAgreeTerms === true) newState.didAgreeTerms = didAgreeTerms;

    return loop(
      newState, Cmd.run(updateLocalUser(), { args: [Cmd.dispatch, Cmd.getState] })
    );
  }

  if (action.type === UPDATE_ME) {
    const { username, avatar, bio } = action.payload;

    const newState = { ...state };
    if (isString(username)) newState.username = username;
    if (isString(avatar)) newState.avatar = avatar;
    if (isString(bio)) newState.bio = bio;

    return loop(
      newState, Cmd.run(updateLocalUser(), { args: [Cmd.dispatch, Cmd.getState] })
    );
  }

  if (action.type === RESET_STATE) {
    const { stxAddr, stxPubKey, stxSigStr } = action.payload;

    const newState = { ...initialState, stxAddr, stxPubKey, stxSigStr };
    return loop(
      newState, Cmd.run(updateLocalUser(), { args: [Cmd.dispatch, Cmd.getState] })
    );
  }

  return state;
};

export default userReducer;
