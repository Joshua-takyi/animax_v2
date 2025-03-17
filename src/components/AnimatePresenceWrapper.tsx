'use client';

import { AnimatePresence } from 'framer-motion';
import { ReactNode } from 'react';

interface AnimatePresenceWrapperProps {
  children: ReactNode;
  mode?: 'sync' | 'wait' | 'popLayout';
  initial?: boolean;
  onExitComplete?: () => void;
}

export default function AnimatePresenceWrapper({
  children,
  mode = 'wait',
  initial = true,
  onExitComplete,
}: AnimatePresenceWrapperProps) {
  return (
    <AnimatePresence mode={mode} initial={initial} onExitComplete={onExitComplete}>
      {children}
    </AnimatePresence>
  );
}
