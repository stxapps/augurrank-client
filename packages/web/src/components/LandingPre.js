import Link from 'next/link';
import Image from 'next-image-export-optimizer';
import { CheckIcon, TrophyIcon, EnvelopeIcon } from '@heroicons/react/24/solid';

import { StarField } from '@/components/StarField';
import { JoinNewsletter } from '@/components/JoinNewsletter';
import Logo from '@/images/logo.svg';
import LogoStxApps from '@/images/logo-stx-apps.svg';

function TwitterIcon(props) {
  return (
    <svg viewBox="0 0 20 20" aria-hidden="true" {...props}>
      <path d="M11.1527 8.92804L16.2525 3H15.044L10.6159 8.14724L7.07919 3H3L8.34821 10.7835L3 17H4.20855L8.88474 11.5643L12.6198 17H16.699L11.1524 8.92804H11.1527ZM9.49748 10.8521L8.95559 10.077L4.644 3.90978H6.50026L9.97976 8.88696L10.5216 9.66202L15.0446 16.1316H13.1883L9.49748 10.8524V10.8521Z" />
    </svg>
  );
}

function ThreadsIcon(props) {
  return (
    <svg viewBox="0 0 192 192" aria-hidden="true" {...props}>
      <path d="M141.537 88.9883C140.71 88.5919 139.87 88.2104 139.019 87.8451C137.537 60.5382 122.616 44.905 97.5619 44.745C97.4484 44.7443 97.3355 44.7443 97.222 44.7443C82.2364 44.7443 69.7731 51.1409 62.102 62.7807L75.881 72.2328C81.6116 63.5383 90.6052 61.6848 97.2286 61.6848C97.3051 61.6848 97.3819 61.6848 97.4576 61.6855C105.707 61.7381 111.932 64.1366 115.961 68.814C118.893 72.2193 120.854 76.925 121.825 82.8638C114.511 81.6207 106.601 81.2385 98.145 81.7233C74.3247 83.0954 59.0111 96.9879 60.0396 116.292C60.5615 126.084 65.4397 134.508 73.775 140.011C80.8224 144.663 89.899 146.938 99.3323 146.423C111.79 145.74 121.563 140.987 128.381 132.296C133.559 125.696 136.834 117.143 138.28 106.366C144.217 109.949 148.617 114.664 151.047 120.332C155.179 129.967 155.42 145.8 142.501 158.708C131.182 170.016 117.576 174.908 97.0135 175.059C74.2042 174.89 56.9538 167.575 45.7381 153.317C35.2355 139.966 29.8077 120.682 29.6052 96C29.8077 71.3178 35.2355 52.0336 45.7381 38.6827C56.9538 24.4249 74.2039 17.11 97.0132 16.9405C119.988 17.1113 137.539 24.4614 149.184 38.788C154.894 45.8136 159.199 54.6488 162.037 64.9503L178.184 60.6422C174.744 47.9622 169.331 37.0357 161.965 27.974C147.036 9.60668 125.202 0.195148 97.0695 0H96.9569C68.8816 0.19447 47.2921 9.6418 32.7883 28.0793C19.8819 44.4864 13.2244 67.3157 13.0007 95.9325L13 96L13.0007 96.0675C13.2244 124.684 19.8819 147.514 32.7883 163.921C47.2921 182.358 68.8816 191.806 96.9569 192H97.0695C122.03 191.827 139.624 185.292 154.118 170.811C173.081 151.866 172.51 128.119 166.26 113.541C161.776 103.087 153.227 94.5962 141.537 88.9883ZM98.4405 129.507C88.0005 130.095 77.1544 125.409 76.6196 115.372C76.2232 107.93 81.9158 99.626 99.0812 98.6368C101.047 98.5234 102.976 98.468 104.871 98.468C111.106 98.468 116.939 99.0737 122.242 100.233C120.264 124.935 108.662 128.946 98.4405 129.507Z" />
    </svg>
  );
}

function GithubIcon(props) {
  return (
    <svg viewBox="0 0 20 20" aria-hidden="true" {...props}>
      <path fillRule="evenodd" clipRule="evenodd" d="M10 1.667c-4.605 0-8.334 3.823-8.334 8.544 0 3.78 2.385 6.974 5.698 8.106.417.075.573-.182.573-.406 0-.203-.011-.875-.011-1.592-2.093.397-2.635-.522-2.802-1.002-.094-.246-.5-1.005-.854-1.207-.291-.16-.708-.556-.01-.567.656-.01 1.124.62 1.281.876.75 1.292 1.948.93 2.427.705.073-.555.291-.93.531-1.143-1.854-.213-3.791-.95-3.791-4.218 0-.929.322-1.698.854-2.296-.083-.214-.375-1.09.083-2.265 0 0 .698-.224 2.292.876a7.576 7.576 0 0 1 2.083-.288c.709 0 1.417.096 2.084.288 1.593-1.11 2.291-.875 2.291-.875.459 1.174.167 2.05.084 2.263.53.599.854 1.357.854 2.297 0 3.278-1.948 4.005-3.802 4.219.302.266.563.78.563 1.58 0 1.143-.011 2.061-.011 2.35 0 .224.156.491.573.405a8.365 8.365 0 0 0 4.11-3.116 8.707 8.707 0 0 0 1.567-4.99c0-4.721-3.73-8.545-8.334-8.545Z" />
    </svg>
  );
}

function MiddleOne() {
  return (
    <div className="px-7 py-10">
      <p className="text-base text-gray-300">Challenge yourself to envision the future, keep score on the chain, and brag about it forever.</p>
      <ul className="mt-5 space-y-2.5">
        <li className="flex">
          <CheckIcon className="size-5 text-green-500" />
          <p className="ml-2.5 text-base text-gray-300">Permanent</p>
        </li>
        <li className="flex">
          <CheckIcon className="size-5 text-green-500" />
          <p className="ml-2.5 text-base text-gray-300">Verifiable</p>
        </li>
        <li className="flex">
          <CheckIcon className="size-5 text-green-500" />
          <p className="ml-2.5 text-base text-gray-300">Community driven</p>
        </li>
        <li className="flex">
          <CheckIcon className="size-5 text-green-500" />
          <p className="ml-2.5 text-base text-gray-300">Fun</p>
        </li>
      </ul>
      <p className="mt-7 text-base text-gray-300">Concrete evidence that you were right! Nothing in the world comes close!</p>
      <p className="mt-7 text-base text-gray-300">Powered by Stacks - the Bitcoin L2</p>
      <ul className="mt-5 space-y-2.5">
        <li className="flex">
          <CheckIcon className="size-5 text-green-500" />
          <p className="ml-2.5 text-base text-gray-300">Secure</p>
        </li>
        <li className="flex">
          <CheckIcon className="size-5 text-green-500" />
          <p className="ml-2.5 text-base text-gray-300">Decentralized</p>
        </li>
        <li className="flex">
          <CheckIcon className="size-5 text-green-500" />
          <p className="ml-2.5 text-base text-gray-300">Scalable</p>
        </li>
        <li className="flex">
          <CheckIcon className="size-5 text-green-500" />
          <p className="ml-2.5 text-base text-gray-300">Affordable</p>
        </li>
      </ul>
    </div>
  );
}

function MiddleTwo() {
  return <JoinNewsletter />;
}

function MiddleThree() {
  return (
    <div className="px-7 py-10">
      <h2 className="text-xl font-medium text-gray-100">How to visionary?</h2>
      <ol className="mt-5 list-inside list-decimal space-y-2.5">
        <li className="text-base text-gray-400">Predict the future</li>
        <li className="text-base text-gray-400">Store it on the chain</li>
        <li className="text-base text-gray-400">
          <span className="relative">
            Rank to the top!
            <TrophyIcon className="absolute -top-0.5 left-full ml-1 size-6 text-yellow-400" />
          </span>
        </li>
      </ol>
    </div>
  );
}

function MiddleFour() {
  return (
    <div className="px-7 py-10">
      <h2 className="text-center text-xl font-medium text-gray-100">A new prediction game</h2>
      <p className="mt-2.5 text-center text-sm text-gray-400">Powered by Stacks</p>
    </div>
  );
}

export function LandingPre() {
  return (
    <div className="relative mx-auto max-w-2xl overflow-hidden">
      <StarField className="-left-64 w-[55.0625rem] rotate-12 sm:-left-20" />
      <main className="relative p-24 px-6 py-20">
        <div className="flex flex-col items-center justify-start sm:flex-row sm:justify-center">
          <div className="rounded-full border-2 border-gray-800 p-2">
            <Image className="size-32" src={Logo} alt="" />
          </div>
          <div className="mt-6 sm:ml-6 sm:mt-0">
            <h1 className="text-center text-5xl font-medium text-white sm:text-left">AugurRank</h1>
            <p className="mt-3 text-center text-xl text-gray-400 sm:text-left">Your visionary on chain</p>
          </div>
        </div>
        <div className="mt-10 rounded-xl bg-gray-800/75">
          <div className="sm:hidden">
            <MiddleOne />
            <div className="h-px bg-gray-700" />
            <MiddleTwo />
            <div className="h-px bg-gray-700" />
            <MiddleThree />
            <div className="h-px bg-gray-700" />
            <MiddleFour />
          </div>
          <div className="hidden sm:flex sm:items-stretch sm:justify-stretch">
            <div className="flex-1">
              <MiddleOne />
            </div>
            <div className="w-px bg-gray-700" />
            <div className="flex-1">
              <MiddleTwo />
              <div className="h-px bg-gray-700" />
              <MiddleThree />
              <div className="h-px bg-gray-700" />
              <MiddleFour />
            </div>
          </div>
        </div>
        <div className="mt-10 flex justify-center space-x-4">
          <Link className="group flex size-10 items-center justify-center rounded-full bg-gray-800" href="https://x.com/AugurRank" target="_blank" rel="noreferrer">
            <TwitterIcon className="size-5 fill-blue-400 group-hover:fill-blue-300" />
          </Link>
          <Link className="group flex size-10 items-center justify-center rounded-full bg-gray-800" href="https://www.threads.net/@augurrank" target="_blank" rel="noreferrer">
            <ThreadsIcon className="size-[1.125rem] fill-pink-600 group-hover:fill-pink-500" />
          </Link>
          <Link className="group flex size-10 items-center justify-center rounded-full bg-gray-800" href="https://github.com/stxapps/augurrank-smart-contracts" target="_blank" rel="noreferrer">
            <GithubIcon className="size-5 fill-gray-400 group-hover:fill-gray-300" />
          </Link>
          <Link className="group flex size-10 items-center justify-center rounded-full bg-gray-800" href="&#109;&#097;&#105;&#108;&#116;&#111;:&#115;&#117;&#112;&#112;&#111;&#114;&#116;&#064;&#097;&#117;&#103;&#117;&#114;&#114;&#097;&#110;&#107;&#046;&#099;&#111;&#109;">
            <EnvelopeIcon className="size-5 text-green-500 group-hover:fill-green-400" />
          </Link>
        </div>
        <div className="mt-20 flex flex-col items-center">
          <p className="text-sm text-gray-500">Brought to you by</p>
          <Link className="group mt-2.5 flex items-center justify-start" href="https://www.stxapps.com" target="_blank" rel="noreferrer">
            <Image className="h-8 w-auto" src={LogoStxApps} alt="STX Apps" placeholder="empty" />
            <div className="ml-2 text-2xl font-extrabold text-gray-100 group-hover:text-white">STX Apps</div>
          </Link>
        </div>
      </main>
    </div>
  );
}
