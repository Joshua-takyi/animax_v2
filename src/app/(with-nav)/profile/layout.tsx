'use client';

import AnimeSidebar from '@/components/recommendation';
import { Wrapper } from '@/components/wrapper';
import { useParams, usePathname } from 'next/navigation';
import React from 'react';
import Head from 'next/head';

export default function Layout({ children }: Readonly<{ children: React.ReactNode }>) {
  const params = useParams();
  const pathname = usePathname();
  const id = params.id as string;

  // Generate canonical URL
  const canonicalUrl = `https://animax-v2.vercel.app/${pathname}`;

  return (
    <main>
      <Head>
        {/* Ensure proper canonical URL */}
        <link rel="canonical" href={canonicalUrl} />

        {/* Add JSON-LD structured data for better search results */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebPage',
              name: 'Anime Details',
              url: canonicalUrl,
              isPartOf: {
                '@type': 'WebSite',
                name: 'Animax',
                url: 'https://animax-v2.vercel.app/',
              },
            }),
          }}
        />
      </Head>

      <Wrapper className="flex">
        <div className="prose max-w-none flex-1">{children}</div>
        <AnimeSidebar animeId={id} />
      </Wrapper>
    </main>
  );
}
