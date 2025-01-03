'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSelector, useDispatch } from 'react-redux';
import Image from 'next-image-export-optimizer';
import { ChevronLeftIcon } from '@heroicons/react/24/solid';

import { signIn, signOut } from '@/actions';
import Logo from '@/images/logo.svg';

export function TopBar() {
  const isUserSignedIn = useSelector(state => state.user.isUserSignedIn);
  const pathname = usePathname();
  const dispatch = useDispatch();

  const onSignInBtnClick = () => {
    dispatch(signIn());
  };

  const onSignOutBtnClick = () => {
    dispatch(signOut());
  };

  let leftItem;
  if (pathname === '/') {
    leftItem = null;
  } else if (pathname === '/game-btc') {
    leftItem = (
      <Link className="flex items-center justify-center text-slate-100 hover:text-orange-200 p-1 focus:outline-none group" href="/">
        <div className="flex items-center justify-center rounded-full group-focus-visible:outline group-focus-visible:outline-1">
          <ChevronLeftIcon className="size-9" />
        </div>
      </Link>
    );
  } else {
    leftItem = (
      <Link className="flex items-center justify-center p-0.5 text-slate-100 focus:outline-none group hover:brightness-110" href="/">
        <div className="flex items-center justify-center rounded-full group-focus-visible:outline group-focus-visible:outline-1 p-0.5">
          <Image className="h-8 w-auto" src={Logo} alt="" placeholder="empty" priority={true} />
        </div>
      </Link>
    );
  }
  const leftPane = (
    <div className="relative flex grow basis-0 items-center">
      {leftItem}
    </div>
  );

  const rightPane = (
    <div className="relative flex grow basis-0 justify-end items-center space-x-5">
      {pathname !== '/game-btc' && <Link className="group text-lg font-medium text-slate-100 hover:text-orange-200 px-0.5 py-1.5 focus:outline-none" href="/game-btc">
        <div className="rounded-full px-2 py-0.5 group-focus-visible:outline group-focus-visible:outline-1">Game</div>
      </Link>}
      {(isUserSignedIn && pathname !== '/me') && <Link className="text-lg font-medium text-slate-100 hover:text-orange-200 px-0.5 py-1.5 focus:outline-none group" href="/me">
        <div className="px-2 py-0.5 group-focus-visible:outline group-focus-visible:outline-1 rounded-full">Me</div>
      </Link>}
      {!isUserSignedIn && <button onClick={onSignInBtnClick} className="rounded-full bg-orange-400 px-4 py-1.5 text-sm font-medium text-white hover:brightness-110">
        Connect Wallet
      </button>}
      {isUserSignedIn && <button onClick={onSignOutBtnClick} className="rounded-full border border-slate-400 px-2.5 py-1.5 text-sm font-medium text-slate-100 hover:border-orange-300 hover:text-orange-200">
        Sign Out
      </button>}
    </div>
  );

  const doShowLeftPane = pathname !== '/';
  const doShowRightPane = [true, false].includes(isUserSignedIn);

  return (
    <div className="relative mx-auto w-full max-w-6xl flex-none px-4 sm:px-6 lg:px-8 xl:px-12">
      <nav className="flex h-[3.75rem] items-center justify-between">
        {doShowLeftPane && leftPane}
        {doShowRightPane && rightPane}
      </nav>
    </div>
  );
}
