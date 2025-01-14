import { MeStats } from '@/components/MeStats';
import { MePreds } from '@/components/MePreds';

export function Me() {

  return (
    <main className="relative mx-auto max-w-2xl overflow-hidden px-4 py-20 sm:px-6 lg:px-8 xl:px-12">
      <MeStats />
      <MePreds />
    </main>
  );
}
