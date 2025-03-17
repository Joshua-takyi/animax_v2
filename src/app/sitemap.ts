import { MetadataRoute } from 'next';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Base URL for the site
  const baseUrl = 'https://animax-v2.vercel.app/';

  // Static routes
  const staticRoutes = ['', '/movies', '/tv-series', '/search'].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: route === '' ? 1 : 0.8,
  }));

  // Get dynamic genre pages
  const genres = [
    'action',
    'adventure',
    'comedy',
    'drama',
    'fantasy',
    'horror',
    'mystery',
    'romance',
    'sci-fi',
    'slice-of-life',
    'sports',
    'supernatural',
    'thriller',
  ];

  const genreRoutes = genres.map((genre) => ({
    url: `${baseUrl}/genre/${genre}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.6,
  }));

  // Combine all routes
  return [...staticRoutes, ...genreRoutes];
}
