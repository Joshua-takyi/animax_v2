"use client";
import { useState, useEffect } from "react";
import { ModeToggle } from "./modeToggle";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { cn } from "../lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import SearchInput from "./searchInput";
import { Wrapper } from "./wrapper";
import { Menu, X } from "lucide-react";

// Simplified navLinks
const navLinks = [
  { id: 1, name: "Discover", href: "/discover" },
  { id: 2, name: "Movies", href: "/movies" },
  { id: 3, name: "TV Series", href: "/tv-series" },
];

export const Navbar = () => {
  const pathName = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on path change
  useEffect(() => {
    setIsOpen(false);
  }, [pathName]);

  const isActive = (href: string) =>
    pathName === href || pathName.startsWith(href + "/");

  return (
    <nav
      className={cn(
        "sticky top-0 right-0 z-50 border-b border-transparent transition-all duration-300 ease-in-out",
        scrolled || isOpen
          ? "bg-background/80 backdrop-blur-lg border-border/40"
          : "bg-transparent"
      )}
    >
      <Wrapper>
        <div className="flex justify-between items-center h-16 px-4 md:px-0">
          {/* Logo & Desktop Nav */}
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-8 h-8 rounded-xl bg-primary flex items-center justify-center text-primary-foreground font-bold shadow-lg shadow-primary/20 transition-transform group-hover:scale-105">
                A
              </div>
              <span className="text-lg font-bold tracking-tight">Animax</span>
            </Link>

            <div className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.id}
                  href={link.href}
                  className={cn(
                    "px-4 py-2 rounded-full text-sm font-medium transition-all",
                    isActive(link.href)
                      ? "text-primary bg-primary/10"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                  )}
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center gap-3">
            <div className="hidden md:block w-64 lg:w-72">
              <SearchInput />
            </div>

            <div className="hidden sm:block">
              <ModeToggle />
            </div>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="lg:hidden p-2 rounded-full hover:bg-muted transition-colors"
              aria-label="Toggle menu"
            >
              <AnimatePresence mode="wait">
                {isOpen ? (
                  <motion.div
                    key="close"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <X size={20} />
                  </motion.div>
                ) : (
                  <motion.div
                    key="menu"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Menu size={20} />
                  </motion.div>
                )}
              </AnimatePresence>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="lg:hidden overflow-hidden border-t border-border/40"
            >
              <div className="py-4 space-y-4 px-4">
                <div className="md:hidden">
                  <SearchInput />
                </div>
                <div className="flex flex-col gap-2">
                  {navLinks.map((link) => (
                    <Link
                      key={link.id}
                      href={link.href}
                      className={cn(
                        "px-4 py-3 rounded-xl text-sm font-medium transition-all flex items-center justify-between",
                        isActive(link.href)
                          ? "bg-primary/10 text-primary"
                          : "hover:bg-muted text-muted-foreground hover:text-foreground"
                      )}
                    >
                      {link.name}
                      {isActive(link.href) && (
                        <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                      )}
                    </Link>
                  ))}
                </div>
                <div className="flex items-center justify-between pt-4 border-t border-border/40 sm:hidden">
                  <span className="text-sm text-muted-foreground">Theme</span>
                  <ModeToggle />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </Wrapper>
    </nav>
  );
};
