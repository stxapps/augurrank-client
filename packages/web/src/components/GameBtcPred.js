'use client';
import { useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Link from 'next/link';
import {
  ArrowTrendingUpIcon, ArrowTrendingDownIcon, ArrowTopRightOnSquareIcon,
} from '@heroicons/react/24/solid';

import { signIn } from '@/actions';
import { fetchGameBtc, predictGameBtc } from '@/actions/chunk';
import {
  CONTRACT_ADDR, PRED_STATUS_INIT, PRED_STATUS_CONFIRMED_OK,
} from '@/types/const';
import { PredTimer } from '@/components/PredTimer';
import { LoadingIcon } from '@/components/Icons';
import { getPndgGameBtcPredWthSts } from '@/selectors';
import {
  isObject, isZrOrPst, upperCaseFirstChar, localeNumber, localeDate,
} from '@/utils';

export function GameBtcPred() {
  const isUserSignedIn = useSelector(state => state.user.isUserSignedIn);
  const price = useSelector(state => state.gameBtc.price);
  const burnHeight = useSelector(state => state.gameBtc.burnHeight);
  const didFetch = useSelector(state => state.gameBtc.didFetch);
  const predWthSts = useSelector(state => getPndgGameBtcPredWthSts(state));
  const dispatch = useDispatch();
  const didClick = useRef(false);

  const onSignInBtnClick = () => {
    dispatch(signIn());
  };

  const onRetryBtnClick = () => {
    dispatch(fetchGameBtc(true, true));
  };

  const onUpBtnClick = () => {
    if (didClick.current) return;
    didClick.current = true;
    dispatch(predictGameBtc('up'));
  };

  const onDownBtnClick = () => {
    if (didClick.current) return;
    didClick.current = true;
    dispatch(predictGameBtc('down'));
  };

  useEffect(() => {
    dispatch(fetchGameBtc());
  }, [isUserSignedIn]);

  useEffect(() => {
    didClick.current = false;
  }, [predWthSts]);

  const renderUdbsPane = () => {
    const disabled = (
      isUserSignedIn !== true || !isZrOrPst(price) ||
      !isZrOrPst(burnHeight) || didFetch !== true
    );
    return (
      <>
        <p className="text-base text-slate-200">Will the price go up or down at the following 100 Bitcoin blocks (approximately 16 hrs)?</p>
        <div className="mt-4 flex space-x-2 justify-stretch">
          <button onClick={onUpBtnClick} className="w-full rounded-full bg-orange-400 px-4 py-1.5 text-sm font-semibold text-white hover:brightness-110 disabled:brightness-75" disabled={disabled}>
            <div className="flex justify-center items-center space-x-2">
              <span>Up</span>
              <ArrowTrendingUpIcon className="size-5" />
            </div>
          </button>
          <button onClick={onDownBtnClick} className="w-full rounded-full bg-orange-400 px-4 py-1.5 text-sm font-semibold text-white hover:brightness-110 disabled:brightness-75" disabled={disabled}>
            <div className="flex justify-center items-center space-x-2">
              <span>Down</span>
              <ArrowTrendingDownIcon className="size-5" />
            </div>
          </button>
        </div>
      </>
    );
  };

  const renderLdgPane = () => {
    return (
      <>
        {renderUdbsPane()}
        <div className="absolute inset-0 bg-slate-800/50 backdrop-blur-[1px]"></div>
        <div className="absolute inset-0 flex items-center justify-center p-4">
          <LoadingIcon className="relative size-10 animate-spin stroke-slate-500 text-slate-300" />
        </div>
      </>
    );
  };

  const renderCwPane = () => {
    return (
      <>
        {renderUdbsPane()}
        <div className="absolute inset-0 bg-slate-800/85 backdrop-blur-sm"></div>
        <div className="absolute inset-0 flex items-center justify-center p-4">
          <div className="relative text-center">
            <p className="text-lg text-slate-200">Connect your wallet to get started.</p>
            <button onClick={onSignInBtnClick} className="mt-4 rounded-full bg-orange-400 px-4 py-1.5 text-sm font-medium text-white hover:brightness-110">Connect Wallet</button>
          </div>
        </div>
      </>
    );
  };

  const renderRtPane = () => {
    return (
      <>
        {renderUdbsPane()}
        <div className="absolute inset-0 bg-slate-800/85 backdrop-blur-sm"></div>
        <div className="absolute inset-0 flex items-center justify-center p-4">
          <div className="relative text-center p-4">
            <p className="text-base text-red-600">Something went wrong! Please wait and try again.</p>
            <button onClick={onRetryBtnClick} className="mt-3 rounded-full bg-slate-600 px-4 py-2 text-sm font-medium text-slate-300 hover:brightness-110">Retry</button>
          </div>
        </div>
      </>
    );
  };

  const renderCfPdPane = () => {
    const { pred } = predWthSts;

    return (
      <>
        <div className="flex space-x-2 justify-between items-center">
          <p className="text-lg text-slate-200">{upperCaseFirstChar(pred.value)} <span className="text-sm text-slate-400">at #{localeNumber(pred.targetBurnHeight)}</span></p>
          <Link className="group flex items-center overflow-hidden" href={`https://explorer.hiro.so/txid/${pred.cTxId}?chain=mainnet`} target="_blank" rel="noreferrer">
            <p className="text-base text-sky-500 group-hover:underline">In anticipation</p>
            <ArrowTopRightOnSquareIcon className="ml-1 size-3.5 text-sky-500" />
          </Link>
        </div>
        <div className="mt-2 flex space-x-2 justify-between items-baseline">
          <p className="text-sm text-slate-400">{localeDate(pred.createDate)} ∙ <Link className="hover:underline" href={`https://explorer.hiro.so/txid/${CONTRACT_ADDR}.${pred.game}?chain=mainnet`}>{pred.game}</Link></p>
          <p className="text-sm text-slate-400 text-right">
            <PredTimer targetBurnHeight={pred.targetBurnHeight} />
          </p>
        </div>
      </>
    );
  };

  const renderMpPdPane = () => {
    const { pred } = predWthSts;

    return (
      <>
        <div className="flex space-x-2 justify-between items-center">
          <p className="text-lg text-slate-200">{upperCaseFirstChar(pred.value)}</p>
          <Link className="group flex items-center overflow-hidden" href={`https://explorer.hiro.so/txid/${pred.cTxId}?chain=mainnet`} target="_blank" rel="noreferrer">
            <LoadingIcon className="size-5 animate-spin stroke-slate-600 text-yellow-400" />
            <p className="ml-0.5 text-base text-yellow-400 group-hover:underline">In mempool</p>
            <ArrowTopRightOnSquareIcon className="ml-1 size-3.5 text-yellow-400" />
          </Link>
        </div>
        <div className="mt-2 flex space-x-2 justify-between items-baseline">
          <p className="text-sm text-slate-400">{localeDate(pred.createDate)} ∙ <Link className="hover:underline" href={`https://explorer.hiro.so/txid/${CONTRACT_ADDR}.${pred.game}?chain=mainnet`}>{pred.game}</Link></p>
          <p className="text-sm text-slate-400 text-right">Storing on the chain</p>
        </div>
      </>
    );
  };

  let content;
  if (isUserSignedIn === null) { // loading
    content = renderLdgPane();
  } else if (isUserSignedIn === false) { // connect wallet
    content = renderCwPane();
  } else if (price === null || burnHeight === null || didFetch === null) { // loading
    content = renderLdgPane();
  } else if (price === -1 || burnHeight === -1) { // disable up and down buttons
    content = renderUdbsPane();
  } else if (didFetch === false) { // show retry button
    content = renderRtPane();
  } else if (isObject(predWthSts) && isObject(predWthSts.pred)) {
    if (predWthSts.status === PRED_STATUS_INIT) { // loading
      content = renderLdgPane();
    } else if (predWthSts.status === PRED_STATUS_CONFIRMED_OK) {  // show pending
      content = renderCfPdPane();
    } else { // in mempool
      content = renderMpPdPane();
    }
  } else { // show up or Down
    content = renderUdbsPane();
  }

  return (
    <div className="relative px-7 py-8 min-h">
      {content}
    </div>
  );
}
