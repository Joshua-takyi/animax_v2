"use client";
import { useCallback, useEffect, useState, useRef } from "react";
import AnimeCard from "./AnimeCard";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { CardProps } from "@/types/types";

interface CarouselProps {
  data: CardProps[];
  title?: string;
}

export default function Carousel({ data, title = "Trending" }: CarouselProps) {
  const carouselRef = useRef<HTMLDivElement>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [itemsPerView, setItemsPerView] = useState(6);

  const filteredData = data.filter((item) => item.images?.jpg?.large_image_url);

  const getItemsPerView = useCallback(() => {
    if (typeof window !== "undefined") {
      if (window.innerWidth < 640) {
        return 2;
      } else if (window.innerWidth < 768) {
        return 3;
      } else if (window.innerWidth < 1024) {
        return 4;
      } else if (window.innerWidth < 1280) {
        return 5;
      } else {
        return 6;
      }
    }
    return 6;
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

    window.addEventListener("resize", debouncedResize);
    return () => {
      window.removeEventListener("resize", debouncedResize);
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
      setCurrentIndex((prev) => Math.min(prev + 1, maxIndex));
    });
  }, [maxIndex, animationLock]);

  const handlePrev = useCallback(() => {
    animationLock(() => {
      setCurrentIndex((prev) => Math.max(prev - 1, 0));
    });
  }, [animationLock]);

  useEffect(() => {
    if (!isHovered && totalItems > itemsPerView && !isAnimating) {
      const interval = setInterval(() => {
        if (currentIndex < maxIndex) {
          handleNext();
        } else {
          setCurrentIndex(0);
        }
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [
    isHovered,
    totalItems,
    handleNext,
    isAnimating,
    currentIndex,
    maxIndex,
    itemsPerView,
  ]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isHovered) {
        if (e.key === "ArrowRight") handleNext();
        if (e.key === "ArrowLeft") handlePrev();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
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

  if (!data || data.length === 0) {
    return null;
  }

  return (
    <section
      className="relative w-full space-y-6"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight capitalize">
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
              className={`absolute left-0 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full backdrop-blur-sm transition-all duration-300 transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary shadow-lg ${
                currentIndex === 0
                  ? "bg-black/20 text-gray-400 cursor-not-allowed"
                  : "bg-black/60 text-white hover:bg-black/80"
              }`}
              aria-label="Previous"
            >
              <ChevronLeft className="h-5 w-5 sm:h-6 sm:w-6" />
            </button>
            <button
              onClick={handleNext}
              disabled={isAnimating || currentIndex >= maxIndex}
              className={`absolute right-0 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full backdrop-blur-sm transition-all duration-300 transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary shadow-lg ${
                currentIndex >= maxIndex
                  ? "bg-black/20 text-gray-400 cursor-not-allowed"
                  : "bg-black/60 text-white hover:bg-black/80"
              }`}
              aria-label="Next"
            >
              <ChevronRight className="h-5 w-5 sm:h-6 sm:w-6" />
            </button>
          </>
        )}

        <div className="relative overflow-hidden">
          <div
            ref={carouselRef}
            className="flex transition-transform duration-500 ease-out gap-4"
            style={{
              transform: `translateX(calc(-${
                currentIndex * (100 / itemsPerView)
              }%))`,
            }}
          >
            {filteredData.map((item, index) => (
              <div
                key={`item-${item.mal_id}-${index}`}
                className="flex-shrink-0 w-[calc(100%/2-0.5rem)] sm:w-[calc(100%/3-0.67rem)] md:w-[calc(100%/4-0.75rem)] lg:w-[calc(100%/5-0.8rem)] xl:w-[calc(100%/6-0.83rem)]"
              >
                <AnimeCard
                  mal_id={item.mal_id}
                  rating={item.rating}
                  title_english={item.title_english}
                  images={item.images.jpg.large_image_url}
                  score={item.score}
                  type={item.type}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
