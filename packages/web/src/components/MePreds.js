'use client';
import { useSelector, useDispatch } from 'react-redux';

import { fetchMeMore } from '@/actions/chunk';
import { PredList } from '@/components/PredList';
import { getMePredsWthSts } from '@/selectors';

export function MePreds() {
  const isUserSignedIn = useSelector(state => state.user.isUserSignedIn);
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
  }

  if (isUserSignedIn === null) { // loading
    return null;
  } else if (isUserSignedIn === false) { // connect wallet
    return null;
  } else if (burnHeight === null || didFetch === null) { // loading
    return null;
  } else if (burnHeight === -1 || didFetch === false) { // show retry button
    return null;
  } else {
    return renderPdsPane();
  }
}
