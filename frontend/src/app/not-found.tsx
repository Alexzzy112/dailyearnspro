import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-secondary-900">
      <div className="text-center p-8">
        <h1 className="text-6xl font-bold text-primary-500 mb-4">404</h1>
        <p className="text-xl text-gray-500 dark:text-gray-400 mb-6">Page not found</p>
        <Link href="/" className="gradient-primary text-white px-6 py-3 rounded-xl font-medium hover:opacity-90 transition inline-block">
          Go Home
        </Link>
      </div>
    </div>
  );
}
