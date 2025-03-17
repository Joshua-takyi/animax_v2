'use client';
import { GetTopAnime } from '@/action';
import ListComponent from '@/components/listComponent';
import { removeDuplicates } from '@/lib/duplicate';
import { CardProps } from '@/types/types';
import { useQuery } from '@tanstack/react-query';

export default function Airing() {
  const { data } = useQuery({
    queryKey: ['airing'],
    queryFn: async () => {
      const res = await GetTopAnime({
        limit: 5,
        filter: 'airing',
        type: 'tv',
      });
      // console.log(res.data);
      if (!res.success) {
        throw new Error('Failed to fetch data');
      }
      return res.data as CardProps[];
    },
  });

  const uniqueData = data ? removeDuplicates(data, 'mal_id') : [];
  return (
    <div className="flex flex-col gap-4">
      <h1 className="md:text-[1.3rem] font-bold capitalize"> currently Airing</h1>
      <ListComponent data={uniqueData} />
    </div>
  );
}
