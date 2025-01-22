'use client';
import { useSelector, useDispatch } from 'react-redux';

import { fetchMeMore } from '@/actions/chunk';
import { PredList } from '@/components/PredList';
import { getMePredsWthSts } from '@/selectors';
import { getSignInStatus } from '@/utils';

export function MePreds() {
  const signInStatus = useSelector(state => getSignInStatus(state.user));
  const burnHeight = useSelector(state => state.gameBtc.burnHeight);
  const didFetch = useSelector(state => state.me.didFetch);
  const hasMore = useSelector(state => state.me.hasMore);
  const fetchingMore = useSelector(state => state.me.fetchingMore);
  const predsWthSts = useSelector(state => getMePredsWthSts(state));
  const dispatch = useDispatch();

  const onMoreBtnClick = () => {
    dispatch(fetchMeMore());
  };

  const onRetryMoreBtnClick = () => {
    dispatch(fetchMeMore(true));
  };

  const renderPdsPane = () => {
    return (
      <PredList predsWthSts={predsWthSts} hasMore={hasMore} fetchingMore={fetchingMore} onMoreBtnClick={onMoreBtnClick} onRetryMoreBtnClick={onRetryMoreBtnClick} />
    );
  };

  if (signInStatus === 0) { // loading
    return null;
  } else if (signInStatus === 1) { // connect wallet
    return null;
  } else if (signInStatus === 2) { // sign test string
    return null;
  } else if (burnHeight === null || didFetch === null) { // loading
    return null;
  } else if (burnHeight === -1 || didFetch === false) { // show retry button
    return null;
  } else {
    return renderPdsPane();
  }
}
