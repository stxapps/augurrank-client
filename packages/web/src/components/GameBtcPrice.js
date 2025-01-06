'use client';
import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { fetchBtcPrice, fetchBurnHeight } from '@/actions/chunk';

const USDollar = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 0,
});

export function GameBtcPrice() {
  const price = useSelector(state => state.gameBtc.price);
  const burnHeight = useSelector(state => state.gameBtc.burnHeight);
  const dispatch = useDispatch();

  const onRetryBtnClick = () => {
    if (price === -1) dispatch(fetchBtcPrice(true, true));
    if (burnHeight === -1) dispatch(fetchBurnHeight(true, true));
  };

  useEffect(() => {
    dispatch(fetchBtcPrice());
    dispatch(fetchBurnHeight());
  }, []);

  let pPane;
  if (price === null || burnHeight === null) { // loading
    pPane = (
      <div className="mt-2 h-8 animate-pulse rounded-lg w-28 bg-slate-700/40"></div>
    )
  } else if (price === -1 || burnHeight === -1) { // show error and retry button
    pPane = (
      <div className="mt-2 space-x-2 flex items-center justify-between">
        <p className="text-red-600">Something went wrong! Please wait and try again.</p>
        <button onClick={onRetryBtnClick} className="rounded-full bg-slate-600 px-4 py-2 text-sm font-medium text-slate-300 hover:brightness-110">Retry</button>
      </div>
    );
  } else { // show price
    pPane = (
      <p className="mt-1 text-3xl text-slate-200">{USDollar.format(price)}</p>
    );
  }

  return (
    <div className="px-7 py-8">
      <p className="text-sm text-slate-400">Approximately current price is</p>
      {pPane}
    </div>
  );
}
