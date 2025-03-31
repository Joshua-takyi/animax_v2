'use client';
import { memo, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Badge } from './ui/badge';
import { Star, Calendar, PlayCircle } from 'lucide-react';

interface CardProps {
  title_english: string | null;
  images: string;
  mal_id: number;
  rating: string | null;
  score?: number;
  type?: string;
  episodes?: number;
  aired?: { string: string };
}

// Memoize component to prevent unnecessary re-renders
const MoviesCard = memo(function MoviesCard({
  title_english,
  images,
  mal_id,
  rating,
  score,
  type,
  episodes,
  aired,
}: CardProps) {
  // Use useMemo for expensive computations
  const ratingLabel = useMemo(() => {
    if (!rating) return 'Not Rated';
    if (rating.includes('R -') || rating.includes('R+')) return '18+';
    if (rating.includes('PG-13')) return '13+';
    if (rating.includes('PG')) return '7+';
    return 'All Ages';
  }, [rating]);

  // Pre-compute date for optimization
  const formattedDate = useMemo(
    () => (aired?.string ? new Date(aired.string).getFullYear() : null),
    [aired]
  );

  // Safely encode the URL parameter
  const urlSafeTitle = useMemo(() => encodeURIComponent(title_english || ''), [title_english]);

  return (
    <div
      className="w-full h-[220px] sm:h-[260px] md:h-[300px] lg:h-[350px] relative overflow-hidden rounded-sm"
      itemScope
      itemType="https://schema.org/Movie"
    >
      <Link
        href={`/profile/${mal_id}?q=${urlSafeTitle} anime`}
        className="block h-full w-full"
        prefetch={false}
        title={`View details for ${title_english || 'Untitled Anime'}`}
      >
        <div className="w-full h-full relative group">
          {/* Rating badge with structured data */}
          <meta itemProp="contentRating" content={rating || 'Not Rated'} />
          <Badge
            variant={'destructive'}
            className="absolute top-2 right-2 z-10 px-2 py-1 text-xs rounded-sm"
          >
            {ratingLabel}
          </Badge>

          {/* Type badge with structured data */}
          {type && (
            <div className="absolute top-2 left-2 z-10">
              <meta itemProp="@type" content={type} />
              <Badge
                variant="secondary"
                className="px-2 py-1 text-xs bg-black/50 text-white border-none"
              >
                {type}
              </Badge>
            </div>
          )}

          {/* Episodes count with structured data */}
          {episodes && (
            <div className="absolute top-10 left-2 z-10">
              <meta itemProp="numberOfEpisodes" content={episodes.toString()} />
              <Badge
                variant="outline"
                className="px-2 py-1 text-xs bg-black/50 text-white border-none flex items-center gap-1"
              >
                <PlayCircle size={12} />
                {episodes} Episodes
              </Badge>
            </div>
          )}

          {/* Movie image with structured data */}
          <div className="absolute inset-0 bg-slate-200 dark:bg-slate-800">
            <meta itemProp="image" content={images} />
            <Image
              src={images}
              alt={title_english || 'Movie image'}
              fill
              loading="lazy"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 33vw, 16vw"
              className="object-cover will-change-transform group-hover:scale-105 transition-transform duration-300"
              quality={80}
            />
          </div>

          {/* Dark overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300" />

          {/* Content - Simplified and static positioning with structured data */}
          <div className="absolute bottom-0 left-0 right-0 p-2 sm:p-4 text-white transform translate-y-0 sm:translate-y-[30%] group-hover:translate-y-0 transition-transform duration-300">
            {/* Title with structured data */}
            <h2
              className="text-sm sm:text-base lg:text-lg font-bold truncate mb-1 sm:mb-2 text-shadow"
              itemProp="name"
            >
              {title_english || 'Untitled'}
            </h2>

            {/* Info row with structured data */}
            <div className="flex items-center justify-between text-xs text-white/90 mb-1 sm:mb-2">
              {score && (
                <div className="flex items-center gap-1">
                  <meta itemProp="aggregateRating" content={score.toString()} />
                  <Star size={12} className="text-yellow-400" fill="currentColor" />
                  <span>{score.toFixed(1)}</span>
                </div>
              )}

              {formattedDate && (
                <div className="flex items-center gap-1">
                  <meta itemProp="datePublished" content={aired?.string || ''} />
                  <Calendar size={12} />
                  <span>{formattedDate}</span>
                </div>
              )}
            </div>

            {/* View details button with ARIA label */}
            <div className="mt-1 sm:mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 hidden sm:block">
              <div
                className="bg-primary/80 hover:bg-primary text-white text-center py-1 sm:py-1.5 rounded-sm text-xs sm:text-sm font-medium transition-colors"
                role="button"
                aria-label={`View details for ${title_english || 'Untitled Anime'}`}
              >
                View Details
              </div>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
});

// Add display name for better debugging
MoviesCard.displayName = 'MoviesCard';

export default MoviesCard;
