'use client';
import { AnimeGenre } from '@/dataset/db';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronUp } from 'lucide-react';

/**
 * Enhanced component that displays anime genres with consistent colors
 * Using the color property assigned to each genre in the database
 * Includes responsive design, animations, and better user experience
 */
const GenresComponent = () => {
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [columns, setColumns] = useState(3);
  const allGenres = AnimeGenre;

  // Determine number of columns based on screen width
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setColumns(2);
      } else if (window.innerWidth < 768) {
        setColumns(3);
      } else if (window.innerWidth < 1024) {
        setColumns(4);
      } else {
        setColumns(4);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Calculate visible genres based on collapse state
  const visibleCount = isCollapsed ? 4 * columns : allGenres.length;

  return (
    <section className="max-w-[360px] rounded-lg border border-border bg-card p-4 ">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold tracking-tight">Genres</h2>
      </div>

      <div
        className={`grid gap-2 transition-all duration-300 ease-in-out`}
        style={{
          gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
        }}
      >
        <AnimatePresence>
          {allGenres.slice(0, visibleCount).map((genre) => (
            <motion.div
              key={genre.mal_id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <Link
                title={genre.name}
                href={`/genre/${genre.mal_id}`}
                className="flex h-10 items-center justify-start rounded-md px-3 text-sm transition-all hover:bg-muted"
                style={{
                  color: genre.color,
                  //   borderLeft: `3px solid ${genre.color}`,
                }}
              >
                <span className="truncate capitalize">{genre.name}</span>
              </Link>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {allGenres.length > 4 * columns && (
        <div className="mt-4">
          <Button
            variant="outline"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="w-full group border-dashed flex items-center justify-center gap-2 h-9"
            aria-label={isCollapsed ? 'Show more genres' : 'Show fewer genres'}
          >
            <span>{isCollapsed ? 'Show more' : 'Show less'}</span>
            {isCollapsed ? (
              <ChevronDown className="h-4 w-4 transition-transform group-hover:translate-y-1" />
            ) : (
              <ChevronUp className="h-4 w-4 transition-transform group-hover:-translate-y-1" />
            )}
          </Button>
        </div>
      )}
    </section>
  );
};

export default GenresComponent;
