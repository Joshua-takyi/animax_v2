'use client';
import { useCallback, useEffect, useState, useRef } from 'react';
import MoviesCard from './moviesCard';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { CardProps } from '@/types/types';

interface CarouselProps {
  data: CardProps[];
  title?: string;
}

export default function Carousel({ data, title = 'Trending' }: CarouselProps) {
  const carouselRef = useRef<HTMLDivElement>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [itemsPerView, setItemsPerView] = useState(5);

  // Filter out items with no images upfront
  const filteredData = data.filter((item) => item.images?.jpg?.large_image_url);

  // Function to determine items per view based on screen size
  const getItemsPerView = useCallback(() => {
    if (typeof window !== 'undefined') {
      if (window.innerWidth < 640) {
        return 2; // Small screens
      } else if (window.innerWidth < 1024) {
        return 4; // Medium screens
      } else {
        return 5; // Large and XL screens
      }
    }
    return 5; // Default fallback
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setItemsPerView(getItemsPerView());
      const maxIndex = Math.max(0, filteredData.length - getItemsPerView());
      if (currentIndex > maxIndex) {
        setCurrentIndex(maxIndex);
      }
    };

    handleResize();

    let resizeTimer: NodeJS.Timeout;
    const debouncedResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(handleResize, 100);
    };

    window.addEventListener('resize', debouncedResize);
    return () => {
      window.removeEventListener('resize', debouncedResize);
      clearTimeout(resizeTimer);
    };
  }, [getItemsPerView, filteredData.length, currentIndex]);

  const totalItems = filteredData.length;
  const maxIndex = Math.max(0, totalItems - itemsPerView);

  const animationLock = useCallback(
    (callback: () => void) => {
      if (isAnimating) return;
      setIsAnimating(true);
      callback();
      setTimeout(() => setIsAnimating(false), 500);
    },
    [isAnimating]
  );

  const handleNext = useCallback(() => {
    animationLock(() => {
      setCurrentIndex((prev) => {
        // Move by 1 item at a time
        const nextIndex = Math.min(prev + 1, maxIndex);
        return nextIndex;
      });
    });
  }, [maxIndex, animationLock]);

  const handlePrev = useCallback(() => {
    animationLock(() => {
      setCurrentIndex((prev) => {
        // Move back by 1 item
        const prevIndex = Math.max(prev - 1, 0);
        return prevIndex;
      });
    });
  }, [animationLock]);

  useEffect(() => {
    if (!isHovered && totalItems > itemsPerView && !isAnimating) {
      const interval = setInterval(() => {
        if (currentIndex < maxIndex) {
          handleNext();
        } else {
          // Reset to beginning when reaching the end for continuous loop
          setCurrentIndex(0);
        }
      }, 2000); // Changed from 3000 to 2000 for faster autoplay
      return () => clearInterval(interval);
    }
  }, [isHovered, totalItems, handleNext, isAnimating, currentIndex, maxIndex, itemsPerView]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isHovered) {
        if (e.key === 'ArrowRight') handleNext();
        if (e.key === 'ArrowLeft') handlePrev();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleNext, handlePrev, isHovered]);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    setTouchStart(e.touches[0].clientX);
  }, []);

  const handleTouchMove = useCallback(
    (e: React.TouchEvent) => {
      if (touchStart === null) return;

      const touchEnd = e.touches[0].clientX;
      const diff = touchStart - touchEnd;

      if (Math.abs(diff) > 50) {
        if (diff > 0) {
          handleNext();
        } else {
          handlePrev();
        }
        setTouchStart(null);
      }
    },
    [touchStart, handleNext, handlePrev]
  );

  const handleTouchEnd = useCallback(() => {
    setTouchStart(null);
  }, []);

  if (!data) {
    return (
      <div>
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="p-4 rounded-lg bg-muted/50 animate-pulse">
            <div className="flex items-start space-x-4">
              <div className="w-14 h-14 rounded-lg bg-muted"></div>
              <div className="flex-1 space-y-2">
                <div className="h-3 bg-muted rounded w-3/4"></div>
                <div className="h-2 bg-muted rounded w-1/2"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }
  return (
    <main
      className="relative w-full "
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="inline-flex items-center justify-between w-full">
        <h2 className="md:text-[2rem] text-[1rem] font-bold tracking-tight capitalize p-2">
          {title}
        </h2>
      </div>

      <div
        className="relative"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {totalItems > itemsPerView && (
          <>
            <button
              onClick={handlePrev}
              disabled={isAnimating || currentIndex === 0}
              className={`absolute left-0 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full backdrop-blur-sm transition-all duration-300 transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-400 shadow-lg ${
                currentIndex === 0
                  ? 'bg-black/20 text-gray-400 cursor-not-allowed'
                  : 'bg-black/40 text-white hover:bg-black/60 active:bg-black/70'
              }`}
              aria-label="Previous card"
            >
              <ChevronLeft className="h-5 w-5 sm:h-6 sm:w-6" />
            </button>
            <button
              onClick={handleNext}
              disabled={isAnimating || currentIndex >= maxIndex}
              className={`absolute right-0 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full backdrop-blur-sm transition-all duration-300 transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-400 shadow-lg ${
                currentIndex >= maxIndex
                  ? 'bg-black/20 text-gray-400 cursor-not-allowed'
                  : 'bg-black/40 text-white hover:bg-black/60 active:bg-black/70'
              }`}
              aria-label="Next card"
            >
              <ChevronRight className="h-5 w-5 sm:h-6 sm:w-6" />
            </button>
          </>
        )}

        <div className="relative overflow-hidden">
          <div
            ref={carouselRef}
            className="flex transition-transform duration-300 ease-out md:gap-4 gap-2"
            style={{
              transform: `translateX(calc(-${currentIndex * (100 / itemsPerView)}%))`,
            }}
          >
            {filteredData.map((item, index) => (
              <div
                key={`item-${item.mal_id}-${index}`}
                className="flex-shrink-0 w-[calc(100%/2-0.5rem)] sm:w-[calc(100%/4-0.75rem)] lg:w-[calc(100%/5-0.8rem)]"
              >
                <MoviesCard
                  mal_id={item.mal_id}
                  rating={item.rating}
                  title_english={item.title_english}
                  images={item.images.jpg.large_image_url}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
