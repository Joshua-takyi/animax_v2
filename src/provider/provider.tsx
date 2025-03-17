'use client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import React, { useState } from 'react';

export default function QueryProvider({ children }: Readonly<{ children: React.ReactNode }>) {
  // Configure QueryClient with optimized settings for parallel queries
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            // Prevent network waterfalls with optimized fetching
            networkMode: 'always',
            // Avoid retrying failed queries automatically
            retry: 1,
            // Increase stale time to reduce unnecessary refetches
            staleTime: 1000 * 60 * 30, // 30 minutes
            // Disable automatic background refetching
            refetchOnWindowFocus: false,
            refetchOnMount: false,
            refetchOnReconnect: false,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
