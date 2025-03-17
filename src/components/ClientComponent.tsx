/**
 * ClientComponent
 *
 * A utility component that ensures its children only render on the client side.
 * Prevents hydration errors when accessing browser-only APIs like window.
 */
'use client';

import { ReactNode, useEffect, useState } from 'react';

interface ClientComponentProps {
  children: ReactNode;
}

export default function ClientComponent({ children }: ClientComponentProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    // Return null or a placeholder during server-side rendering
    return null;
  }

  return <>{children}</>;
}
