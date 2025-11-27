"use client";
import { AnimeGenre } from "@/dataset/db";
import { Badge } from "./ui/badge";
import Link from "next/link";
import { useState } from "react";
import { Button } from "./ui/button";
import { ChevronDown } from "lucide-react";

const GenresComponent = () => {
  const [expanded, setExpanded] = useState(false);
  const allGenres = AnimeGenre;

  const hasMore = allGenres.length > 15;
  const displayGenres = expanded ? allGenres : allGenres.slice(0, 20);
  return (
    <section className="w-full py-6 space-y-4">
      <h2 className="text-2xl font-medium">Genres</h2>
      <div className="flex flex-wrap gap-2 items-center justify-center transition-all ease-in-out">
        {displayGenres.map((genre) => (
          <Link href={`/genre/${genre.mal_id}`} key={genre.mal_id}>
            <Badge
              variant="secondary"
              className="px-3 py-1.5 rounded-full text-sm font-medium hover:bg-primary hover:text-primary-foreground transition-all duration-300"
            >
              {genre.name}
            </Badge>
          </Link>
        ))}
      </div>
      {hasMore && (
        <Button
          variant="ghost"
          size="sm"
          className="w-full cursor-pointer  mt-2 text-center flex items-center justify-center gap-1.5"
          onClick={() => setExpanded(!expanded)}
        >
          <ChevronDown
            className={`h-4 w-4 transition-transform ${
              expanded ? "rotate-180" : ""
            }`}
          />
          {expanded ? "Show Less" : `Show All (${allGenres.length})`}
        </Button>
      )}
    </section>
  );
};

export default GenresComponent;
