'use client';
import Link from 'next/link';
import { useSelector, useDispatch } from 'react-redux';
import { ArrowTrendingUpIcon } from '@heroicons/react/24/solid';

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

  const renderEmpty = () => {
    return (
      <div className="flex flex-col items-center justify-center pt-6 text-center">
        <ArrowTrendingUpIcon className="size-12 text-slate-400" />
        <h3 className="mt-3 text-base font-semibold text-slate-100">There are no predictions yet.</h3>
        <p className="mt-1 text-sm text-slate-400">Get started by predicting the BTC price.</p>
        <Link className="mt-4 rounded-full bg-orange-400 px-4 py-2 text-sm font-medium text-white hover:brightness-110" href="/game-btc" prefetch={false}>Game</Link>
      </div>
    );
  };

  const renderPdsPane = () => {
    return (
      <PredList predsWthSts={predsWthSts} hasMore={hasMore} fetchingMore={fetchingMore} onMoreBtnClick={onMoreBtnClick} onRetryMoreBtnClick={onRetryMoreBtnClick} renderEmpty={renderEmpty} />
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
