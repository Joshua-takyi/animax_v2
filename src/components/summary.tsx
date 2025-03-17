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
  const truncatedLength = isMobile ? 150 : 200;

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 891);
    };
    // Initial check
    checkScreenSize();
    // Add event listener for resize
    window.addEventListener('resize', checkScreenSize);
    // Cleanup
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  const handleToggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="w-full overflow-hidden  p-1">
      <div className={`flex ${isMobile ? 'flex-col' : 'flex-row'} gap-6 `}>
        {/* Image section */}
        <div className={`relative w-48 h-64 shrink-0 mx-auto ${isMobile ? 'w-full h-72' : ''}`}>
          <Image
            src={image}
            alt={status}
            fill
            className="object-cover aspect-square "
            sizes={isMobile ? '100vw' : '256px'}
            priority
          />
        </div>

        {/* Content section */}
        <div className="flex-1 flex flex-col">
          {/* Metadata */}
          <div
            className={`grid ${
              isMobile ? 'grid-cols-2 gap-3' : 'grid-cols-2 sm:grid-cols-3 gap-4'
            } text-sm mb-4`}
          >
            <div className="flex flex-col">
              <span className="font-medium text-gray-500 dark:text-gray-400">Status</span>
              <span className="text-gray-700 dark:text-gray-300">{status}</span>
            </div>
            <div className="flex flex-col">
              <span className="font-medium text-gray-500 dark:text-gray-400">Episodes</span>
              <span className="text-gray-700 dark:text-gray-300">{episodes}</span>
            </div>
            <div className="flex flex-col">
              <span className="font-medium text-gray-500 dark:text-gray-400">Released</span>
              <span className="text-gray-700 dark:text-gray-300">{released}</span>
            </div>
            <div className="flex flex-col">
              <span className="font-medium text-gray-500 dark:text-gray-400">Studio</span>
              <span className="text-gray-700 dark:text-gray-300 truncate">
                {studios.join(', ')}
              </span>
            </div>
            <div className="flex flex-col">
              <span className="font-medium text-gray-500 dark:text-gray-400">Type</span>
              <span className="text-gray-700 dark:text-gray-300">{type}</span>
            </div>
            <div className="flex flex-col">
              <span className="font-medium text-gray-500 dark:text-gray-400">Rating</span>
              <span className="text-gray-700 dark:text-gray-300">{rating}</span>
            </div>
            <div
              className={`flex flex-col ${
                isMobile ? 'col-span-2' : ''
              } text-gray-700 dark:text-gray-300`}
            >
              <span className="font-medium text-gray-500 dark:text-gray-400">Genres</span>
              <span className="truncate">{genres.join(', ')}</span>
            </div>
          </div>

          {/* Synopsis with expand/collapse functionality */}
          <div className="mt-auto">
            <h3 className="font-medium text-gray-900 dark:text-white mb-2">Synopsis</h3>
            <p
              className={`text-gray-700 dark:text-gray-300 ${
                isMobile ? 'text-xs' : 'text-sm'
              } leading-relaxed`}
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
                onClick={handleToggleExpand}
                className="mt-2 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 text-sm font-medium focus:outline-none cursor-pointer transition-all"
                aria-expanded={isExpanded}
              >
                {isExpanded ? 'Collapse' : 'Read More'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
