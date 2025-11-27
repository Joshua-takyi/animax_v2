"use client";
import { GetSeasonNow } from "@/action";
import AnimeCard from "@/components/AnimeCard";
import { GridSkeleton } from "@/components/ui/skeleton";
import { ErrorMessage } from "@/components/ui/error";
import { CardProps } from "@/types/types";
import { useQuery } from "@tanstack/react-query";

export default function SeasonSpotlight() {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["season-spotlight"],
    queryFn: async () => {
      const res = await GetSeasonNow({
        limit: 10,
        filter: "tv",
      });
      if (!res.success) {
        throw new Error(res.message || "Unable to fetch seasonal titles");
      }
      return res.data as CardProps[];
    },
  });

  const uniqueData = data
    ? Array.from(new Map(data.map((item) => [item.mal_id, item])).values())
    : [];

  if (isLoading) {
    return (
      <section id="season-spotlight" className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground uppercase tracking-wide">
              Season spotlight
            </p>
            <h2 className="text-2xl font-bold">Now Airing Highlights</h2>
          </div>
        </div>
        <GridSkeleton />
      </section>
    );
  }

  if (isError) {
    return (
      <ErrorMessage
        title="Season Spotlight"
        message={
          error instanceof Error ? error.message : "Unable to load season data"
        }
      />
    );
  }

  if (!uniqueData.length) {
    return null;
  }

  return (
    <section id="season-spotlight" className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-muted-foreground uppercase tracking-wide">
            Season spotlight
          </p>
          <h2 className="text-2xl font-bold">Now Airing Highlights</h2>
        </div>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-4">
        {uniqueData.map((anime) => (
          <AnimeCard
            key={anime.mal_id}
            images={anime.images.jpg.large_image_url}
            mal_id={anime.mal_id}
            rating={anime.rating}
            title_english={anime.title_english || anime.title || null}
            score={anime.score}
            type={anime.type}
          />
        ))}
      </div>
    </section>
  );
}
