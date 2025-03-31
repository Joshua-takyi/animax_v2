'use client';

import { GetAnime, MovieProps } from '@/action';
import MoviesCard from '@/components/moviesCard';
import { Wrapper } from '@/components/wrapper';
import { AnimatePresence, motion } from 'framer-motion';
import { useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { useInView } from 'react-intersection-observer';

// Animation variants
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

// Loading spinner component
const LoadingSpinner = () => (
  <div className="flex justify-center items-center py-8">
    <div className="w-12 h-12 rounded-full border-4 border-t-4 border-gray-200 border-t-yellow-500 animate-spin" />
  </div>
);

export default function GetMovies() {
  const searchParams = useSearchParams();
  const genres = searchParams.get('genre') ?? '';
  const rating = searchParams.get('rating') ?? '';
  const status = searchParams.get('status') ?? '';
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>('');
  const [movies, setMovies] = useState<MovieProps[]>([]);
  const [initialPage, setInitialPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [key, setKey] = useState(0); // Key for forcing re-render of AnimatePresence

  const { inView, ref } = useInView({
    threshold: 0.1,
    triggerOnce: false,
    delay: 100,
  });

  const fetchMovies = useCallback(
    async (page: number) => {
      try {
        const res = await GetAnime({
          q: '',
          type: 'movie',
          genres,
          rating,
          status,
          page,
          limit: 18,
          order_by: 'popularity',
        });
        if (!res.data || !res.success) {
          setError('Failed to fetch data');
        }
        return res.data;
      } catch (error) {
        setError(error instanceof Error ? error.message : 'Failed to fetch movies');
        return [];
      }
    },
    [genres, rating, status]
  );

  useEffect(() => {
    setInitialPage(1);
    setMovies([]);
    setHasMore(true);
    setError('');
    setKey((prev) => prev + 1); // Force re-render of AnimatePresence when filters change

    const fetchInitialMovies = async () => {
      setIsLoading(true);
      try {
        const initialMovies = await fetchMovies(1);
        setMovies(initialMovies);
        setHasMore(initialMovies.length > 0);
      } catch (error) {
        setError(error instanceof Error ? error.message : 'Failed to fetch movies');
        return [];
      } finally {
        setIsLoading(false);
      }
    };
    fetchInitialMovies();
  }, [genres, rating, status, fetchMovies]);

  useEffect(() => {
    const fetchMoreData = async () => {
      if (!inView || !hasMore || isLoadingMore || isLoading) return;

      setIsLoadingMore(true);
      try {
        const newMovies = await fetchMovies(initialPage + 1);
        if (newMovies.length === 0) {
          setHasMore(false);
        } else {
          setMovies((prevData) => [...prevData, ...newMovies]);
          setInitialPage((prevPage) => prevPage + 1);
        }
      } catch (error) {
        console.error('Error fetching more movies:', error);
      } finally {
        setIsLoadingMore(false);
      }
    };

    // Small timeout to ensure stability on mobile browsers
    const timeoutId = setTimeout(() => {
      if (inView) {
        fetchMoreData();
      }
    }, 100);

    return () => clearTimeout(timeoutId);
  }, [inView, initialPage, isLoadingMore, hasMore, isLoading, fetchMovies]);

  if (isLoading) {
    return (
      <div className="h-[calc(100vh-4rem)] flex justify-center items-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full justify-center items-center flex py-8">
        <div className="p-6 rounded-md bg-gradient-to-r from-black/80 to-transparent">
          <p className="text-lg font-medium">We had an error: {error}</p>
        </div>
      </div>
    );
  }

  if (!movies || !Array.isArray(movies) || movies.length === 0) {
    return (
      <div className="w-full justify-center items-center flex py-8">
        <div className="p-6 rounded-md bg-gradient-to-r from-black/80 to-transparent">
          <p className="text-lg font-medium">No movies found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Wrapper>
        <AnimatePresence mode="wait" key={key}>
          <motion.div
            className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 p-4"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            layout
          >
            {movies.map((item, index) => (
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

        {hasMore && (
          <div className="flex justify-center items-center pb-4" ref={ref}>
            {isLoadingMore && <LoadingSpinner />}
          </div>
        )}
      </Wrapper>
    </div>
  );
}
