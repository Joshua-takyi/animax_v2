import React from 'react';

export const Wrapper = ({
  children,
  className,
}: Readonly<{ children: React.ReactNode; className?: string }>) => {
  return <div className={`max-w-[80rem] w-full mx-auto p-3 ${className}`}>{children}</div>;
};
