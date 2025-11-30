"use client";
import { memo } from "react";
import Image from "next/image";
import Link from "next/link";
import { Star } from "lucide-react";

interface AnimeCardProps {
  title_english: string | null;
  title?: string; // Added fallback title
  images: string;
  mal_id: number;
  rating?: string | null;
  score?: number;
  type?: string;
  episodes?: number;
}

const AnimeCard = memo(function AnimeCard({
  title_english,
  title,
  images,
  mal_id,
  score,
}: AnimeCardProps) {
  const displayTitle = title_english || title || "Untitled";
  const urlSafeTitle = encodeURIComponent(displayTitle);

  return (
    <Link
      href={`/profile/${mal_id}?q=${urlSafeTitle} anime`}
      className="group block"
      prefetch={false}
    >
      <div className="space-y-2">
        {/* Image */}
        <div className="relative aspect-[3/3] overflow-hidden rounded-xl bg-muted">
          <Image
            src={images}
            alt={displayTitle}
            fill
            loading="lazy"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            quality={75}
          />

          {/* Simple overlay on hover */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />

          {/* Score - minimal badge */}
          {score && (
            <div className="absolute top-2 right-2 flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-black/70 backdrop-blur-sm">
              <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
              <span className="text-xs font-medium text-white">
                {score.toFixed(1)}
              </span>
            </div>
          )}
        </div>

        {/* Title - clean and simple */}
        <h3 className="text-[0.8rem] font-medium line-clamp-2 leading-snug group-hover:text-primary transition-colors">
          {displayTitle}
        </h3>
      </div>
    </Link>
  );
});

AnimeCard.displayName = "AnimeCard";

export default AnimeCard;
