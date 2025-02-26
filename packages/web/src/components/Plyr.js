import { PlyrStats } from '@/components/PlyrStats';
import { PlyrPreds } from '@/components/PlyrPreds';

export function Plyr() {

  return (
    <>
      <main className="relative mx-auto max-w-2xl overflow-hidden px-4 py-20 sm:px-6 lg:px-8 xl:px-12">
        <PlyrStats />
        <PlyrPreds />
      </main>
    </>
  );
}
