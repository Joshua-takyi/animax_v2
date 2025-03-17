'use client';
import { GetTopAnime } from '@/action';
// import { Loader } from '@/components/fullLoading';
import ListComponent from '@/components/listComponent';
import { removeDuplicates } from '@/lib/duplicate';
import { CardProps } from '@/types/types';
import { useQuery } from '@tanstack/react-query';

export default function FavMovies() {
  // Fetch favorite movies using useQuery
  const { data } = useQuery({
    queryKey: ['favMovies'],
    queryFn: async () => {
      const res = await GetTopAnime({
        limit: 5,
        filter: 'bypopularity',
        type: 'movie',
      });
      if (!res.success) {
        throw new Error('Failed to fetch data');
      }
      return res.data as CardProps[];
    },
    staleTime: 1000 * 60 * 60,
    refetchOnWindowFocus: false,
  });
  const uniqueData = data ? removeDuplicates(data, 'mal_id') : [];

  return (
    <div className="flex flex-col gap-4">
      <h1 className="md:text-[1.3rem] font-bold capitalize">Favorite Movies</h1>
      <ListComponent data={uniqueData} />
    </div>
  );
}
