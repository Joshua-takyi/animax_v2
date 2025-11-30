"use client";
import { GetAnime } from "@/action";
import { CardProps } from "@/types/types";
import { useQuery } from "@tanstack/react-query";
import AnimeCard from "@/components/AnimeCard";

export default function LatestReleases() {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["latest-releases"],
    queryFn: async () => {
      const res = await GetAnime({
        q: "",
        type: "",
        rating: "",
        status: "airing",
        page: 1,
        limit: 12,
        genres: "",
        order_by: "popularity",
      });

      if (!res.success) {
        throw new Error(res.message || "Failed to fetch latest releases");
      }
      return res.data as CardProps[];
    },
    staleTime: 1000 * 60 * 5,
  });

  if (isLoading) {
    return (
      <section className="space-y-6">
        <div>
          <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
            Fresh feed
          </p>
          <h2 className="text-2xl font-bold tracking-tight">Latest Releases</h2>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="animate-pulse space-y-2">
              <div className="aspect-[2/3] bg-muted rounded-md" />
              <div className="h-4 bg-muted rounded w-3/4" />
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (isError) {
    return (
      <section className="space-y-6">
        <div>
          <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
            Fresh feed
          </p>
          <h2 className="text-2xl font-bold tracking-tight">Latest Releases</h2>
        </div>
        <div className="flex items-center justify-center py-12 text-center">
          <p className="text-sm text-muted-foreground">
            {error instanceof Error
              ? error.message
              : "Unable to load latest feed"}
          </p>
        </div>
      </section>
    );
  }

  if (!data || data.length === 0) {
    return null;
  }

  return (
    <section className="space-y-6">
      <div>
        <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
          Fresh feed
        </p>
        <h2 className="text-2xl font-bold tracking-tight">Latest Releases</h2>
      </div>

      <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {data.map((anime) => (
          <AnimeCard
            key={anime.mal_id}
            mal_id={anime.mal_id}
            title_english={anime.title_english}
            images={anime.images.jpg.large_image_url}
            rating={anime.rating}
            score={anime.score}
            type={anime.type}
          />
        ))}
      </div>
    </section>
  );
}
