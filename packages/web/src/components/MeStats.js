'use client';
import Link from 'next/link';
import Image from 'next/image';
import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { UserIcon, PencilSquareIcon } from '@heroicons/react/24/solid';
import clsx from 'clsx';

import { chooseWallet, signStxTstStr } from '@/actions';
import { fetchBurnHeight, fetchMe, showMeEditorPopup } from '@/actions/chunk';
import { getMeStats } from '@/selectors';
import { getSignInStatus, isFldStr, localeNumber } from '@/utils';

export function MeStats() {
  const signInStatus = useSelector(state => getSignInStatus(state.user));
  const username = useSelector(state => state.user.username);
  const avatar = useSelector(state => state.user.avatar);
  const stxAddr = useSelector(state => state.user.stxAddr);
  const bio = useSelector(state => state.user.bio);
  const burnHeight = useSelector(state => state.gameBtc.burnHeight);
  const didFetch = useSelector(state => state.me.didFetch);
  const stats = useSelector(state => getMeStats(state));
  const dispatch = useDispatch();

  const onEdtBtnClick = () => {
    dispatch(showMeEditorPopup());
  };

  const onCwBtnClick = () => {
    dispatch(chooseWallet());
  };

  const onStsBtnClick = () => {
    dispatch(signStxTstStr());
  };

  const onRetryBtnClick = () => {
    if (burnHeight === -1) dispatch(fetchBurnHeight(true, true));
    if (didFetch === false) dispatch(fetchMe(true, true));
  };

  useEffect(() => {
    dispatch(fetchBurnHeight());
  }, [dispatch]);

  useEffect(() => {
    dispatch(fetchMe());
  }, [signInStatus, dispatch]);

  const renderUsrPane = () => {
    let avatarPane, usernamePane, stxAddrPane, bioPane, btnPane;
    if (renderCode === 2) {
      if (isFldStr(avatar)) {
        avatarPane = (
          <Image className="size-32" src={avatar} alt="User avatar" />
        );
      } else {
        avatarPane = (
          <UserIcon className="size-32 text-slate-700" />
        );
      }
      usernamePane = (
        <Link href={`https://explorer.hiro.so/address/${stxAddr}`} target="_blank" rel="noreferrer">
          <h1 className="truncate text-center text-4xl font-medium text-slate-100 sm:text-left sm:text-5xl sm:leading-tight">{isFldStr(username) ? username : 'Username'}</h1>
        </Link>
      );
      if (isFldStr(bio)) {
        bioPane = (
          <p className="mt-3 text-center text-base text-slate-400 sm:text-left sm:mt-1.5">{bio}</p>
        );
      } else {
        stxAddrPane = (
          <div className="mt-3 flex sm:mt-0.5">
            <p className="w-0 grow truncate text-center text-base text-slate-400 sm:text-left">{stxAddr}</p>
          </div>
        );
      }
      btnPane = (
        <button className="group block w-full py-3 flex items-center justify-center sm:justify-start sm:w-auto" onClick={onEdtBtnClick}>
          <PencilSquareIcon className="mb-0.5 size-4 text-slate-400 group-hover:text-orange-200" />
          <span className="ml-1 text-sm font-medium text-slate-400 group-hover:text-orange-200">Edit</span>
        </button>
      );
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
      <div className={clsx('flex flex-col items-center justify-start sm:flex-row sm:justify-center', isFldStr(bio) ? 'sm:items-start' : 'sm:items-center')}>
        <div className="rounded-full border-2 border-slate-800 p-2">{avatarPane}</div>
        <div className="mt-6 w-full max-w-md sm:ml-6 sm:mt-0 sm:w-auto sm:min-w-52">
          {usernamePane}
          {stxAddrPane}
          {bioPane}
          {btnPane}
        </div>
      </div>
    );
  };

  const renderCwPane = () => {
    return (
      <div className="border-2 border-transparent py-1 sm:py-2">
        <div className="flex h-60 flex-col items-center justify-center sm:h-32">
          <p className="text-center text-3xl font-medium text-slate-200">Connect your wallet to get started.</p>
          <button onClick={onCwBtnClick} className="mt-4 rounded-full bg-orange-400 px-4 py-1.5 text-sm font-medium text-white hover:brightness-110">Connect Wallet</button>
        </div>
      </div>
    );
  };

  const renderStsPane = () => {
    return (
      <div className="border-2 border-transparent py-1 sm:py-2">
        <div className="flex h-60 flex-col items-center justify-center sm:h-32">
          <p className="text-center text-2xl font-medium text-slate-200">Sign a message to prove you own your STX address so we can give you access to our server.</p>
          <button onClick={onStsBtnClick} className="mt-4 rounded-full bg-orange-400 px-4 py-1.5 text-sm font-medium text-white hover:brightness-110">Sign Message</button>
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
  if (signInStatus === 0) { // loading
    renderCode = 0;
    content = renderUsrPane();
  } else if (signInStatus === 1) { // connect wallet
    renderCode = 1;
    content = renderCwPane();
  } else if (signInStatus === 2) { // sign test string
    renderCode = 1;
    content = renderStsPane();
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
