'use client';
export default function ErrorPage({ error, reset }: { error: Error; reset: () => void }) {
  void error;
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-secondary-900">
      <div className="text-center p-8">
        <h1 className="text-4xl font-bold text-red-500 mb-4">Oops!</h1>
        <p className="text-gray-500 dark:text-gray-400 mb-6">Something went wrong. Please try again.</p>
        <button onClick={reset} className="gradient-primary text-white px-6 py-3 rounded-xl font-medium hover:opacity-90 transition">
          Try Again
        </button>
      </div>
    </div>
  );
}
