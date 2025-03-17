'use client';

import * as React from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Toggle } from '@/components/ui/toggle';

export function ModeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const isDarkMode = theme === 'dark';

  return (
    <Tooltip delayDuration={300}>
      <TooltipTrigger asChild>
        <Toggle
          aria-label="Toggle theme"
          variant="outline"
          size="sm"
          pressed={isDarkMode}
          onPressedChange={() => setTheme(isDarkMode ? 'light' : 'dark')}
          className="bg-transparent border-none hover:bg-slate-200 dark:hover:bg-slate-800 p-2 rounded-full"
        >
          {isDarkMode ? (
            <Moon className="h-4 w-4 text-blue-500" />
          ) : (
            <Sun className="h-4 w-4 text-yellow-500" />
          )}
        </Toggle>
      </TooltipTrigger>
      <TooltipContent side="bottom" className="text-xs">
        {isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
      </TooltipContent>
    </Tooltip>
  );
}
