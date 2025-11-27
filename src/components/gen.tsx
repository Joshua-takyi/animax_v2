"use client";

import { GetAnime } from "@/action";
import InfiniteAnimeGrid from "@/components/InfiniteAnimeGrid";
import { Wrapper } from "@/components/wrapper";
import { CardProps } from "@/types/types";

export default function Genres({ genreId }: { genreId: string }) {
  return (
    <div>
      <Wrapper>
        <InfiniteAnimeGrid
          title={`Genre: ${genreId}`}
          queryKey={["genres", genreId]}
          queryFn={async (page) => {
            const res = await GetAnime({
              q: "",
              type: "",
              genres: genreId,
              rating: "",
              status: "",
              page,
              limit: 18,
              order_by: "popularity",
            });
            if (!res.success) {
              throw new Error(res.message || "Failed to fetch genre results");
            }
            return res.data as CardProps[];
          }}
          emptyMessage={`No results found for genre "${genreId}"`}
        />
      </Wrapper>
    </div>
  );
}
