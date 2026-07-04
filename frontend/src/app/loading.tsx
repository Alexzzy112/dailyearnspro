export default function Loading() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-secondary-900">
      <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-500 border-t-transparent mb-4"></div>
      <p className="text-sm font-medium text-gray-500 dark:text-gray-400 animate-pulse">Loading Please Wait</p>
    </div>
  );
}
