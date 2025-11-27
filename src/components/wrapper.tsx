import React from "react";

export const Wrapper = ({
  children,
  className,
}: Readonly<{ children: React.ReactNode; className?: string }>) => {
  return (
    <div className={`max-w-[80rem] w-full mx-auto px-4 ${className}`}>
      {children}
    </div>
  );
};
