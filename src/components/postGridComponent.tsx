'use client';
import { GetTopAnime } from '@/action';
import { CardProps } from '@/types/types';
import { useQuery } from '@tanstack/react-query';
import MoviesCard from './moviesCard';
import Link from 'next/link';

interface PostGridComponentProps {
  type: string;
  title: string;
}

const PostGridComponent = ({ type, title }: Readonly<PostGridComponentProps>) => {
  const { data } = useQuery({
    queryKey: ['posts', type],
    queryFn: async () => {
      const res = await GetTopAnime({
        limit: 10,
        type: type,
      });
      return res.data as CardProps[];
    },
  });
  const product = data || [];

  // Map anime type to appropriate URL path
  const getUrlPath = (animeType: string): string => {
    switch (animeType) {
      case 'movie':
        return 'movies';
      case 'tv':
        return 'tv-series';
      case 'special':
        return 'special';
      default:
        return animeType;
    }
  };

  // Get the correct URL path based on the anime type
  const urlPath = getUrlPath(type);

  return (
    <div className="w-full">
      {/* Only show title and "view all" link when not loading */}
      <div className="flex justify-between items-center py-2 w-full">
        <h1 className="text-base md:text-[1.3rem] font-bold capitalize">{title}</h1>
        <Link href={`/${urlPath}`} className=" text-sm transition-all duration-300 p-2">
          view all
        </Link>
      </div>

      <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 md:gap-3">
        {
          // Render actual data
          product.map((anime) => (
            <MoviesCard
              images={anime.images.jpg.large_image_url}
              mal_id={anime.mal_id}
              rating={anime.rating}
              title_english={anime.title_english}
              key={anime.mal_id}
            />
          ))
        }
      </div>
    </div>
  );
};

export default PostGridComponent;
