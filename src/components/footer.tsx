'use client';

import React from 'react';
import Link from 'next/link';
// import Image from 'next/image';
import { Button } from './ui/button';
import { ModeToggle } from './modeToggle';

/**
 * Footer component for the Anime Portfolio website
 * Provides site navigation, contact information, and social links
 * SEO optimized with semantic HTML and structured data
 */
export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer
      className="w-full border-t border-border/40 relative overflow-hidden"
      aria-label="Site footer"
      itemScope
      itemType="https://schema.org/WPFooter"
    >
      {/* Background overlay with anime-themed pattern */}
      <div className="absolute inset-0 bg-gradient-to-b from-background/90 to-background/95 backdrop-blur-sm z-10"></div>

      {/* Background image with diagonal anime-style pattern */}
      <div
        className="absolute inset-0 opacity-5 dark:opacity-10 z-0 bg-[linear-gradient(135deg,var(--primary-400)_0.5px,transparent_0.5px),linear-gradient(45deg,var(--primary-400)_0.5px,transparent_0.5px)]"
        style={{ backgroundSize: '20px 20px' }}
        aria-hidden="true"
      ></div>

      <div className="container mx-auto px-4 py-6 md:py-8 relative z-20">
        <div className="grid grid-cols-1 gap-6 md:gap-8 md:grid-cols-3 lg:grid-cols-4">
          {/* About section */}
          <div className="space-y-2 md:space-y-3">
            <h2 className="text-base md:text-lg font-semibold" itemProp="name">
              Anime Portfolio
            </h2>
            <p className="text-xs md:text-sm text-muted-foreground" itemProp="description">
              A comprehensive anime database built with Next.js, MongoDB, and the Google Search API.
              Explore your favorite anime series, movies, and more.
            </p>
          </div>

          {/* Quick Links - Using nav for better semantics/SEO */}
          <nav className="space-y-2 md:space-y-3" aria-label="Footer navigation">
            <h2 className="text-base md:text-lg font-semibold">Quick Links</h2>
            <ul
              className="space-y-1.5 md:space-y-2"
              itemScope
              itemType="https://schema.org/SiteNavigationElement"
            >
              <li>
                <Link
                  href="/"
                  className="text-xs md:text-sm text-muted-foreground hover:text-primary transition-colors"
                  itemProp="url"
                >
                  <span itemProp="name">Home</span>
                </Link>
              </li>
              {/* <li>
                <Link
                  href="/airing"
                  className="text-xs md:text-sm text-muted-foreground hover:text-primary transition-colors"
                  itemProp="url"
                >
                  <span itemProp="name">Airing</span>
                </Link>
              </li> */}
              <li>
                <Link
                  href="/movies"
                  className="text-xs md:text-sm text-muted-foreground hover:text-primary transition-colors"
                  itemProp="url"
                >
                  <span itemProp="name">Movies</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/tv-series"
                  className="text-xs md:text-sm text-muted-foreground hover:text-primary transition-colors"
                  itemProp="url"
                >
                  <span itemProp="name">TV Series</span>
                </Link>
              </li>
            </ul>
          </nav>

          {/* Portfolio */}
          <div className="space-y-2 md:space-y-3">
            <h2 className="text-base md:text-lg font-semibold">Portfolio</h2>
            <ul className="space-y-1.5 md:space-y-2">
              <li>
                <Link
                  href="https://github.com/Joshua-takyi"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs md:text-sm text-muted-foreground hover:text-primary transition-colors inline-flex items-center gap-1"
                  aria-label="GitHub profile"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="lucide lucide-github"
                  >
                    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"></path>
                    <path d="M9 18c-4.51 2-5-2-7-2"></path>
                  </svg>
                  GitHub
                </Link>
              </li>
              <li>
                <Link
                  href="https://www.linkedin.com/in/joshua-takyi-548200318/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs md:text-sm text-muted-foreground hover:text-primary transition-colors inline-flex items-center gap-1"
                  aria-label="LinkedIn profile"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="lucide lucide-linkedin"
                  >
                    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                    <rect width="4" height="12" x="2" y="9"></rect>
                    <circle cx="4" cy="4" r="2"></circle>
                  </svg>
                  LinkedIn
                </Link>
              </li>
              {/* <li>
                <Link
                  href="https://yourportfolio.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs md:text-sm text-muted-foreground hover:text-primary transition-colors inline-flex items-center gap-1"
                  aria-label="Portfolio website"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="lucide lucide-briefcase"
                  >
                    <rect width="20" height="14" x="2" y="7" rx="2" ry="2"></rect>
                    <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
                  </svg>
                  Portfolio Website
                </Link>
              </li> */}
            </ul>
          </div>

          {/* Newsletter / Contact */}
          <div className="space-y-2 md:space-y-3">
            <h2 className="text-base md:text-lg font-semibold">Get in Touch</h2>
            <p className="text-xs md:text-sm text-muted-foreground">
              Have questions or want to collaborate on a project?
            </p>
            <div className="flex flex-wrap gap-2">
              {/* Fixed mailto link by simplifying the button setup */}
              <Button
                variant="outline"
                size="sm"
                asChild
                className="hover:bg-primary hover:text-primary-foreground"
              >
                <a href="mailto:takyijoshua191@gmail.com">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="mr-1"
                  >
                    <rect width="20" height="16" x="2" y="4" rx="2"></rect>
                    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
                  </svg>
                  Contact Me
                </a>
              </Button>
              <ModeToggle />
            </div>
          </div>
        </div>

        {/* Bottom section with copyright */}
        <div className="mt-6 md:mt-8 border-t border-border/40 pt-4 md:pt-6 flex flex-col sm:flex-row justify-between items-center">
          <p className="text-xs md:text-sm text-muted-foreground" itemProp="copyrightNotice">
            © {currentYear} Anime Portfolio. All rights reserved.
          </p>
          <p className="text-xs text-muted-foreground mt-2 sm:mt-0">
            Designed & Developed with <span className="text-red-500">❤️</span> | Built with Next.js
            and Tailwind CSS
          </p>
        </div>
      </div>

      {/* Structured data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'WebSite',
            name: 'Anime Portfolio',
            url: 'https://animeportfolio.com',
            potentialAction: {
              '@type': 'SearchAction',
              target: 'https://animeportfolio.com/search?q={search_term_string}',
              'query-input': 'required name=search_term_string',
            },
          }),
        }}
      />
    </footer>
  );
}
