'use client';
import { useState } from 'react';
import { ModeToggle } from './modeToggle';
import { usePathname } from 'next/navigation';
import Link from 'next/link'; // Import Next.js Link component
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import SearchInput from './searchInput';
import { Wrapper } from './wrapper';
import { Menu, X } from 'lucide-react';

// Simplified navLinks without submenus
const navLinks = [
  {
    id: 4,
    name: 'Movies',
    href: '/movies',
  },
  {
    id: 5,
    name: 'TV Series',
    href: '/tv-series',
  },
];

export const Navbar = () => {
  const pathName = usePathname();
  const isActive = (href: string) => pathName === href || pathName.startsWith(href + '/');
  const [isOpen, setIsOpen] = useState(false);

  // Toggle mobile menu
  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  // Mobile menu animation variants
  const menuVariants = {
    closed: {
      opacity: 0,
      y: -20,
      height: 0,
      transition: {
        staggerChildren: 0.05,
        staggerDirection: -1,
        when: 'afterChildren',
      },
    },
    open: {
      opacity: 1,
      y: 0,
      height: 'auto',
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1,
        when: 'beforeChildren',
      },
    },
  };

  const itemVariants = {
    closed: { opacity: 0, x: -10 },
    open: { opacity: 1, x: 0 },
  };

  return (
    <nav
      className={cn(
        'sticky top-0  right-0 z-50 border-b transition-all duration-300 ease-in-out bg-background/90 backdrop-blur-md'
      )}
    >
      <Wrapper>
        <div className="flex justify-between items-center  px-4 md:px-0">
          <div className="flex items-center gap-6">
            {/* Replace anchor tag with Link component for the logo */}
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white dark:text-black font-bold transition-transform group-hover:scale-110">
                A
              </div>
              <header className="text-xl font-bold bg-gradient-to-r from-primary to-primary-foreground bg-clip-text text-transparent">
                Animax
              </header>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex gap-2">
              {navLinks.map((link) => (
                <div key={link.id} className="relative py-2 group">
                  {/* Replace anchor tag with Link component */}
                  <Link
                    href={link.href}
                    className={cn(
                      'px-3 py-1.5 rounded-md transition-colors font-sm text-left block',
                      isActive(link.href)
                        ? 'text-primary font-medium bg-primary/10'
                        : 'hover:text-primary hover:bg-muted'
                    )}
                  >
                    <div className="flex items-center gap-1.5">{link.name}</div>
                  </Link>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-4 max-w-[32rem] w-full justify-end">
            <div className="hidden md:block w-full">
              <SearchInput />
            </div>

            {/* Hamburger menu button (mobile only) */}
            <button
              onClick={toggleMenu}
              className="lg:hidden flex items-center justify-center rounded-full w-10 h-10 hover:bg-muted transition-colors z-50"
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

            <ModeToggle />
          </div>
        </div>

        {/* Mobile Search (visible when menu is open) */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="md:hidden p-4 border-b border-border/40"
            >
              <SearchInput />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial="closed"
              animate="open"
              exit="closed"
              variants={menuVariants}
              className="lg:hidden overflow-hidden max-h-[calc(100vh-4rem)] overflow-y-auto"
            >
              <motion.div className="py-2 flex flex-col" variants={menuVariants}>
                {navLinks.map((link) => (
                  <motion.div key={link.id} variants={itemVariants} className="flex flex-col">
                    <div
                      className={cn(
                        'p-4 border-b border-border/40 transition-colors',
                        isActive(link.href)
                          ? 'text-primary font-medium bg-primary/5'
                          : 'hover:bg-muted'
                      )}
                      onClick={() => setIsOpen(false)}
                    >
                      {/* Replace anchor tag with Link component */}
                      <Link href={link.href} className="flex items-center gap-2 flex-1">
                        {link.name}
                        {isActive(link.href) && (
                          <motion.div
                            layoutId="activeIndicatorMobile"
                            className="w-1.5 h-1.5 rounded-full bg-primary"
                          />
                        )}
                      </Link>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </Wrapper>
    </nav>
  );
};
