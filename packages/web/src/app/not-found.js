import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="mx-auto h-screen flex flex-col items-center justify-center max-w-2xl text-center px-4 py-16 lg:pl-8 lg:pr-0 xl:px-16">
      <p className="text-sm font-medium text-white">404</p>
      <h1 className="mt-3 text-3xl tracking-tight text-white">Page not found</h1>
      <p className="mt-2.5 text-sm text-gray-400">Sorry, we couldn't find the page you're looking for.</p>
      <Link href="/" className="mt-8 text-sm font-medium text-white">Go back home</Link>
    </div>
  );
}
