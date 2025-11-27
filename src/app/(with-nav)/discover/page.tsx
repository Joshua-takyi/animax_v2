"use client";
import { GetAnime } from "@/action";
import InfiniteAnimeGrid from "@/components/InfiniteAnimeGrid";
import { Button } from "@/components/ui/button";
import { CardProps } from "@/types/types";
import { useState } from "react";

interface DiscoverFilters {
  q: string;
  type: string;
  rating: string;
  status: string;
  order_by: string;
}

const defaultFilters: DiscoverFilters = {
  q: "",
  type: "",
  rating: "",
  status: "",
  order_by: "popularity",
};

const selectClass =
  "rounded-lg border border-border/40 bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30";

export default function DiscoverPage() {
  const [filters, setFilters] = useState<DiscoverFilters>(defaultFilters);
  const [formState, setFormState] = useState<DiscoverFilters>(defaultFilters);

  const handleApply = () => {
    setFilters(formState);
  };

  const activeFilters = Object.entries(filters)
    .filter(
      ([key, value]) =>
        value && value !== defaultFilters[key as keyof DiscoverFilters]
    )
    .map(([key, value]) => `${key.replace("_", " ")}: ${value}`);

  return (
    <div className="space-y-8 p-4 md:p-6 lg:p-8">
      <header className="space-y-2">
        <p className="text-sm uppercase tracking-wide text-muted-foreground">
          Explorer
        </p>
        <h1 className="text-3xl font-bold">Discover Anime</h1>
        <p className="text-muted-foreground">
          Filter by type, rating, and status to find your next binge-worthy
          title.
        </p>
      </header>

      <section className="rounded-2xl border border-border/40 bg-card/50 backdrop-blur-md p-4">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Search
            </label>
            <input
              type="text"
              className={selectClass}
              placeholder="Search title..."
              value={formState.q}
              onChange={(event) =>
                setFormState((prev) => ({ ...prev, q: event.target.value }))
              }
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Type
            </label>
            <select
              className={selectClass}
              value={formState.type}
              onChange={(event) =>
                setFormState((prev) => ({ ...prev, type: event.target.value }))
              }
            >
              <option value="">Any</option>
              <option value="tv">TV</option>
              <option value="movie">Movie</option>
              <option value="ova">OVA</option>
              <option value="special">Special</option>
            </select>
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Rating
            </label>
            <select
              className={selectClass}
              value={formState.rating}
              onChange={(event) =>
                setFormState((prev) => ({
                  ...prev,
                  rating: event.target.value,
                }))
              }
            >
              <option value="">Any</option>
              <option value="g">G - All Ages</option>
              <option value="pg">PG - Children</option>
              <option value="pg13">PG-13 - Teens 13 or older</option>
              <option value="r17">R - 17+ (violence & profanity)</option>
              <option value="r">R+ - Mild Nudity</option>
              <option value="rx">Rx - Hentai</option>
            </select>
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Status
            </label>
            <select
              className={selectClass}
              value={formState.status}
              onChange={(event) =>
                setFormState((prev) => ({
                  ...prev,
                  status: event.target.value,
                }))
              }
            >
              <option value="">Any</option>
              <option value="airing">Airing</option>
              <option value="complete">Completed</option>
              <option value="upcoming">Upcoming</option>
            </select>
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Order by
            </label>
            <select
              className={selectClass}
              value={formState.order_by}
              onChange={(event) =>
                setFormState((prev) => ({
                  ...prev,
                  order_by: event.target.value,
                }))
              }
            >
              <option value="popularity">Popularity</option>
              <option value="score">Score</option>
              <option value="favorites">Favorites</option>
              <option value="rank">Rank</option>
            </select>
          </div>
          <div className="flex items-end gap-3">
            <Button onClick={handleApply} className="w-full">
              Apply Filters
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                setFormState(defaultFilters);
                setFilters(defaultFilters);
              }}
            >
              Reset
            </Button>
          </div>
        </div>

        {activeFilters.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2 text-xs">
            {activeFilters.map((filter) => (
              <span key={filter} className="rounded-full bg-muted px-2 py-1">
                {filter}
              </span>
            ))}
          </div>
        )}
      </section>

      <InfiniteAnimeGrid
        title="Results"
        queryKey={["discover", JSON.stringify(filters)]}
        queryFn={async (page) => {
          const res = await GetAnime({
            ...filters,
            page,
            limit: 18,
            genres: "",
          });
          if (!res.success) {
            throw new Error(res.message || "Failed to fetch discover feed");
          }
          return res.data as CardProps[];
        }}
        emptyMessage="No anime found matching your filters"
      />
    </div>
  );
}
