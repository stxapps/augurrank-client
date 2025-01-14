import Link from 'next/link';
import { ArrowTrendingUpIcon } from '@heroicons/react/24/solid';

import { PredListItem } from '@/components/PredListItem';

export function PredList(props) {
  const {
    predsWthSts, hasMore, fetchingMore, onMoreBtnClick, onRetryMoreBtnClick,
  } = props;

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

  const renderItems = () => {
    return (
      <div className="divide-y divide-slate-700">
        {predsWthSts.map(predWthSts => <PredListItem key={predWthSts.pred.id} predWthSts={predWthSts} />)}
      </div>
    );
  };

  let moreContent = null;
  if (fetchingMore === false) { // show retry button
    moreContent = (
      <div className="my-6 text-center">
        <p className="text-center text-base text-red-600">Something went wrong! Please wait and try again.</p>
        <button onClick={onRetryMoreBtnClick} className="mt-3 rounded-full bg-slate-600 px-4 py-2 text-sm font-medium text-slate-300 hover:brightness-110">Retry</button>
      </div>
    );
  } else if (fetchingMore === true) { // loading
    moreContent = (
      <div className="my-3 flex items-center justify-center">
        <div className="lds-ellipsis">
          <div className="bg-slate-400"></div>
          <div className="bg-slate-400"></div>
          <div className="bg-slate-400"></div>
          <div className="bg-slate-400"></div>
        </div>
      </div>
    );
  } else if (hasMore === true) { // show more button
    moreContent = (
      <div className="my-6 text-center">
        <button onClick={onMoreBtnClick} className="w-full max-w-xs rounded-full border border-slate-500 bg-slate-900 px-4 py-2 text-sm font-medium text-slate-400 hover:border-slate-400 hover:text-slate-300 sm:w-auto">More</button>
      </div>
    );
  }

  return (
    <div className="mx-auto mt-10 max-w-sm">
      {predsWthSts.length === 0 && renderEmpty()}
      {predsWthSts.length > 0 && renderItems()}
      {moreContent}
    </div>
  );
}
