'use client';
import Image from 'next/image';
import { useEffect, useState } from 'react';

interface SummaryComponentProps {
  image: string;
  status: string;
  episodes: number;
  type: string;
  studios: string[];
  released: string;
  synopsis: string;
  rating: string;
  genres: string[];
}

export default function SummaryComponent({
  image,
  status,
  episodes,
  type,
  studios,
  released,
  synopsis,
  rating,
  genres,
}: Readonly<SummaryComponentProps>) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const truncatedLength = isMobile ? 100 : 300;

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <article
      className="flex flex-col md:flex-row gap-4"
      itemScope
      itemType="https://schema.org/TVSeries"
    >
      {/* Image section with structured data */}
      <div className={`relative w-48 h-64 shrink-0 mx-auto ${isMobile ? 'w-full h-72' : ''}`}>
        <Image
          src={image}
          alt={`Cover image for ${type}`}
          fill
          className="object-cover aspect-square"
          sizes={isMobile ? '100vw' : '256px'}
          priority
          itemProp="image"
        />
      </div>

      {/* Content section with structured data */}
      <div className="flex-1 flex flex-col">
        <div
          className={`grid ${
            isMobile ? 'grid-cols-2 gap-3' : 'grid-cols-2 sm:grid-cols-3 gap-4'
          } text-sm mb-4`}
        >
          <div className="flex flex-col">
            <span className="font-medium text-gray-500 dark:text-gray-400">Status</span>
            <span className="text-gray-700 dark:text-gray-300" itemProp="status">
              {status}
            </span>
          </div>
          <div className="flex flex-col">
            <span className="font-medium text-gray-500 dark:text-gray-400">Episodes</span>
            <span className="text-gray-700 dark:text-gray-300" itemProp="numberOfEpisodes">
              {episodes}
            </span>
          </div>
          <div className="flex flex-col">
            <span className="font-medium text-gray-500 dark:text-gray-400">Released</span>
            <span className="text-gray-700 dark:text-gray-300" itemProp="datePublished">
              {released}
            </span>
          </div>
          <div className="flex flex-col">
            <span className="font-medium text-gray-500 dark:text-gray-400">Studio</span>
            <span
              className="text-gray-700 dark:text-gray-300 truncate"
              itemProp="productionCompany"
            >
              {studios.join(', ')}
            </span>
          </div>
          <div className="flex flex-col">
            <span className="font-medium text-gray-500 dark:text-gray-400">Type</span>
            <span className="text-gray-700 dark:text-gray-300" itemProp="@type">
              {type}
            </span>
          </div>
          <div className="flex flex-col">
            <span className="font-medium text-gray-500 dark:text-gray-400">Rating</span>
            <span className="text-gray-700 dark:text-gray-300" itemProp="contentRating">
              {rating}
            </span>
          </div>
          <div className={`flex flex-col ${isMobile ? 'col-span-2' : ''}`}>
            <span className="font-medium text-gray-500 dark:text-gray-400">Genres</span>
            <span className="text-gray-700 dark:text-gray-300 truncate" itemProp="genre">
              {genres.join(', ')}
            </span>
          </div>
        </div>

        {/* Synopsis with expand/collapse functionality and structured data */}
        <div className="mt-auto">
          <h2 className="font-medium text-gray-900 dark:text-white mb-2">Synopsis</h2>
          <p
            className={`text-gray-700 dark:text-gray-300 ${
              isMobile ? 'text-xs' : 'text-sm'
            } leading-relaxed`}
            itemProp="description"
          >
            {isExpanded
              ? synopsis || 'No synopsis available'
              : synopsis
              ? `${synopsis.slice(0, truncatedLength)}${
                  synopsis.length > truncatedLength ? '...' : ''
                }`
              : 'No synopsis available'}
          </p>
          {synopsis && synopsis.length > truncatedLength && (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="mt-2 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 text-sm font-medium focus:outline-none cursor-pointer transition-all"
              aria-expanded={isExpanded}
            >
              {isExpanded ? 'Collapse' : 'Read More'}
            </button>
          )}
        </div>
      </div>
    </article>
  );
}
