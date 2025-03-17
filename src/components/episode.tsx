'use client';
import { GetAnimeEpisodesById } from '@/action';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import { useState } from 'react';
import { ChevronDown, Filter } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';

interface EpisodeProp {
  mal_id: number;
  filler: boolean;
}

type EpisodeProps = EpisodeProp[];

export const Episode = () => {
  const [expanded, setExpanded] = useState(false);
  const [showFillerOnly, setShowFillerOnly] = useState(false);
  const params = useParams();
  const id = params.id as string;

  const { data, isLoading } = useQuery({
    queryKey: ['episode', id],
    queryFn: async () => {
      const res = await GetAnimeEpisodesById({
        animeId: id,
      });
      return res.data as EpisodeProps;
    },
  });

  // Handle loading state
  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-medium">Episodes</h2>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-2 animate-pulse">
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className="h-10 bg-muted/50 rounded-md"></div>
          ))}
        </div>
      </div>
    );
  }

  // Handle no data state
  if (!data || !Array.isArray(data) || data.length === 0) {
    return (
      <div className="p-6 text-center border border-dashed rounded-md bg-muted/20">
        <h2 className="text-xl font-medium mb-1">No Episodes Available</h2>
        <p className="text-muted-foreground text-sm">
          Episode information for this anime is not available.
        </p>
      </div>
    );
  }

  // Filter episodes if filter is active
  const fillerEpisodes = data.filter((episode) => episode.filler);
  const hasFillerEpisodes = fillerEpisodes.length > 0;

  // Display episodes based on filter and expansion state
  const initialLimit = 15;
  const displayData = showFillerOnly ? fillerEpisodes : data;
  const displayEpisodes = expanded ? displayData : displayData.slice(0, initialLimit);
  const hasMore = displayData.length > initialLimit;

  return (
    <div className="space-y-4">
      {/* Header with filter options */}
      <div className="flex flex-wrap gap-2 items-center justify-between">
        <h2 className="text-lg font-medium">
          Episodes{' '}
          <Badge variant="outline" className="text-xs ml-1">
            {data.length}
          </Badge>
        </h2>

        {/* Filter controls */}
        {hasFillerEpisodes && (
          <Button
            variant="outline"
            size="sm"
            className={`text-xs px-3 gap-1.5 ${
              showFillerOnly ? 'bg-primary/10 border-primary/20' : ''
            }`}
            onClick={() => setShowFillerOnly(!showFillerOnly)}
          >
            <Filter size={14} />
            {showFillerOnly ? 'Show All' : 'Filler Episodes'}
            {showFillerOnly && (
              <Badge variant="secondary" className="ml-1 text-[10px]">
                {fillerEpisodes.length}
              </Badge>
            )}
          </Button>
        )}
      </div>

      {/* Episodes grid with responsive columns */}
      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-2">
        {displayEpisodes.map((episode) => (
          <EpisodeCard key={episode.mal_id} episode={episode} />
        ))}
      </div>

      {/* Show more/less button */}
      {hasMore && (
        <Button
          variant="outline"
          size="sm"
          className="w-full mt-2 flex items-center justify-center gap-1.5"
          onClick={() => setExpanded(!expanded)}
        >
          <ChevronDown className={`h-4 w-4 transition-transform ${expanded ? 'rotate-180' : ''}`} />
          {expanded ? 'Show Less' : `Show All (${displayData.length})`}
        </Button>
      )}
    </div>
  );
};

const EpisodeCard = ({ episode }: { episode: EpisodeProp }) => {
  return (
    <div
      className={`
        w-full text-center py-2 px-3 rounded-md border ease-in cursor-pointer hover:scale-103 transition-all
        ${
          episode.filler
            ? 'border-amber-300/30 bg-amber-50/30 dark:bg-amber-900/10 hover:bg-amber-100/50 dark:hover:bg-amber-900/20'
            : 'border-border hover:bg-muted/50'
        }
      `}
    >
      <span className="text-sm font-medium">{`Episode ${episode.mal_id}`}</span>
      {episode.filler && (
        <Badge
          variant="outline"
          className="ml-1 text-[10px] border-amber-200 bg-amber-100/30 dark:bg-amber-900/20 text-amber-800 dark:text-amber-300"
        >
          Filler
        </Badge>
      )}
    </div>
  );
};
