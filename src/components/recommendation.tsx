'use client';
import { useState, useEffect, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import Image from 'next/image';
import { ChevronLeft, Star, X, Info, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { GetAnimeRecommendations } from '@/action';

interface RecommendAnimeCardProps {
  image: string;
  title: string;
  type: string;
  numOfRecommendation: number;
  duration?: string;
  id: number;
}

export interface DataProps {
  entry: {
    mal_id: number;
    images: {
      jpg: {
        large_image_url: string;
      };
    };
    title: string;
    type: string;
    duration: string;
  };
  votes: number;
}

// Recommendation card component with hover effect
const RecommendAnimeCard = ({ image, title, id, numOfRecommendation }: RecommendAnimeCardProps) => {
  return (
    <Link href={`/profile/${id}?q=${encodeURIComponent(title)}`} className="block">
      <div className="flex gap-3 p-3 hover:bg-secondary transition-colors rounded-md">
        <div className="relative flex-shrink-0 w-16 h-24 overflow-hidden rounded shadow">
          <Image
            fill
            sizes="(max-width: 768px) 64px, 64px"
            src={image}
            alt={title}
            className="object-cover"
          />
        </div>
        <div className="flex flex-col  py-1 flex-1 min-w-0">
          <div>
            <h3 className="font-medium text-sm  line-clamp-2">{title}</h3>
          </div>
          <div className="flex items-center text-xs  mt-1">
            <Star size={12} className="text-amber-400 mr-1" />
            <span>{numOfRecommendation} recommendations</span>
          </div>
        </div>
      </div>
    </Link>
  );
};

// New component for empty recommendation state
const NoRecommendations = () => (
  <div className="flex flex-col items-center justify-center p-8 text-center h-64">
    <Info size={32} className="text-slate-400 mb-3" />
    <h3 className="text-base font-medium text-slate-700 ">No Recommendations</h3>
    <p className="text-sm text-slate-500  mt-2">
      There are no recommendations available for this title yet.
    </p>
    {/* INFO: Suggestions for what users can do next */}
    <p className="text-xs text-slate-400  mt-4 max-w-xs">
      If you enjoyed this title, consider being the first to recommend similar anime to others.
    </p>
  </div>
);

export default function AnimeSidebar({ animeId }: Readonly<{ animeId: string }>) {
  // State management for sidebar visibility and screen size
  const [isExpanded, setIsExpanded] = useState(false);
  const [isMobile, setIsMobile] = useState(
    typeof window !== 'undefined' ? window.innerWidth < 890 : false
  );
  const sidebarRef = useRef<HTMLDivElement>(null);

  // Track whether body scroll should be locked (for mobile)
  const [isBodyLocked, setIsBodyLocked] = useState(false);

  // Fetch recommendation data with react-query
  const { data, isLoading } = useQuery({
    queryKey: ['recommendation', animeId],
    queryFn: async () => {
      const res = await GetAnimeRecommendations({
        id: animeId,
      });
      return res.data as DataProps[];
    },
    // Add these optimizations:
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });

  // Handle screen resize and set appropriate sidebar state
  useEffect(() => {
    const handleResize = () => {
      // Define mobile breakpoint at 890px
      const mobile = window.innerWidth < 890;
      setIsMobile(mobile);

      // Auto-expand on desktop, collapse on mobile by default
      if (!mobile) {
        setIsExpanded(true);
      } else {
        setIsExpanded(false);
      }
    };

    // Initialize and set up listener
    handleResize();
    window.addEventListener('resize', handleResize);

    // Clean up resize listener on component unmount
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Lock/unlock body scroll when sidebar is expanded/collapsed on mobile
  useEffect(() => {
    // Only apply scroll locking on mobile
    if (isMobile) {
      if (isExpanded) {
        // Lock body scroll when sidebar is expanded on mobile
        document.body.style.overflow = 'hidden';
        setIsBodyLocked(true);
      } else if (isBodyLocked) {
        // Restore scroll when sidebar collapses
        document.body.style.overflow = '';
        setIsBodyLocked(false);
      }
    }

    // Clean up on unmount
    return () => {
      document.body.style.overflow = '';
    };
  }, [isExpanded, isMobile, isBodyLocked]);

  // Close sidebar when clicking outside on mobile
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isMobile &&
        isExpanded &&
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target as Node) &&
        !(event.target as Element).closest('.sidebar-toggle')
      ) {
        setIsExpanded(false);
      }
    };

    // Add click listener
    document.addEventListener('mousedown', handleClickOutside);

    // Clean up listener on unmount
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isMobile, isExpanded]);

  // Handle escape key to close sidebar
  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isExpanded && isMobile) {
        setIsExpanded(false);
      }
    };

    // Add keyboard listener
    document.addEventListener('keydown', handleEscKey);

    // Clean up listener on unmount
    return () => document.removeEventListener('keydown', handleEscKey);
  }, [isExpanded, isMobile]);

  // Handle loading state
  if (isLoading) {
    // Don't show anything if loading and on mobile
    if (isMobile) return null;

    return (
      <div className="w-64 lg:w-72 border-l h-[calc(100vh-5rem)] flex flex-col">
        {/* Header skeleton */}
        <div className="h-16 border-b bg-background p-4 flex justify-between items-center">
          <div className="h-5 bg-primary/20 rounded w-32 animate-pulse"></div>
          <div className="h-5 w-5 rounded-full bg-primary/20 animate-pulse"></div>
        </div>

        {/* Content area */}
        <div className="flex-1 p-2 space-y-2 overflow-y-auto">
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className="flex gap-3 p-3 rounded-md hover:bg-secondary/30 transition-colors"
            >
              {/* Image placeholder matching the actual card dimensions */}
              <div className="relative flex-shrink-0 w-16 h-24 overflow-hidden rounded shadow bg-primary/20 animate-pulse"></div>

              <div className="flex flex-col py-1 flex-1 min-w-0 space-y-2">
                {/* Title placeholder - two lines */}
                <div className="space-y-1">
                  <div className="h-3.5 bg-primary/20 rounded w-full animate-pulse"></div>
                  <div className="h-3.5 bg-primary/20 rounded w-3/4 animate-pulse"></div>
                </div>

                {/* Recommendations count with star icon */}
                <div className="flex items-center mt-1">
                  <div className="w-3 h-3 rounded-full mr-1 bg-amber-400/50 animate-pulse"></div>
                  <div className="h-3 bg-primary/20 rounded w-24 animate-pulse"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Changed this condition - we'll now show the sidebar even when there's no data
  if (isMobile && !isExpanded) {
    return <SidebarToggle />;
  }

  // Get only first 8 recommendations
  const limitedData = data?.slice(0, 8) || [];
  const hasRecommendations = data && data.length > 0;

  // Mobile toggle button component that appears on the edge of the screen
  function SidebarToggle() {
    return !isExpanded && isMobile ? (
      <button
        onClick={() => setIsExpanded(true)}
        className="sidebar-toggle fixed top-1/2 transform -translate-y-1/2 z-40 right-0  rounded-l-md shadow-lg p-2 transition-all duration-300 ease-in-out hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary/50"
        aria-label="Toggle recommendations sidebar"
      >
        <ChevronLeft size={20} />
      </button>
    ) : null;
  }

  // Modified Sidebar content component to handle empty state
  const SidebarContent = () => (
    <div className="space-y-1">
      {hasRecommendations ? (
        <>
          {limitedData.map((item: DataProps) => (
            <RecommendAnimeCard
              key={item.entry.mal_id}
              id={item.entry.mal_id}
              image={item.entry.images.jpg.large_image_url}
              title={item.entry.title}
              type={item.entry.type || 'Unknown'}
              duration={item.entry.duration || 'N/A'}
              numOfRecommendation={item.votes}
            />
          ))}

          {data.length > 8 && (
            <Link
              href={`/anime/${animeId}/recommendations`}
              className="flex items-center justify-center text-sm text-indigo-600 font-medium p-2 mt-2 hover:bg-indigo-50 rounded-md transition-colors"
            >
              View all recommendations
              <ChevronRight size={16} className="ml-1" />
            </Link>
          )}
        </>
      ) : (
        <NoRecommendations />
      )}
    </div>
  );

  // Create overlay for mobile backdrop
  const MobileOverlay = () =>
    isMobile &&
    isExpanded && (
      <div
        className="fixed inset-0 bg-black/30 z-40 md:hidden transition-opacity duration-300"
        aria-hidden="true"
      />
    );

  return (
    <>
      {/* Mobile toggle button */}
      {isMobile && <SidebarToggle />}

      {/* Mobile backdrop overlay */}
      <MobileOverlay />

      {/* Main sidebar component */}
      <div
        ref={sidebarRef}
        className={`
          ${
            isMobile
              ? `fixed inset-y-0 right-0 z-50 shadow-xl w-72 bg-background ${
                  isExpanded ? 'translate-x-0' : 'translate-x-full'
                }`
              : 'w-64 lg:w-72'
          }
          transition-transform duration-300 ease-in-out
          flex flex-col
          h-[calc(100vh-5rem)]
        `}
        aria-label="Anime recommendations"
        aria-hidden={isMobile && !isExpanded}
        aria-expanded={isExpanded}
      >
        {/* Sidebar header */}
        <div className="flex items-center justify-between p-4 border-b  bg-background z-10">
          <h2 className="font-semibold">Recommendations</h2>
          {isMobile && (
            <button
              onClick={() => setIsExpanded(false)}
              className="text-slate-500 p-1 rounded-full transition-colors hover:bg-slate-100"
              aria-label="Close sidebar"
            >
              <X size={18} />
            </button>
          )}
          {!isMobile && hasRecommendations && (
            <span className="text-sm px-2 py-0.5 rounded-full">{data.length}</span>
          )}
        </div>

        {/* Scrollable content area */}
        <div className="flex-1 ">
          <div className="p-2 space-y-2">
            <SidebarContent />
          </div>
        </div>
      </div>
    </>
  );
}
