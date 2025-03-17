'use client';
import Carousel from '@/components/carousel';
import { useQuery } from '@tanstack/react-query';
import { AnimatePresence, motion } from 'framer-motion';
import { CardProps } from '@/types/types';
import { GetSeasonNow } from '@/action';

export default function Trending() {
  const { data, isLoading } = useQuery({
    queryKey: ['trending'],
    queryFn: async () => {
      const res = await GetSeasonNow({
        limit: 10,
        filter: 'tv',
      });
      if (!res.success) {
        throw new Error('Failed to fetch data');
      }
      return res.data as CardProps[];
    },
    networkMode: 'always',
    staleTime: 1000 * 60 * 60,
    refetchOnWindowFocus: false,
  });

  if (!data || !Array.isArray(data)) return null;
  // Filter out duplicates based on mal_id
  const uniqueData = Array.from(new Map(data.map((item) => [item.mal_id, item])).values());
  return (
    <div>
      <AnimatePresence mode="wait">
        {isLoading ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4 p-4"
          >
            {[...Array(6)].map((_, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="relative aspect-[3/4]"
              >
                <div className="w-full h-full rounded-lg bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-800 dark:to-gray-700 animate-pulse" />
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <Carousel data={uniqueData} title="top airing" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
