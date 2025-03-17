'use client';
// import { Metadata } from 'next';
import Genres from '@/components/gen';
import { useParams } from 'next/navigation';

export default function GenresPage() {
  const id = useParams().id as string;

  return (
    <div>
      <Genres genreId={id} />
    </div>
  );
}
