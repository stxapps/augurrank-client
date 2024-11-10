import { DOMAIN_NAME } from '@/types/const';
import { LandingPre } from '@/components/LandingPre';

const title = 'AugurRank - Your vision on chain';
const description = 'Challenge yourself to envision the future, store your predictions on the chain, and brag about your accuracy forever.';
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
  return <LandingPre />;
}
