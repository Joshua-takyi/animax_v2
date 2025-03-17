'use client';
import { TelegramLinks } from '@/action';
import { useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'next/navigation';
import darkmode from '../../public/images/darkmode.png';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useCallback, useMemo } from 'react';

interface TelegramLinkProps {
  title: string;
  link: string;
  _id: string;
  snippet: string;
}

export default function TelegramLinksComponent() {
  const searchParams = useSearchParams();
  const q = searchParams.get('q') as string;

  const { data, isLoading, error, isFetching } = useQuery({
    queryKey: ['telegramLinks', q],
    queryFn: async () => {
      const res = await TelegramLinks({
        query: q,
      });
      return res.data as TelegramLinkProps[];
    },
    enabled: !!q,
    staleTime: 1000 * 60 * 5, // Cache results for 5 minutes
    refetchOnWindowFocus: false,
  });

  // Memoize the filtered data to avoid unnecessary re-renders
  const telegramLinks = useMemo(() => {
    if (!data || !Array.isArray(data)) return [];
    return data;
  }, [data]);

  // Extract this render logic to keep the main component clean
  const renderLinkCard = useCallback(
    (result: TelegramLinkProps, index: number) => (
      <motion.div
        key={result._id || `telegram-link-${index}-${result.link}`}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: Math.min(index * 0.1, 0.5) }} // Cap delay for better UX on many items
        className="group"
      >
        <Link
          href={result.link}
          className="group flex flex-col h-full bg-white dark:bg-gray-800 backdrop-blur-sm rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700/90 transition-all duration-300 shadow-sm hover:shadow-md overflow-hidden border border-gray-200 dark:border-gray-700"
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Open Telegram channel: ${result.title}`}
        >
          <div className="flex items-center gap-4 p-4 border-b border-gray-100 dark:border-gray-700">
            <div className="relative h-14 w-14 flex-shrink-0 overflow-hidden rounded-lg group-hover:scale-105 transition-transform duration-300">
              <Image
                src={darkmode}
                alt=""
                fill
                className="object-cover"
                priority={index < 6}
                sizes="(max-width: 768px) 56px, 56px"
              />
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="font-medium text-gray-900 dark:text-white line-clamp-2">
                {result.title}
              </h3>
            </div>
          </div>

          {window.innerWidth >= 790 && result.snippet && (
            <div className="p-4 pt-3 flex-1">
              <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-3">
                {result.snippet}
              </p>
            </div>
          )}

          <div className="mt-auto p-4 pt-2 flex items-center justify-between">
            <span className="inline-flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-3.5 w-3.5"
                fill="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.161c-.18.807-.814 3.677-1.445 6.774-.206.873-.738 1.101-1.175 1.101-.501 0-1.116-.19-1.734-.608-1.445-.96-2.188-1.403-3.64-2.361-.42-.17-.729-.245-.97-.05-2.056 1.571-2.527.544-2.527.544l.54-1.642s4.083-3.777 4.22-4.167c.136-.39-.202-.536-.505-.334-2.103 1.496-5.863 3.783-5.863 3.783s-.594.19-1.656-.19-2.43-.95-2.43-.95-.96-.63.672-1.261c5.132-2.42 10.708-4.667 10.708-4.667s.9-.284 1.485-.077c.315.114.51.358.531.674.021.316-.031.631-.161 1.036z" />
              </svg>
              Telegram
            </span>
            <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
              Open
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-3.5 w-3.5 transform group-hover:translate-x-1 transition-transform duration-300"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M14 5l7 7m0 0l-7 7m7-7H3"
                />
              </svg>
            </span>
          </div>
        </Link>
      </motion.div>
    ),
    []
  );

  if (isLoading) {
    return (
      <section className="py-10">
        <div className="flex justify-between items-center border-b border-border/30 pb-2 mb-6">
          <div className="flex items-center space-x-1.5 sm:space-x-2">
            <div className="h-6 sm:h-8 w-0.5 sm:w-1 bg-gradient-to-b from-primary to-primary/20 rounded-full" />
            <h2 className="text-base sm:text-lg font-medium bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
              Telegram Channels
            </h2>
          </div>
        </div>
        <div className="flex flex-col gap-4 justify-center items-center min-h-[300px] w-full">
          <div className="w-16 h-16 border-t-4 border-blue-500 border-solid rounded-full animate-spin"></div>
          <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
            Searching Telegram channels...
          </p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="lg:pt-10 pt-5">
        <div className="flex justify-between items-center border-b border-border/30 pb-2 mb-6">
          <div className="flex items-center space-x-1.5 sm:space-x-2">
            <div className="h-6 sm:h-8 w-0.5 sm:w-1 bg-gradient-to-b from-primary to-primary/20 rounded-full" />
            <h2 className="text-base sm:text-lg font-medium bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
              Telegram Channels
            </h2>
          </div>
        </div>
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mt-4">
          <div className="flex items-center">
            <svg
              className="w-5 h-5 text-red-500 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              ></path>
            </svg>
            <p className="text-red-600 dark:text-red-400">
              {error instanceof Error ? error.message : 'Failed to load Telegram channels.'}
            </p>
          </div>
        </div>
      </section>
    );
  }

  if (!telegramLinks.length) {
    return (
      <section className="py-10">
        <div className="flex justify-between items-center border-b border-border/30 pb-2 mb-6">
          <div className="flex items-center space-x-1.5 sm:space-x-2">
            <div className="h-6 sm:h-8 w-0.5 sm:w-1 bg-gradient-to-b from-primary to-primary/20 rounded-full" />
            <h2 className="text-base sm:text-lg font-medium bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
              Telegram Channels
            </h2>
          </div>
        </div>
        <div className="flex flex-col justify-center items-center min-h-[200px] p-6 text-center">
          <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            No Telegram channels found
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Try a different search query or check back later
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-10">
      <div className="flex justify-between items-center border-b border-border/30 pb-2 mb-6">
        <div className="flex items-center space-x-1.5 sm:space-x-2">
          <div className="h-6 sm:h-8 w-0.5 sm:w-1 bg-gradient-to-b from-primary to-primary/20 rounded-full" />
          <h2 className="text-base sm:text-lg font-medium bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
            Telegram Channels
          </h2>
        </div>
        {isFetching && (
          <div className="flex items-center">
            <div className="w-4 h-4 border-t-2 border-blue-500 border-solid rounded-full animate-spin mr-2"></div>
            <span className="text-xs text-gray-500 dark:text-gray-400">Refreshing...</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
        {telegramLinks.map(renderLinkCard)}
      </div>
    </section>
  );
}
