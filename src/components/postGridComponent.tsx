"use client";
import { GetTopAnime } from "@/action";
import { CardProps } from "@/types/types";
import { useQuery } from "@tanstack/react-query";
import AnimeCard from "./AnimeCard";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface PostGridComponentProps {
  type: string;
  title: string;
}

const PostGridComponent = ({
  type,
  title,
}: Readonly<PostGridComponentProps>) => {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["posts", type],
    queryFn: async () => {
      const res = await GetTopAnime({
        limit: 12,
        type: type,
      });
      if (!res.success) {
        throw new Error(res.message || "Failed to fetch posts");
      }
      return res.data as CardProps[];
    },
    staleTime: 1000 * 60 * 5,
  });

  const getUrlPath = (animeType: string): string => {
    switch (animeType) {
      case "movie":
        return "movies";
      case "tv":
        return "tv-series";
      case "special":
        return "special";
      default:
        return animeType;
    }
  };

  const urlPath = getUrlPath(type);

  if (isLoading) {
    return (
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold tracking-tight capitalize">
            {title}
          </h2>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
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
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold tracking-tight capitalize">
            {title}
          </h2>
        </div>
        <div className="flex flex-col items-center justify-center py-12 text-center rounded-lg border border-border/40 bg-card/30">
          <p className="text-muted-foreground">
            {error instanceof Error ? error.message : "Unable to load posts"}
          </p>
        </div>
      </section>
    );
  }

  const product = data
    ? data.filter((item) => item.status !== "Not yet aired")
    : [];

  if (product.length === 0) {
    return null;
  }

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight capitalize">
          {title}
        </h2>
        <Link
          href={`/${urlPath}`}
          className="flex items-center gap-1 text-sm text-muted-foreground hover:text-primary transition-colors group"
        >
          View all
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>

      <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {product.map((anime) => (
          <AnimeCard
            key={anime.mal_id}
            images={anime.images.jpg.large_image_url}
            mal_id={anime.mal_id}
            rating={anime.rating}
            title_english={anime.title_english}
            score={anime.score}
            type={anime.type}
          />
        ))}
      </div>
    </section>
  );
};

export default PostGridComponent;
