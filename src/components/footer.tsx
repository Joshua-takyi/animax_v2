"use client";

import React from "react";
import Link from "next/link";
import { Button } from "./ui/button";
import { Github, Linkedin, Mail } from "lucide-react";

/**
 * Footer component for the Anime Portfolio website
 * Provides site navigation, contact information, and social links
 * SEO optimized with semantic HTML and structured data
 */
export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer
      className="w-full border-t border-border/40 bg-background/50 backdrop-blur-sm"
      aria-label="Site footer"
      itemScope
      itemType="https://schema.org/WPFooter"
    >
      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-4 lg:gap-12">
          {/* Brand & Description */}
          <div className="space-y-4 md:col-span-2">
            <Link href="/" className="flex items-center gap-2 group w-fit">
              <div className="w-8 h-8 rounded-xl bg-primary flex items-center justify-center text-primary-foreground font-bold shadow-lg shadow-primary/20 transition-transform group-hover:scale-105">
                A
              </div>
              <span className="text-lg font-bold tracking-tight">Animax</span>
            </Link>
            <p
              className="text-sm text-muted-foreground max-w-sm leading-relaxed"
              itemProp="description"
            >
              A comprehensive anime database built with Next.js. Discover your
              next favorite series, track seasonal releases, and explore a vast
              library of anime content.
            </p>
          </div>

          {/* Navigation Links */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold tracking-wide uppercase text-foreground/90">
              Explore
            </h3>
            <nav aria-label="Footer navigation">
              <ul
                className="space-y-3"
                itemScope
                itemType="https://schema.org/SiteNavigationElement"
              >
                {[
                  { name: "Home", href: "/" },
                  { name: "Discover", href: "/discover" },
                  { name: "Movies", href: "/movies" },
                  { name: "TV Series", href: "/tv-series" },
                ].map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-primary transition-colors"
                      itemProp="url"
                    >
                      <span itemProp="name">{link.name}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          {/* Connect */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold tracking-wide uppercase text-foreground/90">
              Connect
            </h3>
            <div className="flex flex-col space-y-3">
              <Link
                href="https://github.com/Joshua-takyi"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors group"
              >
                <Github className="h-4 w-4 transition-transform group-hover:scale-110" />
                <span>GitHub</span>
              </Link>
              <Link
                href="https://www.linkedin.com/in/joshua-takyi-548200318/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors group"
              >
                <Linkedin className="h-4 w-4 transition-transform group-hover:scale-110" />
                <span>LinkedIn</span>
              </Link>
              <a
                href="mailto:takyijoshua191@gmail.com"
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors group"
              >
                <Mail className="h-4 w-4 transition-transform group-hover:scale-110" />
                <span>Contact</span>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-border/40 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-muted-foreground">
          <p itemProp="copyrightNotice">
            © {currentYear} Animax. All rights reserved.
          </p>
          <p className="flex items-center gap-1">
            Built with <span className="text-red-500 animate-pulse">❤</span>{" "}
            using Next.js & Tailwind
          </p>
        </div>
      </div>

      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebSite",
            name: "Animax",
            url: "https://animax-v2.vercel.app",
            potentialAction: {
              "@type": "SearchAction",
              target:
                "https://animax-v2.vercel.app/search?q={search_term_string}",
              "query-input": "required name=search_term_string",
            },
          }),
        }}
      />
    </footer>
  );
}
