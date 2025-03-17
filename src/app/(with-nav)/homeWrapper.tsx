import React from 'react';

const HomeWrapper = ({ children }: { children: React.ReactNode }) => {
  return <div className=" w-full px-4 md:px-6  ">{children}</div>;
};

export default HomeWrapper;
