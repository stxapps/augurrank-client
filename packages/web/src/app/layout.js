import { Inter } from 'next/font/google';
import clsx from 'clsx';
import { StarField } from '@/components/StarField';
import { TopBar } from '@/components/TopBar';
import { Footer } from '@/components/Footer';

import './globals.css';
import { Providers } from './providers';

const inter = Inter({ subsets: ['latin'], display: 'swap', variable: '--font-inter' });

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: 'rgb(17, 24, 39)' },
  ],
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={clsx('h-full antialiased', inter.variable)} suppressHydrationWarning>
      <body className="min-h-full bg-slate-900 safe-area">
        <Providers>
          <div className="absolute inset-0 overflow-hidden">
            <div className="relative mx-auto max-w-2xl">
              <StarField className="-left-64 w-[55.0625rem] rotate-12 sm:-left-20" />
            </div>
          </div>
          <TopBar />
          {children}
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
