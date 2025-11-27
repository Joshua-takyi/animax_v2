"use client";
import { GetAnimeById, GetAnimeRecommendations } from "@/action";
import AnimeCard from "@/components/AnimeCard";
import { Button } from "@/components/ui/button";
import { ErrorMessage } from "@/components/ui/error";
import { GridSkeleton } from "@/components/ui/skeleton";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";

interface AnimeInfo {
  mal_id: number;
  title?: string;
  title_english?: string;
  title_japanese?: string;
  synopsis?: string;
  images: {
    jpg: {
      large_image_url: string;
    };
  };
  type?: string;
  rating?: string;
}

interface RecommendationEntry {
  entry: {
    mal_id: number;
    title: string;
    images: {
      jpg: {
        large_image_url: string;
      };
    };
    type?: string;
  };
  votes: number;
}

export default function RecommendationsPage() {
  const params = useParams();
  const id = params.id as string;

  const {
    data: anime,
    isLoading: infoLoading,
    isError: infoError,
  } = useQuery({
    queryKey: ["anime-info", id],
    queryFn: async () => {
      const res = await GetAnimeById({ id });
      if (!res.success || !res.data) {
        throw new Error(res.message || "Failed to load anime");
      }
      const payload = Array.isArray(res.data) ? res.data[0] : res.data;
      if (!payload) {
        throw new Error("Anime not found");
      }
      return payload as AnimeInfo;
    },
  });

  const {
    data: recommendations,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["recommendation-page", id],
    queryFn: async () => {
      const res = await GetAnimeRecommendations({ id, limit: 20 });
      if (!res.success) {
        throw new Error(res.message || "Failed to fetch recommendations");
      }
      return res.data as RecommendationEntry[];
    },
  });

  if (infoError) {
    return (
      <ErrorMessage
        title="Anime Recommendations"
        message="Unable to load anime context."
      />
    );
  }

  const title =
    anime?.title_english ||
    anime?.title ||
    anime?.title_japanese ||
    "Anime Recommendations";

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Recommendations</h1>
          <p className="text-muted-foreground text-sm">
            Because you watched{" "}
            <span className="font-medium text-foreground">{title}</span>
          </p>
        </div>
        <Button variant="outline" size="sm" asChild>
          <Link href={`/profile/${id}`}>Back to Anime</Link>
        </Button>
      </div>

      {isLoading && <GridSkeleton />}

      {isError && (
        <ErrorMessage
          title="Recommendations"
          message={
            error instanceof Error
              ? error.message
              : "Unable to load recommendations"
          }
        />
      )}

      {!isLoading && !isError && (
        <>
          {recommendations && recommendations.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {recommendations.map((item) => (
                <AnimeCard
                  key={item.entry?.mal_id}
                  images={item.entry?.images?.jpg?.large_image_url}
                  mal_id={item.entry?.mal_id}
                  rating={anime?.rating ?? null}
                  title_english={item.entry?.title || null}
                  type={item.entry?.type}
                />
              ))}
            </div>
          ) : (
            <div className="rounded-xl border border-dashed border-border/60 p-12 text-center">
              <p className="text-lg font-semibold">No recommendations yet</p>
              <p className="text-sm text-muted-foreground mt-1">
                Check back later as more community data becomes available.
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
}
