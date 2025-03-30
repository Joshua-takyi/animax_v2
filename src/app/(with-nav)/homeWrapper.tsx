import React from 'react';
interface HomeWrapperProps {
  children: React.ReactNode;
  className?: string;
}
const HomeWrapper = ({ children, className }: Readonly<HomeWrapperProps>) => {
  return <div className={`w-full px-4 md:px-6 ${className}`}>{children}</div>;
};

export default HomeWrapper;
