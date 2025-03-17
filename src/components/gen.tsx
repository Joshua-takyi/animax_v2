'use client';
import { GetAnimeBySearch } from '@/action';
import MoviesCard from '@/components/moviesCard';
import { Wrapper } from '@/components/wrapper';
import { useQuery } from '@tanstack/react-query';
import { AnimatePresence, motion } from 'framer-motion';
import { GridSkeleton } from './ui/skeleton';
import { ErrorMessage } from './ui/error';

export default function Genres({ genreId }: { genreId: string }) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.2,
        when: 'beforeChildren',
      },
    },
    exit: {
      opacity: 0,
      transition: {
        staggerChildren: 0.05,
        staggerDirection: -1,
        when: 'afterChildren',
      },
    },
  };

  const itemVariants = {
    hidden: {
      opacity: 0,
    },
    visible: {
      opacity: 1,
      transition: {
        type: 'spring',
        damping: 12,
        stiffness: 100,
      },
    },
    exit: {
      opacity: 0,
      y: -20,
      scale: 0.95,
      transition: {
        duration: 0.2,
      },
    },
  };
  const { data, isLoading, error } = useQuery({
    queryKey: ['genres', genreId], // Include genreId in queryKey for proper caching
    queryFn: async () => {
      const res = await GetAnimeBySearch({
        genre: genreId,
        query: '',
      });
      return res.data;
    },
  });

  if (isLoading) {
    return (
      <div className="flex flex-col p-4">
        <GridSkeleton />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col p-4">
        <ErrorMessage message={error instanceof Error ? error.message : undefined} />
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="flex flex-col p-4">
        <div className="w-full bg-secondary-foreground dark:bg-secondary-background p-6 rounded-md shadow-md">
          <h1 className="text-xl font-bold">No results found for &quot;{genreId}&quot</h1>
          <p className="mt-2 text-muted-foreground">Try searching with different keywords</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Wrapper>
        <AnimatePresence mode="wait">
          <motion.div
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 p-4"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            layout
          >
            {data.map((item, index) => (
              <motion.div
                key={`${item.mal_id}-${index}`}
                variants={itemVariants}
                layout
                className="overflow-hidden"
              >
                <MoviesCard
                  images={item.images.jpg.large_image_url}
                  rating={item.rating}
                  mal_id={item.mal_id}
                  title_english={item.title}
                />
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>
      </Wrapper>
    </div>
  );
}
