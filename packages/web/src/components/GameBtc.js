'use client';
import Link from 'next/link';
import Image from 'next-image-export-optimizer';
import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  ArrowTrendingUpIcon, ArrowTrendingDownIcon,
} from '@heroicons/react/24/solid';
import { fetch } from '@/actions/chunk';
import LogoBtc from '@/images/logo-btc.svg';

export function GameBtc() {
  const dispatch = useDispatch();

  const onUpBtnClick = () => {

  };

  const onDownBtnClick = () => {

  };

  useEffect(() => {
    dispatch(fetch());
  }, []);

  return (
    <main className="relative mx-auto max-w-2xl overflow-hidden px-6 py-20">
      <div className="flex flex-col items-center justify-start sm:flex-row sm:justify-center">
        <div className="rounded-full border-2 border-slate-800 p-2">
          <Image className="size-32" src={LogoBtc} alt="" />
        </div>
        <div className="mt-6 sm:ml-6 sm:mt-0">
          <h1 className="text-center text-5xl font-medium text-white sm:text-left">Bitcoin</h1>
          <p className="mt-3 text-center text-xl text-slate-400 sm:text-left">Your vision on Bitcoin price</p>
        </div>
      </div>
      <div className="mt-10 rounded-xl bg-slate-800/75 mx-auto max-w-sm">
        <div className="px-7 pt-10 pb-8">
          <p className="text-base text-slate-200">Challenge yourself to envision the future of Bitcoin price, store your predictions on the chain, and brag about your accuracy forever.</p>
        </div>
        <div className="h-px bg-slate-700" />
        <div className="px-7 py-8">
          <p className="text-sm text-slate-400">Approx. current price*</p>
          <p className="mt-1 text-3xl text-slate-200">98,000 USD</p>
        </div>
        <div className="h-px bg-slate-700" />
        <div className="px-7 py-8">
          <p className="text-base text-slate-200">In the next 100 Bitcoin blocks (approx. 16 hrs), will the price go:</p>
          <div>
            <button onClick={onUpBtnClick} className="rounded-full bg-orange-400 px-4 py-1.5 text-sm font-semibold text-white hover:brightness-110" disabled={false}>
              <ArrowTrendingUpIcon />
              <span>Up</span>
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
