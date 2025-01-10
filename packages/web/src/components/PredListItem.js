import Link from 'next/link';
import clsx from 'clsx';
import { ArrowTopRightOnSquareIcon } from '@heroicons/react/24/solid';

import {
  CONTRACT_ADDR, PRED_STATUS_CONFIRMED_OK, PRED_STATUS_CONFIRMED_ERROR,
  PRED_STATUS_VERIFIABLE, PRED_STATUS_VERIFYING, PRED_STATUS_VERIFIED_OK,
  PRED_STATUS_VERIFIED_ERROR,
} from '@/types/const';
import { PredTimer } from '@/components/PredTimer';
import { LoadingIcon } from '@/components/Icons';
import { upperCaseFirstChar, localeNumber, localeDate } from "@/utils";

export function PredListItem(props) {
  const { predWthSts } = props;
  const { pred, status } = predWthSts;

  let tlPane, blPane, trValue, trCls, trTxId, trPane, brPane;
  if ([
    PRED_STATUS_VERIFIED_ERROR, PRED_STATUS_VERIFIED_OK, PRED_STATUS_VERIFYING,
  ].includes(status)) {
    tlPane = (
      <p className="text-lg text-slate-200">{upperCaseFirstChar(pred.value)} <Link className="text-sm text-slate-400 hover:underline" href={`https://explorer.hiro.so/txid/${pred.cTxId}?chain=mainnet`}>at #{localeNumber(pred.targetBurnHeight)}</Link></p>
    );
  } else if ([PRED_STATUS_VERIFIABLE, PRED_STATUS_CONFIRMED_OK].includes(status)) {
    tlPane = (
      <p className="text-lg text-slate-200">{upperCaseFirstChar(pred.value)} <span className="text-sm text-slate-400">at #{localeNumber(pred.targetBurnHeight)}</span></p>
    );
  } else {
    tlPane = (
      <p className="text-lg text-slate-200">{upperCaseFirstChar(pred.value)}</p>
    );
  }
  blPane = (
    <p className="text-sm text-slate-400">{localeDate(pred.createDate)} ∙ <Link className="hover:underline" href={`https://explorer.hiro.so/txid/${CONTRACT_ADDR}.${pred.game}?chain=mainnet`}>{pred.game}</Link></p>
  );
  if (status === PRED_STATUS_VERIFIED_ERROR) {
    [trValue, trCls, trTxId] = ['Error', 'text-red-600', pred.vTxId];
    brPane = (
      <p className="text-sm text-slate-400 text-right">Unable to verify</p>
    );
  } else if (status === PRED_STATUS_VERIFIED_OK) {
    trValue = `Verified: ${pred.correct}`;
    trCls = pred.correct === 'TRUE' ? 'text-green-500' : 'text-slate-200';
    trTxId = pred.vTxId
    brPane = (
      <p className="text-sm text-slate-400 text-right">${localeNumber(pred.anchorPrice)} / ${localeNumber(pred.targetPrice)}</p>
    );
  } else if (status === PRED_STATUS_VERIFYING) {
    [trValue, trCls, trTxId] = ['Verifying', 'text-sky-500', pred.vTxId];
    brPane = (
      <p className="text-sm text-slate-400 text-right">Verifying on the chain.</p>
    );
  } else if (status === PRED_STATUS_VERIFIABLE) {
    [trValue, trCls, trTxId] = ['Verifiable', 'text-sky-500', pred.cTxId];
    brPane = (
      <p className="text-sm text-slate-400 text-right">Waiting to verify.</p>
    );
  } else if (status === PRED_STATUS_CONFIRMED_ERROR) {
    [trValue, trCls, trTxId] = ['Error', 'text-red-600', pred.cTxId];
    brPane = (
      <p className="text-sm text-slate-400 text-right">Unable to store</p>
    );
  } else if (status === PRED_STATUS_CONFIRMED_OK) {
    [trValue, trCls, trTxId] = ['In anticipation', 'text-sky-500', pred.cTxId];
    brPane = (
      <p className="text-sm text-slate-400 text-right">
        <PredTimer targetBurnHeight={pred.targetBurnHeight} />
      </p>
    );
  } else {
    trPane = (
      <Link className="group flex items-center overflow-hidden" href={`https://explorer.hiro.so/txid/${pred.cTxId}?chain=mainnet`} target="_blank" rel="noreferrer">
        <LoadingIcon className="size-5 animate-spin stroke-slate-600 text-yellow-400" />
        <p className="ml-0.5 text-base text-yellow-400 group-hover:underline">In mempool</p>
        <ArrowTopRightOnSquareIcon className="ml-1 size-3.5 text-yellow-400" />
      </Link>
    );
    brPane = (
      <p className="text-sm text-slate-400 text-right">Storing on the chain</p>
    );
  }
  if ([
    PRED_STATUS_VERIFIED_ERROR, PRED_STATUS_VERIFIED_OK, PRED_STATUS_VERIFYING,
    PRED_STATUS_VERIFIABLE, PRED_STATUS_CONFIRMED_ERROR, PRED_STATUS_CONFIRMED_OK,
  ].includes(status)) {
    trPane = (
      <Link className="group flex items-center overflow-hidden" href={`https://explorer.hiro.so/txid/${trTxId}?chain=mainnet`} target="_blank" rel="noreferrer">
        <p className={clsx('text-base group-hover:underline', trCls)}>{trValue}</p>
        <ArrowTopRightOnSquareIcon className={clsx('ml-1 size-3.5', trCls)} />
      </Link>
    );
  }

  return (
    <div className="py-3">
      <div className="flex space-x-2 justify-between items-center">
        {tlPane}
        {trPane}
      </div>
      <div className="mt-2 flex space-x-2 justify-between items-baseline">
        {blPane}
        {brPane}
      </div>
    </div>
  );
}
