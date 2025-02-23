'use client';
import Link from 'next/link';
import { useMemo } from 'react';
import { useSelector } from 'react-redux';

import { getPndgGameBtcPredWthSts, getLdbBtcUsrs } from '@/selectors';
import { getSignInStatus, isObject } from '@/utils';

export function LdbBtcCta() {
  const signInStatus = useSelector(state => getSignInStatus(state.user));
  const predWthSts = useSelector(state => getPndgGameBtcPredWthSts(state));
  const didFetch = useSelector(state => state.ldbBtc.didFetch);
  const usrs = useSelector(state => getLdbBtcUsrs(state));

  const rank = useMemo(() => {
    if (!Array.isArray(usrs)) return -1;
    return usrs.findIndex(usr => usr.isUser);
  }, [usrs]);

  if (didFetch !== true) return null;
  if (isObject(predWthSts) && isObject(predWthSts.pred)) return null;

  let title, body;
  if (signInStatus !== 3) {
    title = 'Are you ready?';
    body = 'Challenge yourself and strive to the top.';
  } else if (rank === -1) {
    title = 'Wanna join the club?';
    body = 'The beginning is always the hardest.';
  } else if (rank === 0) {
    title = 'Don\'t wait till someone replaces you.';
    body = 'Success is hard; maintaining is harder.';
  } else {
    title = 'Are you afraid of heights?';
    body = 'The view is always better from the top.';
  }

  return (
    <div className="mx-auto mt-20 max-w-sm">
      <h3 className="text-center text-xl font-medium text-slate-100">{title}</h3>
      <p className="mt-2 text-center text-base text-slate-400">{body}</p>
      <div className="mt-6 flex items-center justify-center">
        <Link className="rounded-full bg-orange-400 px-4 py-1.5 text-sm font-semibold text-white hover:brightness-110" href="/game-btc" prefetch={false}>Play Now</Link>
      </div>
    </div>
  );
}
