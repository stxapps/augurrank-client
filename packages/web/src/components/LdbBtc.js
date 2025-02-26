import { TrophyIcon } from '@heroicons/react/24/solid';
import { LdbBtcPlyrs } from '@/components/LdbBtcPlyrs';
import { LdbBtcCta } from '@/components/LdbBtcCta';

export function LdbBtc() {

  return (
    <main className="relative mx-auto max-w-2xl overflow-hidden px-4 py-20 sm:px-6 lg:px-8 xl:px-12">
      <div className="flex flex-col items-center justify-start sm:flex-row sm:justify-center">
        <div className="rounded-full border-2 border-slate-800 p-2">
          <div className="flex size-32 items-center justify-center">
            <TrophyIcon className="size-24 text-yellow-400" />
          </div>
        </div>
        <div className="mt-6 sm:ml-6 sm:mt-0">
          <h1 className="text-center text-5xl font-medium text-white sm:text-left">Leaderboard</h1>
          <p className="mt-3 text-center text-xl text-slate-400 sm:text-left">Top players in the BTC Game</p>
        </div>
      </div>
      <LdbBtcPlyrs />
      <LdbBtcCta />
    </main>
  );
}
