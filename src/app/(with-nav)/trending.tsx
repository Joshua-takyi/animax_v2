"use client";
import Carousel from "@/components/carousel";
import { useQuery } from "@tanstack/react-query";
import { AnimatePresence, motion } from "framer-motion";
import { CardProps } from "@/types/types";
import { GetSeasonNow } from "@/action";
import { CarouselSkeleton } from "@/components/ui/skeleton";
import { ErrorMessage } from "@/components/ui/error";

export default function Trending() {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["trending"],
    queryFn: async () => {
      const res = await GetSeasonNow({
        limit: 10,
        filter: "tv",
      });
      if (!res.success) {
        throw new Error("Failed to fetch data");
      }
      return res.data as CardProps[];
    },
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  });

  const uniqueData =
    data && Array.isArray(data)
      ? Array.from(
          new Map(data.map((item) => [item.mal_id, item])).values()
        ).filter((item) => item.status !== "Not yet aired")
      : [];

  if (!isLoading && !isError && uniqueData.length === 0) {
    return null;
  }
  return (
    <div>
      <AnimatePresence mode="wait">
        {isLoading ? (
          <CarouselSkeleton />
        ) : isError ? (
          <ErrorMessage
            title="Top Airing"
            message={
              error instanceof Error
                ? error.message
                : "Unable to load trending list"
            }
          />
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <Carousel data={uniqueData} title="top airing" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
