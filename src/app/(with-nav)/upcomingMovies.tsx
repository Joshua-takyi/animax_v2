"use client";
import { GetUpcomingAnime } from "@/action";
import Carousel from "@/components/carousel";
import { CardProps } from "@/types/types";
import { useQuery } from "@tanstack/react-query";
import { AnimatePresence, motion } from "framer-motion";
import { CarouselSkeleton } from "@/components/ui/skeleton";
import { ErrorMessage } from "@/components/ui/error";

export default function Upcoming() {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["upcoming"],
    queryFn: async () => {
      const res = await GetUpcomingAnime({
        limit: 10,
        filter: "movie",
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
      ? Array.from(new Map(data.map((item) => [item.mal_id, item])).values())
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
            title="Upcoming Movies"
            message={
              error instanceof Error
                ? error.message
                : "Unable to load upcoming list"
            }
          />
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <Carousel data={uniqueData} title="upcoming movies" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
