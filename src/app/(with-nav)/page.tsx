import GenresComponent from "@/components/genres";
import Hero from "./hero";
import Trending from "./trending";
import Upcoming from "./upcomingMovies";
import PostGridComponent from "@/components/postGridComponent";
import LatestReleases from "./latestReleases";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import {
  GetSeasonNow,
  GetUpcomingAnime,
  GetTopAnime,
  GetAnime,
} from "@/action";
import { CardProps } from "@/types/types";
import { Wrapper } from "@/components/wrapper";

export default async function Home() {
  const queryClient = new QueryClient();

  await Promise.all([
    queryClient.prefetchQuery({
      queryKey: ["trending"],
      queryFn: async () => {
        const res = await GetSeasonNow({
          limit: 10,
          filter: "tv",
        });
        return res.data as CardProps[];
      },
    }),
    queryClient.prefetchQuery({
      queryKey: ["upcoming"],
      queryFn: async () => {
        const res = await GetUpcomingAnime({
          limit: 10,
          filter: "movie",
        });
        return res.data as CardProps[];
      },
    }),
    queryClient.prefetchQuery({
      queryKey: ["favorite"],
      queryFn: async () => {
        const res = await GetTopAnime({
          limit: 5,
          filter: "favorite",
          type: "tv",
        });
        return res.data as CardProps[];
      },
    }),
    queryClient.prefetchQuery({
      queryKey: ["popularity"],
      queryFn: async () => {
        const res = await GetTopAnime({
          limit: 5,
          filter: "bypopularity",
          type: "tv",
        });
        return res.data as CardProps[];
      },
    }),
    queryClient.prefetchQuery({
      queryKey: ["airing"],
      queryFn: async () => {
        const res = await GetTopAnime({
          limit: 5,
          filter: "airing",
          type: "tv",
        });
        return res.data as CardProps[];
      },
    }),
    queryClient.prefetchQuery({
      queryKey: ["favMovies"],
      queryFn: async () => {
        const res = await GetTopAnime({
          limit: 5,
          filter: "bypopularity",
          type: "movie",
        });
        return res.data as CardProps[];
      },
    }),
    queryClient.prefetchQuery({
      queryKey: ["posts", "movie"],
      queryFn: async () => {
        const res = await GetTopAnime({
          limit: 10,
          type: "movie",
        });
        return res.data as CardProps[];
      },
    }),
    queryClient.prefetchQuery({
      queryKey: ["posts", "tv"],
      queryFn: async () => {
        const res = await GetTopAnime({
          limit: 10,
          type: "tv",
        });
        return res.data as CardProps[];
      },
    }),
    queryClient.prefetchQuery({
      queryKey: ["posts", "special"],
      queryFn: async () => {
        const res = await GetTopAnime({
          limit: 10,
          type: "special",
        });
        return res.data as CardProps[];
      },
    }),
    queryClient.prefetchQuery({
      queryKey: ["season-spotlight"],
      queryFn: async () => {
        const res = await GetSeasonNow({
          limit: 8,
          filter: "tv",
        });
        return res.data as CardProps[];
      },
    }),
    queryClient.prefetchQuery({
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
        return res.data as CardProps[];
      },
    }),
  ]);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div className="space-y-12">
        <Hero />
        <Wrapper>
          <div>
            <aside className="hidden lg:block ">
              <GenresComponent />
            </aside>
          </div>
          <section className="space-y-12">
            <Trending />
            <Upcoming />
          </section>
          <LatestReleases />
          <div className="space-y-12">
            <PostGridComponent title="movies" type="movie" />
            <PostGridComponent title="Tv series" type="tv" />
            <PostGridComponent title="special" type="special" />
          </div>
        </Wrapper>
      </div>
    </HydrationBoundary>
  );
}
