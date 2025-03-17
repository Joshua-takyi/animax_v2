import Image from 'next/image';
import { Badge } from './ui/badge';
import { CardProps } from '@/types/types';
import AnimatePresenceWrapper from './AnimatePresenceWrapper';
import { motion } from 'framer-motion';
export default function ListComponent({ data }: { data: CardProps[] }) {
  return (
    <div className="flex flex-col space-y-4">
      <AnimatePresenceWrapper>
        {data.map((item, index) => {
          const fallbackImage = item?.images.jpg?.large_image_url || '/images/placeholder.jpg';
          const fallbackTitle = item?.title_english || item?.title_japanese || 'No title';

          const getRatingLabel = (rating: string) => {
            if (rating?.includes('R -') || rating?.includes('R+')) return '18+';
            if (rating?.includes('PG-13')) return '13+';
            if (rating?.includes('PG')) return '7+';
            return 'PG';
          };

          return (
            <motion.a
              href={`/profile/${item.mal_id}?q=${fallbackTitle}`}
              key={`item-${item.mal_id}-${index}`}
              className="group"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
            >
              <div className="flex items-center border-b  pb-2 transition-colors hover:bg-secondary">
                {/* Image container - smaller, fixed size */}
                <div className="h-20 w-16 flex-shrink-0 overflow-hidden rounded">
                  <Image
                    src={fallbackImage}
                    alt={fallbackTitle}
                    width={84}
                    height={84}
                    className="h-full w-full "
                  />
                </div>

                {/* Content container */}
                <div className="ml-4 flex flex-col w-full md:px-4 space-y-2">
                  <span className="text-sm font-medium">{fallbackTitle}</span>

                  <div className="mt-1 flex space-x-2 p-1">
                    {item.episodes && (
                      <Badge variant="outline" className="text-xs font-normal">
                        {`episodes: ${item.episodes}`}
                      </Badge>
                    )}

                    <Badge variant="outline" className="text-xs font-normal">
                      {getRatingLabel(item.rating || '')}
                    </Badge>

                    {item.type && (
                      <Badge variant="outline" className="text-xs font-normal">
                        {item.type}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            </motion.a>
          );
        })}
      </AnimatePresenceWrapper>
    </div>
  );
}
