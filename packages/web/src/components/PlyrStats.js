'use client';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next-image-export-optimizer';
import { useEffect, Suspense } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { UserIcon } from '@heroicons/react/24/solid';
import clsx from 'clsx';

import { fetchPlyr, updatePlyr } from '@/actions/chunk';
import { getPlyrStats } from '@/selectors';
import {
  isObject, isString, isFldStr, localeNumber, parseAvatar, getAvtThbnl,
} from '@/utils';

function PlyrSParam() {
  const stxAddr = useSearchParams().get('s');
  const dispatch = useDispatch();

  useEffect(() => {
    const derived = isString(stxAddr) ? stxAddr : '';
    dispatch(updatePlyr({ stxAddr: derived }));
  }, [stxAddr, dispatch]);

  return null;
}

export function PlyrStats() {
  const stxAddr = useSelector(state => state.plyr.stxAddr);
  const didFetch = useSelector(state => state.plyr.didFetch);
  const data = useSelector(state => state.plyr.data);
  const stats = useSelector(state => getPlyrStats(state));
  const dispatch = useDispatch();

  const onRetryBtnClick = () => {
    dispatch(fetchPlyr(true, true));
  };

  useEffect(() => {
    dispatch(fetchPlyr());
  }, [stxAddr, dispatch]);

  const renderCntPane = () => {
    let avatarPane, usernamePane, stxAddrPane, bioPane;
    if (renderCode === 2) {
      const avtThbnl = getAvtThbnl(parseAvatar(data.avatar));

      if (isFldStr(avtThbnl)) {
        avatarPane = (
          <Image className="size-32 rounded-full" width={128} height={128} src={avtThbnl} alt="User avatar" unoptimized={true} placeholder="empty" priority={true} />
        );
      } else {
        avatarPane = (
          <UserIcon className="size-32 text-slate-700" />
        );
      }
      usernamePane = (
        <Link href={`https://explorer.hiro.so/address/${stxAddr}`} target="_blank" rel="noreferrer">
          <h1 className="truncate text-center text-4xl font-medium text-slate-100 sm:text-left sm:text-5xl sm:leading-tight">{isFldStr(data.username) ? data.username : 'Username'}</h1>
        </Link>
      );
      if (isFldStr(data.bio)) {
        bioPane = (
          <p className="mt-3 max-h-72 overflow-hidden whitespace-pre-wrap text-center text-base text-slate-400 sm:mt-1.5 sm:text-left">{data.bio}</p>
        );
      } else {
        stxAddrPane = (
          <div className="mt-3 flex sm:mt-0.5">
            <p className="w-0 grow truncate text-center text-base text-slate-400 sm:text-left">{stxAddr}</p>
          </div>
        );
      }
    } else {
      avatarPane = (
        <div className={clsx('size-32 rounded-full bg-slate-800', renderCode === 0 && 'animate-pulse')} />
      );
      usernamePane = (
        <div className="flex items-center justify-center sm:justify-start">
          <div className={clsx('h-10 w-64 rounded bg-slate-800', renderCode === 0 && 'animate-pulse')} />
        </div>
      );
      stxAddrPane = (
        <div className="flex items-center justify-center sm:justify-start">
          <div className={clsx('mt-4 h-6 w-40 rounded bg-slate-800', renderCode === 0 && 'animate-pulse')} />
        </div>
      );
    }

    return (
      <div className={clsx('flex flex-col items-center justify-start sm:flex-row sm:justify-center', isObject(data) && isFldStr(data.bio) ? 'sm:items-start' : 'sm:items-center')}>
        <div className="rounded-full border-2 border-slate-800 p-2">{avatarPane}</div>
        <div className="mt-6 w-full max-w-md sm:ml-6 sm:mt-0 sm:w-auto sm:min-w-52">
          {usernamePane}
          {stxAddrPane}
          {bioPane}
        </div>
      </div>
    );
  };

  const renderRtPane = () => {
    return (
      <div className="border-2 border-transparent py-1 sm:py-2">
        <div className="flex h-60 flex-col items-center justify-center sm:h-32">
          <p className="text-center text-lg text-red-600">Something went wrong! Please wait and try again.</p>
          <button onClick={onRetryBtnClick} className="mt-3 rounded-full bg-slate-600 px-4 py-2 text-sm font-medium text-slate-300 hover:brightness-110">Retry</button>
        </div>
      </div>
    );
  };

  const renderIvdPane = () => {
    return (
      <div className="border-2 border-transparent py-1 sm:py-2">
        <div className="flex h-60 flex-col items-center justify-center sm:h-32">
          <p className="text-center text-lg text-slate-400"></p>

        </div>
      </div>
    );
  };

  const renderEpyPane = () => {
    return (
      <div className="border-2 border-transparent py-1 sm:py-2">
        <div className="flex h-60 flex-col items-center justify-center sm:h-32">
          <p className="text-center text-lg text-slate-400"></p>

        </div>
      </div>
    );
  };

  let renderCode, content;
  if (stxAddr === null) { // loading
    renderCode = 0;
    content = renderCntPane();
  } else if (!isFldStr(stxAddr)) {
    renderCode = 1;
    content = renderIvdPane();
  } else if (didFetch === null) { // loading
    renderCode = 0;
    content = renderCntPane();
  } else if (didFetch === false) { // show retry button
    renderCode = 1;
    content = renderRtPane();
  } else if (!isObject(data)) {
    renderCode = 1;
    content = renderEpyPane();
  } else {
    renderCode = 2;
    content = renderCntPane();
  }

  let winsPane, lossesPane, pendingPane;
  if (renderCode === 2) {
    winsPane = (
      <p className="text-center text-4xl font-medium tracking-tight text-slate-100">{localeNumber(stats.nWins)}</p>
    );
    lossesPane = (
      <p className="text-center text-4xl font-medium tracking-tight text-slate-100">{localeNumber(stats.nLosses)}</p>
    );
    pendingPane = (
      <p className="text-center text-4xl font-medium tracking-tight text-slate-100">-</p>
    );
  } else {
    winsPane = (
      <div className="flex items-center justify-center">
        <div className={clsx('size-10 rounded bg-slate-700/75', renderCode === 0 && 'animate-pulse')} />
      </div>
    );
    lossesPane = (
      <div className="flex items-center justify-center">
        <div className={clsx('size-10 rounded bg-slate-700/75', renderCode === 0 && 'animate-pulse')} />
      </div>
    );
    pendingPane = (
      <div className="flex items-center justify-center">
        <div className={clsx('size-10 rounded bg-slate-700/75', renderCode === 0 && 'animate-pulse')} />
      </div>
    );
  }

  let contWinsPane, contDaysPane;
  if (renderCode === 2) {
    contWinsPane = (
      <p className="text-center text-4xl font-medium tracking-tight text-slate-100">{localeNumber(stats.maxContWins)} / {localeNumber(stats.nContWins)}</p>
    );
    contDaysPane = (
      <p className="text-center text-4xl font-medium tracking-tight text-slate-100">{localeNumber(stats.maxContDays)} / {localeNumber(stats.nContDays)}</p>
    );
  } else {
    contWinsPane = (
      <div className="flex items-center justify-center">
        <div className={clsx('size-10 rounded bg-slate-700/75', renderCode === 0 && 'animate-pulse')} />
      </div>
    );
    contDaysPane = (
      <div className="flex items-center justify-center">
        <div className={clsx('size-10 rounded bg-slate-700/75', renderCode === 0 && 'animate-pulse')} />
      </div>
    );
  }

  return (
    <>
      <Suspense fallback={null}>
        <PlyrSParam />
      </Suspense>
      {content}
      <div className="mt-10 rounded-xl bg-slate-800/75">
        <div className="sm:flex sm:items-stretch sm:justify-stretch">
          <div className="flex-1 py-6">
            {winsPane}
            <p className="mt-2 text-center text-sm font-medium text-slate-400">Wins</p>
          </div>
          <div className="h-px bg-slate-700 sm:h-auto sm:w-px" />
          <div className="flex-1 py-6">
            {lossesPane}
            <p className="mt-2 text-center text-sm font-medium text-slate-400">Losses</p>
          </div>
          <div className="h-px bg-slate-700 sm:h-auto sm:w-px" />
          <div className="flex-1 py-6">
            {pendingPane}
            <p className="mt-2 text-center text-sm font-medium text-slate-400">Pending</p>
          </div>
        </div>
        <div className="h-px bg-slate-700" />
        <div className="sm:flex sm:items-stretch sm:justify-stretch">
          <div className="flex-1 py-6">
            {contWinsPane}
            <p className="mt-2 text-center text-sm font-medium text-slate-400">Longest / Current win streak</p>
          </div>
          <div className="h-px bg-slate-700 sm:h-auto sm:w-px" />
          <div className="flex-1 py-6">
            {contDaysPane}
            <p className="mt-2 text-center text-sm font-medium text-slate-400">Longest / Current play streak</p>
          </div>
        </div>
      </div>
    </>
  );
}
