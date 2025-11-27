"use client";

import { GetAnime } from "@/action";
import InfiniteAnimeGrid from "@/components/InfiniteAnimeGrid";
import { Wrapper } from "@/components/wrapper";
import { CardProps } from "@/types/types";
import { useSearchParams } from "next/navigation";

export default function GetSpecial() {
  const searchParams = useSearchParams();
  const genres = searchParams.get("genre") ?? "";
  const rating = searchParams.get("rating") ?? "";
  const status = searchParams.get("status") ?? "";

  return (
    <div className="min-h-screen">
      <Wrapper>
        <InfiniteAnimeGrid
          title="TV Specials"
          queryKey={["special", genres, rating, status]}
          queryFn={async (page) => {
            const res = await GetAnime({
              q: "",
              type: "tv_special",
              genres,
              rating,
              status,
              page,
              limit: 18,
              order_by: "popularity",
            });
            if (!res.success) {
              throw new Error(res.message || "Failed to fetch specials");
            }
            return res.data as CardProps[];
          }}
          emptyMessage="No specials found matching your criteria"
        />
      </Wrapper>
    </div>
  );
}
