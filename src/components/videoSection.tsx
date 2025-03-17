'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';

interface VideoSectionProps {
  videoUrl: string | null | undefined;
  aspectRatio?: '16:9' | '4:3' | '1:1';
  className?: string;
}

export default function VideoSection({
  videoUrl,
  aspectRatio = '16:9',
  className = '',
}: Readonly<VideoSectionProps>) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Calculate padding based on aspect ratio
  const getPaddingTop = () => {
    switch (aspectRatio) {
      case '4:3':
        return '75%';
      case '1:1':
        return '100%';
      default:
        return '56.25%'; // 16:9
    }
  };

  return (
    <div className={`w-full ${className}`}>
      <div
        className="relative w-full rounded-lg overflow-hidden bg-black"
        style={{ paddingTop: getPaddingTop() }}
      >
        {videoUrl ? (
          <>
            {/* Structured data for video content */}
            <script
              type="application/ld+json"
              dangerouslySetInnerHTML={{
                __html: JSON.stringify({
                  '@context': 'https://schema.org',
                  '@type': 'VideoObject',
                  name: 'Anime Trailer',
                  embedUrl: `https://www.youtube.com/embed/${videoUrl}`,
                  thumbnailUrl: `https://img.youtube.com/vi/${videoUrl}/maxresdefault.jpg`,
                  uploadDate: new Date().toISOString(),
                }),
              }}
            />
            <iframe
              src={`https://www.youtube.com/embed/${videoUrl}?enablejsapi=1&wmode=opaque&rel=0`}
              title="Anime trailer video player"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              className="absolute top-0 left-0 w-full h-full border-0"
              loading="lazy"
              onLoad={() => {
                // Track video load performance
                if (window.performance) {
                  const videoLoadTime = performance.now();
                  console.log('Video loaded in:', videoLoadTime, 'ms');
                }
              }}
            />
          </>
        ) : (
          <div className="flex justify-center items-center bg-gray-100 dark:bg-gray-800 rounded-lg w-full h-full">
            <div className="py-8 px-4 w-full max-w-md text-center">
              <div className="relative mx-auto" style={{ maxWidth: '400px' }}>
                <div style={{ paddingBottom: '75%' }} className="relative">
                  {isClient && (
                    <Image
                      src="/images/no-video.png"
                      alt="No video content available"
                      fill
                      sizes="(max-width: 640px) 90vw, (max-width: 768px) 70vw, 400px"
                      priority={false}
                      className="object-contain absolute inset-0"
                    />
                  )}
                </div>
                <p className="text-center text-gray-500 mt-4 text-sm sm:text-base">
                  No video content available
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
