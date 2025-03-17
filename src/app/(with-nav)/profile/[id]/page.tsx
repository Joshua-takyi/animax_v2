'use client';
import { GetAnimeById } from '@/action';
import { CharacterComponent } from '@/components/character';
import { Episode } from '@/components/episode';
// import EpisodesComponent from '@/components/episode';
import MovieHeader from '@/components/header';
import SummaryComponent from '@/components/summary';
import TelegramLinksComponent from '@/components/telegramLinksComponent';
import VideoSection from '@/components/videoSection';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'next/navigation';

interface AnimeData {
  mal_id: string;
  trailer: {
    youtube_id: string;
  };
  genres: {
    mal_id: number;
    name: string;
  }[];
  titles: {
    type: string;
    title: string;
  }[];
  images: {
    jpg: {
      large_image_url: string;
    };
  };
  status: string;
  episodes: number;
  type: string;
  studios: [
    {
      name: string;
    }
  ];
  score: number;
  duration: string;
  aired: {
    string: string;
  };
  popularity: number;
  englishTitle: string;
  japaneseTitle: string;
  synopsis: string;
  rating: string;
  scored_by: number;
  season: string;
}

export default function ProfilePage() {
  const params = useParams();
  const id = params.id as string;

  const { data, error } = useQuery<AnimeData>({
    queryKey: ['AnimeById', id],
    queryFn: async () => {
      const res = await GetAnimeById({
        id: id,
      });
      if (!res.success || !res.data) {
        throw new Error('No data found');
      }
      // Ensure the response data is of the expected type before casting
      if (Array.isArray(res.data) && res.data.length === 0) {
        throw new Error('No data found');
      }
      return res.data as unknown as AnimeData;
    },
    networkMode: 'always',
    staleTime: 1000 * 60 * 60,
    refetchOnWindowFocus: false,
  });

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center h-screen">
        <h1 className="text-xl md:text-2xl text-center px-4">
          Error loading anime data: {error.message}
        </h1>
      </div>
    );
  }

  if (!data) {
    return (
      <div>
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="p-4 rounded-lg bg-muted/50 animate-pulse">
            <div className="flex items-start space-x-4">
              <div className="w-14 h-14 rounded-lg bg-muted"></div>
              <div className="flex-1 space-y-2">
                <div className="h-3 bg-muted rounded w-3/4"></div>
                <div className="h-2 bg-muted rounded w-1/2"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }
  const japaneseTitle = data.titles.find((title) => title.type === 'Japanese')?.title ?? '';
  const englishTitle = data.titles.find((title) => title.type === 'English')?.title ?? '';

  return (
    <div className="min-h-screen pt-4 xl:pt-10 flex flex-col gap-5">
      <MovieHeader
        duration={data.aired.string}
        rating={data.rating}
        originalTitle={japaneseTitle}
        title={englishTitle}
        year={data.aired.string}
      />

      {/* Video section wrapped in Suspense for isolated loading */}

      {data.trailer?.youtube_id && <VideoSection videoUrl={data.trailer.youtube_id} />}

      <SummaryComponent
        genres={data.genres.map((genre) => genre.name)}
        image={data.images.jpg.large_image_url}
        status={data.status}
        episodes={data.episodes}
        type={data.type}
        studios={data.studios.map((studio) => studio.name)}
        released={data.aired.string}
        rating={data.rating}
        synopsis={data.synopsis}
      />
      <Episode />
      {/* <EpisodesComponent id={data.mal_id} /> */}
      <CharacterComponent />

      <TelegramLinksComponent />
    </div>
  );
}
