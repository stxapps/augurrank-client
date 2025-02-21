import { DOMAIN_NAME } from '@/types/const';
import { LdbBtc } from '@/components/LdbBtc';

const title = 'Leaderboard of the BTC Game - AugurRank';
const description = 'Top players in the BTC Game. Predict BTC price for the highest wins and climb the ranks on the leaderboard!';
export const metadata = {
  title,
  description,
  twitter: {
    title,
    description,
    site: '@AugurRank',
    images: [DOMAIN_NAME + '/twitter-card-image-pattern1.png'],
    card: 'summary_large_image',
  },
  openGraph: {
    title,
    description,
    siteName: 'AugurRank',
    url: DOMAIN_NAME,
    type: 'article',
    images: [DOMAIN_NAME + '/twitter-card-image-pattern1.png'],
  },
};

export default function Page() {
  return <LdbBtc />;
}
