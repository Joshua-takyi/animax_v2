interface ErrorMessageProps {
  title?: string;
  message?: string;
}

export function ErrorMessage({
  title = 'Error Loading Content',
  message = 'An unexpected error occurred. Please try again later.',
}: ErrorMessageProps) {
  return (
    <div className="w-full bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 p-6 rounded-md shadow-md">
      <h1 className="text-xl font-bold text-red-700 dark:text-red-400">{title}</h1>
      <p className="mt-2 text-red-600 dark:text-red-300">{message}</p>
    </div>
  );
}
