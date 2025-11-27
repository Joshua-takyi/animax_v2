"use client";

import { GetAnime } from "@/action";
import InfiniteAnimeGrid from "@/components/InfiniteAnimeGrid";
import { Wrapper } from "@/components/wrapper";
import { CardProps } from "@/types/types";
import { useSearchParams } from "next/navigation";
import Head from "next/head";

export default function SearchPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";

  const metaDescription = query
    ? `Search results for "${query}". Find your favorite series and movies.`
    : `Search anime titles on Animax. Find your favorite series and movies.`;

  return (
    <>
      <Head>
        <title>
          {query ? `Search: ${query} | Animax` : "Search Anime | Animax"}
        </title>
        <meta name="description" content={metaDescription} />
        <meta
          property="og:title"
          content={
            query ? `Search: ${query} | Animax` : "Search Anime | Animax"
          }
        />
        <meta property="og:description" content={metaDescription} />
        <link
          rel="canonical"
          href={`https://animax-v2.vercel.app//search${
            query ? `?q=${encodeURIComponent(query)}` : ""
          }`}
        />
      </Head>

      <div className="min-h-screen">
        <Wrapper>
          <InfiniteAnimeGrid
            title={query ? `Results for "${query}"` : "Search Anime"}
            queryKey={["search", query]}
            queryFn={async (page) => {
              const res = await GetAnime({
                q: query,
                type: "",
                genres: "",
                rating: "",
                status: "",
                page,
                limit: 18,
                order_by: "popularity",
              });
              if (!res.success) {
                throw new Error(
                  res.message || "Failed to fetch search results"
                );
              }
              return res.data as CardProps[];
            }}
            emptyMessage={`No results found for "${query}"`}
          />
        </Wrapper>
      </div>
    </>
  );
}
