'use client';
import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Link from 'next/link';
import Image from 'next/image';
import { UserIcon } from '@heroicons/react/24/solid';
import clsx from 'clsx';

import { signIn } from '@/actions';
import { fetchBurnHeight, fetchMe } from '@/actions/chunk';
import { getMeStats } from '@/selectors';
import { isFldStr, localeNumber } from '@/utils';

export function MeStats() {
  const isUserSignedIn = useSelector(state => state.user.isUserSignedIn);
  const username = useSelector(state => state.user.username);
  const userImage = useSelector(state => state.user.image);
  const stxAddr = useSelector(state => state.user.stxAddr);
  const burnHeight = useSelector(state => state.gameBtc.burnHeight);
  const didFetch = useSelector(state => state.me.didFetch);
  const stats = useSelector(state => getMeStats(state));
  const dispatch = useDispatch();

  const onSignInBtnClick = () => {
    dispatch(signIn());
  };

  const onRetryBtnClick = () => {
    if (burnHeight === -1) dispatch(fetchBurnHeight(true, true));
    if (didFetch === false) dispatch(fetchMe(true, true));
  };

  useEffect(() => {
    dispatch(fetchBurnHeight());
    dispatch(fetchMe());
  }, [isUserSignedIn, dispatch]);

  const renderUsrPane = () => {
    let userImagePane, usernamePane, stxAddrPane;
    if (renderCode === 2) {
      if (isFldStr(userImage)) {
        userImagePane = (
          <Image className="size-32" src={userImage} alt="User image" />
        );
      } else {
        userImagePane = (
          <UserIcon className="size-32 text-slate-700" />
        );
      }
      usernamePane = (
        <h1 className="truncate text-center text-4xl font-medium text-slate-100 sm:text-left sm:text-5xl sm:leading-tight">{isFldStr(username) ? username : 'Username'}</h1>
      );
      if (isFldStr(stxAddr)) {
        stxAddrPane = (
          <div className="mt-3 flex sm:mt-0.5">
            <Link className="w-0 grow truncate text-center text-xl text-slate-400 sm:text-left" href={`https://explorer.hiro.so/address/${stxAddr}`} target="_blank" rel="noreferrer">{stxAddr}</Link>
          </div>
        );
      } else {
        stxAddrPane = (
          <p className="mt-3 text-center text-xl text-slate-400 sm:text-left">STX Address</p>
        );
      }
    } else {
      userImagePane = (
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
      <div className="flex flex-col items-center justify-start sm:flex-row sm:justify-center">
        <div className="rounded-full border-2 border-slate-800 p-2">{userImagePane}</div>
        <div className="mt-6 w-full max-w-md sm:ml-6 sm:mt-0 sm:w-auto">
          {usernamePane}
          {stxAddrPane}
        </div>
      </div>
    );
  };

  const renderCwPane = () => {
    return (
      <div className="border-2 border-transparent py-1 sm:py-2">
        <div className="flex h-60 flex-col items-center justify-center sm:h-32">
          <p className="text-center text-3xl font-medium text-slate-200">Connect your wallet to get started.</p>
          <button onClick={onSignInBtnClick} className="mt-4 rounded-full bg-orange-400 px-4 py-1.5 text-sm font-medium text-white hover:brightness-110">Connect Wallet</button>
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

  let renderCode, content;
  if (isUserSignedIn === null) { // loading
    renderCode = 0;
    content = renderUsrPane();
  } else if (isUserSignedIn === false) { // connect wallet
    renderCode = 1;
    content = renderCwPane();
  } else if (burnHeight === null || didFetch === null) { // loading
    renderCode = 0;
    content = renderUsrPane();
  } else if (burnHeight === -1 || didFetch === false) { // show retry button
    renderCode = 1;
    content = renderRtPane();
  } else {
    renderCode = 2;
    content = renderUsrPane();
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
      <p className="text-center text-4xl font-medium tracking-tight text-slate-100">{localeNumber(stats.nPending)}</p>
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
