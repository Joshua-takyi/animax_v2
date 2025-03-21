'use client';

import { GetAnimeBySearch } from '@/action';
import MoviesCard from '@/components/moviesCard';
import { Wrapper } from '@/components/wrapper';
import { useQuery } from '@tanstack/react-query';
import { AnimatePresence, motion } from 'framer-motion';
import { useSearchParams } from 'next/navigation';
import Head from 'next/head';

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

export default function SearchPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q');

  const { data, isLoading } = useQuery({
    queryKey: ['search', query],
    queryFn: async () => {
      const res = await GetAnimeBySearch({
        query: query || '',
        genre: '',
      });
      return res.data;
    },
  });

  // Generate metadata description based on search results
  const metaDescription =
    data && data.length > 0
      ? `Search results for "${query}". Found ${data.length} anime titles matching your search.`
      : `Search anime titles on Animax. Find your favorite series and movies.`;

  return (
    <>
      <Head>
        <title>{query ? `Search: ${query} | Animax` : 'Search Anime | Animax'}</title>
        <meta name="description" content={metaDescription} />
        <meta
          property="og:title"
          content={query ? `Search: ${query} | Animax` : 'Search Anime | Animax'}
        />
        <meta property="og:description" content={metaDescription} />
        <link
          rel="canonical"
          href={`https://animax-v2.vercel.app//search${
            query ? `?q=${encodeURIComponent(query)}` : ''
          }`}
        />
      </Head>

      {/* Show loading state while data is being fetched */}
      {isLoading && (
        <div className="container mx-auto p-4">
          <div className="flex flex-col items-center justify-center min-h-[40vh]">
            <div className="w-16 h-16 border-4 border-t-primary border-r-transparent border-b-primary border-l-transparent rounded-full animate-spin"></div>
            <p className="mt-4 text-lg font-medium">Searching for &quot;{query}&quot;...</p>
          </div>
        </div>
      )}

      {/* Show no results message */}
      {!isLoading && (!data || data.length === 0) && (
        <div className="flex flex-col p-4">
          <div className="w-full bg-secondary-foreground dark:bg-secondary-background p-6 rounded-md shadow-md">
            <h1 className="text-xl font-bold">No results found for &quot;{query}&quot;</h1>
            <p className="mt-2 text-muted-foreground">Try searching with different keywords</p>
          </div>
        </div>
      )}

      {/* Show search results */}
      {!isLoading && data && data.length > 0 && (
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

          {/* Add structured data for search results */}
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                '@context': 'https://schema.org',
                '@type': 'SearchResultsPage',
                mainEntity: {
                  '@type': 'ItemList',
                  numberOfItems: data.length,
                  itemListElement: data.map((item, index) => ({
                    '@type': 'ListItem',
                    position: index + 1,
                    item: {
                      '@type': 'Movie',
                      name: item.title,
                      image: item.images.jpg.large_image_url,
                      url: `https://animax-v2.vercel.app//profile/${item.mal_id}`,
                    },
                  })),
                },
              }),
            }}
          />
        </div>
      )}
    </>
  );
}
