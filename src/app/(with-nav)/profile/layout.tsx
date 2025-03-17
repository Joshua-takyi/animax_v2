'use client';
import AnimeSidebar from '@/components/recommendation';
import { Wrapper } from '@/components/wrapper';
import { useParams } from 'next/navigation';
import React from 'react';

export default function Layout({ children }: Readonly<{ children: React.ReactNode }>) {
  const params = useParams();
  const id = params.id as string;
  return (
    <main>
      <Wrapper className="flex">
        <div className="prose max-w-none flex-1">{children}</div>
        <AnimeSidebar animeId={id} />
      </Wrapper>
    </main>
  );
}
