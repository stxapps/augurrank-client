import Link from 'next/link';
import Image from 'next-image-export-optimizer';
import {
  CheckIcon, TrophyIcon, EnvelopeIcon, NewspaperIcon,
} from '@heroicons/react/24/solid';

import { JoinNewsletter } from '@/components/JoinNewsletter';
import { TwitterIcon, ThreadsIcon, BSkyIcon, GithubIcon } from '@/components/Icons';
import Logo from '@/images/logo.svg';

function MiddleOne() {
  return (
    <div className="px-7 pt-10 pb-8">
      <h2 className="text-center text-xl font-medium text-slate-100">A BTC prediction game</h2>
      <p className="mt-2.5 text-center text-sm text-slate-400">Powered by Stacks</p>
      <div className="mt-4 flex items-center justify-center">
        <Link className="rounded-full bg-orange-400 px-4 py-1.5 text-sm font-semibold text-white hover:brightness-110" href="/game-btc" prefetch={true}>Play Now</Link>
      </div>
    </div>
  );
}

function MiddleTwo() {
  return (
    <div className="px-7 py-8">
      <h2 className="text-xl font-medium text-slate-100">How to visionary?</h2>
      <ol className="mt-5 list-inside list-decimal space-y-2.5">
        <li className="text-base text-slate-400">Predict the future</li>
        <li className="text-base text-slate-400">Store it on the chain</li>
        <li className="text-base text-slate-400">
          <span className="relative">
            Rank to the top!
            <TrophyIcon className="absolute -top-0.5 left-full ml-1 size-6 text-yellow-400" />
          </span>
        </li>
      </ol>
    </div>
  );
}

function MiddleThree() {
  return <JoinNewsletter />;
}

function MiddleFour() {
  return (
    <div className="px-7 py-10">
      <p className="text-base text-slate-300">Challenge yourself to envision the future, store your predictions on the chain, and brag about your accuracy forever.</p>
      <ul className="mt-5 space-y-2.5">
        <li className="flex">
          <CheckIcon className="size-5 text-green-500" />
          <p className="ml-2.5 text-base text-slate-300">Permanent</p>
        </li>
        <li className="flex">
          <CheckIcon className="size-5 text-green-500" />
          <p className="ml-2.5 text-base text-slate-300">Verifiable</p>
        </li>
        <li className="flex">
          <CheckIcon className="size-5 text-green-500" />
          <p className="ml-2.5 text-base text-slate-300">Community driven</p>
        </li>
        <li className="flex">
          <CheckIcon className="size-5 text-green-500" />
          <p className="ml-2.5 text-base text-slate-300">Fun</p>
        </li>
      </ul>
      <p className="mt-7 text-base text-slate-300">Concrete proof that you were right forever!</p>
      <p className="mt-7 text-base text-slate-300">Powered by Stacks - the Bitcoin L2</p>
      <ul className="mt-5 space-y-2.5">
        <li className="flex">
          <CheckIcon className="size-5 text-green-500" />
          <p className="ml-2.5 text-base text-slate-300">Secure</p>
        </li>
        <li className="flex">
          <CheckIcon className="size-5 text-green-500" />
          <p className="ml-2.5 text-base text-slate-300">Decentralized</p>
        </li>
        <li className="flex">
          <CheckIcon className="size-5 text-green-500" />
          <p className="ml-2.5 text-base text-slate-300">Scalable</p>
        </li>
        <li className="flex">
          <CheckIcon className="size-5 text-green-500" />
          <p className="ml-2.5 text-base text-slate-300">Affordable</p>
        </li>
      </ul>
    </div>
  );
}

export function LandingPre() {
  return (
    <main className="relative mx-auto max-w-2xl overflow-hidden px-4 sm:px-6 lg:px-8 xl:px-12 py-20">
      <div className="flex flex-col items-center justify-start sm:flex-row sm:justify-center">
        <div className="rounded-full border-2 border-slate-800 p-2">
          <Image className="size-32" src={Logo} alt="" />
        </div>
        <div className="mt-6 sm:ml-6 sm:mt-0">
          <h1 className="text-center text-5xl font-medium text-white sm:text-left">AugurRank</h1>
          <p className="mt-3 text-center text-xl text-slate-400 sm:text-left">Your vision on chain</p>
        </div>
      </div>
      <div className="mt-10 rounded-xl bg-slate-800/75">
        <div className="sm:hidden">
          <MiddleOne />
          <div className="h-px bg-slate-700" />
          <MiddleTwo />
          <div className="h-px bg-slate-700" />
          <MiddleThree />
          <div className="h-px bg-slate-700" />
          <MiddleFour />
        </div>
        <div className="hidden sm:flex sm:items-stretch sm:justify-stretch">
          <div className="flex-1">
            <MiddleOne />
            <div className="h-px bg-slate-700" />
            <MiddleTwo />
            <div className="h-px bg-slate-700" />
            <MiddleThree />
          </div>
          <div className="w-px bg-slate-700" />
          <div className="flex-1">
            <MiddleFour />
          </div>
        </div>
      </div>
      <div className="mt-10 flex justify-center space-x-4">
        <Link className="group flex size-10 items-center justify-center rounded-full bg-slate-800" href="https://x.com/AugurRank" target="_blank" rel="noreferrer">
          <TwitterIcon className="size-5 fill-violet-600 group-hover:fill-violet-500" />
        </Link>
        <Link className="group flex size-10 items-center justify-center rounded-full bg-slate-800" href="https://www.threads.net/@augurrank" target="_blank" rel="noreferrer">
          <ThreadsIcon className="size-[1.125rem] fill-pink-600 group-hover:fill-pink-500" />
        </Link>
        <Link className="group flex size-10 items-center justify-center rounded-full bg-slate-800" href="https://bsky.app/profile/augurrank.com" target="_blank" rel="noreferrer">
          <BSkyIcon className="size-[1.125rem] fill-blue-400 group-hover:fill-blue-300" />
        </Link>
        <Link className="group flex size-10 items-center justify-center rounded-full bg-slate-800" href="https://github.com/stxapps/augurrank-smart-contracts" target="_blank" rel="noreferrer">
          <GithubIcon className="size-5 fill-slate-400 group-hover:fill-slate-300" />
        </Link>
        <Link className="group flex size-10 items-center justify-center rounded-full bg-slate-800" href="&#109;&#097;&#105;&#108;&#116;&#111;:&#115;&#117;&#112;&#112;&#111;&#114;&#116;&#064;&#097;&#117;&#103;&#117;&#114;&#114;&#097;&#110;&#107;&#046;&#099;&#111;&#109;">
          <EnvelopeIcon className="size-5 text-green-500 group-hover:fill-green-400" />
        </Link>
        <Link className="group flex size-10 items-center justify-center rounded-full bg-slate-800" href="https://blog.augurrank.com" target="_blank" rel="noreferrer">
          <NewspaperIcon className="size-5 fill-orange-400 group-hover:fill-orange-300" />
        </Link>
      </div>
    </main>
  );
}
