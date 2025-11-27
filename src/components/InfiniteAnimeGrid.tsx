"use client";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useInView } from "react-intersection-observer";
import { useEffect } from "react";
import AnimeCard from "./AnimeCard";
import { CardProps } from "@/types/types";
import { Loader2 } from "lucide-react";

interface InfiniteAnimeGridProps {
  queryKey: string[];
  queryFn: (page: number) => Promise<CardProps[]>;
  title: string;
  emptyMessage?: string;
}

export default function InfiniteAnimeGrid({
  queryKey,
  queryFn,
  title,
  emptyMessage = "No anime found",
}: InfiniteAnimeGridProps) {
  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: false,
  });

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    error,
  } = useInfiniteQuery({
    queryKey,
    queryFn: async ({ pageParam = 1 }) => {
      const result = await queryFn(pageParam);
      return result;
    },
    getNextPageParam: (lastPage, allPages) => {
      return lastPage.length > 0 ? allPages.length + 1 : undefined;
    },
    initialPageParam: 1,
    staleTime: 1000 * 60 * 5,
  });

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  if (isLoading) {
    return (
      <section className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">{title}</h2>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="aspect-[2/3] bg-muted rounded-lg" />
              <div className="mt-3 space-y-2">
                <div className="h-4 bg-muted rounded w-3/4" />
                <div className="h-3 bg-muted rounded w-1/2" />
              </div>
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
          <h2 className="text-2xl font-bold tracking-tight">{title}</h2>
        </div>
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <p className="text-muted-foreground">
            {error instanceof Error ? error.message : "Failed to load anime"}
          </p>
        </div>
      </section>
    );
  }

  const allAnime = data?.pages.flatMap((page) => page) ?? [];

  if (allAnime.length === 0) {
    return (
      <section className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">{title}</h2>
        </div>
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <p className="text-muted-foreground">{emptyMessage}</p>
        </div>
      </section>
    );
  }

  return (
    <section className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">{title}</h2>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        {allAnime.map((anime, index) => (
          <AnimeCard
            key={`${anime.mal_id}-${index}`}
            mal_id={anime.mal_id}
            title_english={anime.title_english}
            title={anime.title || undefined} // Pass title as fallback
            images={anime.images.jpg.large_image_url}
            rating={anime.rating}
            score={anime.score}
            type={anime.type}
            episodes={anime.episodes}
          />
        ))}
      </div>

      {/* Loading indicator */}
      <div ref={ref} className="flex justify-center py-8">
        {isFetchingNextPage && (
          <div className="flex items-center gap-2 text-muted-foreground">
            <Loader2 className="w-5 h-5 animate-spin" />
            <span className="text-sm">Loading more...</span>
          </div>
        )}
      </div>
    </section>
  );
}
