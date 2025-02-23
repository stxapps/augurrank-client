'use client';
import Link from 'next/link';
import Image from 'next-image-export-optimizer';
import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import clsx from 'clsx';

import { fetchLdbBtc } from '@/actions/chunk';
import { getLdbBtcUsrs } from '@/selectors';
import { isFldStr, getAvtThbnl } from '@/utils';

const truncateStxAddr = (stxAddr) => {
  return stxAddr.slice(0, 12) + '......' + stxAddr.slice(-12);
};

const truncateUsername = (username) => {
  if (username.length < 27) return username;
  return username.slice(0, 24) + '...';
};

export function LdbBtcUsrs() {
  const didFetch = useSelector(state => state.ldbBtc.didFetch);
  const usrs = useSelector(state => getLdbBtcUsrs(state));
  const dispatch = useDispatch();

  const onRetryBtnClick = () => {
    dispatch(fetchLdbBtc(true, true));
  };

  useEffect(() => {
    dispatch(fetchLdbBtc());
  }, [dispatch]);

  const renderLdgPane = () => {
    return (
      <div className="mt-10 rounded-xl bg-slate-800/75 py-20 px-4">
        <div className="ball-clip-rotate-blk mx-auto">
          <div />
        </div>
        <p className="mt-3 text-center text-base text-slate-400">Fetching data...</p>
      </div>
    );
  };

  const renderRtPane = () => {
    return (
      <div className="mt-10 rounded-xl bg-slate-800/75 py-20 px-4">
        <p className="text-center text-red-600">Something went wrong! Please wait and try again.</p>
        <button onClick={onRetryBtnClick} className="mx-auto mt-5 block rounded-full bg-slate-600 px-4 py-2 text-sm font-medium text-slate-300 hover:brightness-110">Retry</button>
      </div>
    );
  };

  const renderUsrs = () => {
    return (
      <div className="mx-auto mt-10">
        <div className="-mx-4 overflow-x-auto sm:-mx-6 md:mx-0">
          <div className="inline-block min-w-full align-middle">
            <div className="overflow-hidden md:rounded-xl">
              <table className="min-w-full divide-y divide-slate-700">
                <thead className="bg-slate-800/75">
                  <tr>
                    <th scope="col" className="py-5 pl-5 pr-4 text-center text-sm font-semibold text-slate-100">#</th>
                    <th scope="col" className="px-4 py-5 text-left text-sm font-semibold text-slate-100">Player</th>
                    <th scope="col" className="px-4 py-5 text-right text-sm font-semibold text-slate-100">Wins</th>
                    <th scope="col" className="px-4 py-5 text-right text-sm font-semibold text-slate-100">Loses</th>
                    <th scope="col" className="py-5 pl-4 pr-6 text-right text-sm font-semibold text-slate-100">N/A</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700 bg-slate-800/75">
                  {usrs.map((usr, i) => {
                    const avtThbnl = getAvtThbnl(usr.avtWthObj.obj);

                    return (
                      <tr key={i} className={clsx(usr.isUser && 'bg-slate-800/75')}>
                        <td className="whitespace-nowrap py-4 pl-5 pr-4 text-sm text-slate-300 text-center">{i + 1}</td>
                        <td className="px-4 py-4">
                          <Link className="group flex items-center justify-start space-x-3 w-fit" href={`https://explorer.hiro.so/address/${usr.stxAddr}`} target="_blank" rel="noreferrer">
                            {isFldStr(avtThbnl) && <Image className="shrink-0 grow-0 rounded-full size-10" width={40} height={40} src={avtThbnl} alt="" unoptimized={true} placeholder="empty" />}
                            {isFldStr(usr.username) && <p className="whitespace-nowrap text-base text-slate-300 group-hover:underline">{truncateUsername(usr.username)}</p>}
                            {!isFldStr(usr.username) && <p className="whitespace-nowrap text-sm text-slate-300 group-hover:underline">{truncateStxAddr(usr.stxAddr)}</p>}
                          </Link>
                        </td>
                        <td className="whitespace-nowrap px-4 py-4 text-sm text-slate-300 text-right">{usr.nWins}</td>
                        <td className="whitespace-nowrap px-4 py-4 text-sm text-slate-300 text-right">{usr.nLoses}</td>
                        <td className="whitespace-nowrap py-4 pl-4 pr-6 text-sm text-slate-300 text-right">{usr.nNA}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    );
  };

  let content;
  if (didFetch === null) { // loading
    content = renderLdgPane();
  } else if (didFetch === false) { // show retry button
    content = renderRtPane();
  } else {
    content = renderUsrs();
  }

  return content;
}
