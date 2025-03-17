interface MovieHeaderProps {
  title: string;
  originalTitle: string;
  year: string;
  rating: string;
  duration: string;
}

export default function MovieHeader({
  title,
  originalTitle,
  year,
  rating,
  duration,
}: Readonly<MovieHeaderProps>) {
  return (
    <div className="py-4 w-full overflow-x-hidden">
      <div className="flex flex-col">
        {/* Title section */}
        <h1 className="text-2xl md:text-4xl font-bold mb-1">{title}</h1>
        <div className="text-sm mb-1">Original title: {originalTitle}</div>

        {/* Movie details */}
        <div className="flex  items-center gap-2 text-sm mb-4 flex-wrap">
          <span>{year}</span>
          <span>•</span>
          <span>{rating}</span>
          <span>•</span>
          <span>{duration}</span>
        </div>
      </div>
    </div>
  );
}
