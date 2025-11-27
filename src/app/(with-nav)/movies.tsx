"use client";
import { GetTopAnime } from "@/action";
import ListComponent from "@/components/listComponent";
import { removeDuplicates } from "@/lib/duplicate";
import { CardProps } from "@/types/types";
import { useQuery } from "@tanstack/react-query";
import { ListSkeleton } from "@/components/ui/skeleton";
import { ErrorMessage } from "@/components/ui/error";

export default function FavMovies() {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["favMovies"],
    queryFn: async () => {
      const res = await GetTopAnime({
        limit: 5,
        filter: "bypopularity",
        type: "movie",
      });
      if (!res.success) {
        throw new Error("Failed to fetch data");
      }
      return res.data as CardProps[];
    },
  });
  const uniqueData = data ? removeDuplicates(data, "mal_id") : [];

  if (isLoading) {
    return (
      <div className="flex flex-col gap-4">
        <h1 className="md:text-[1.3rem] font-bold capitalize">
          Favorite Movies
        </h1>
        <ListSkeleton rows={5} />
      </div>
    );
  }

  if (isError) {
    return (
      <ErrorMessage
        title="Favorite Movies"
        message={
          error instanceof Error ? error.message : "Unable to load favorites"
        }
      />
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <h1 className="md:text-[1.3rem] font-bold capitalize">Favorite Movies</h1>
      <ListComponent data={uniqueData} />
    </div>
  );
}
