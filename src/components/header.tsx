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
    <header className="py-4 w-full overflow-x-hidden">
      <div className="flex flex-col text-xs" itemScope itemType="https://schema.org/Movie">
        {/* Title section with structured data */}
        <h1 className="text-2xl md:text-4xl font-bold mb-1" itemProp="name">
          {title}
        </h1>
        <div className="text-sm mb-1">
          Original title: <span itemProp="alternateName">{originalTitle}</span>
        </div>

        {/* Movie details with structured data */}
        <div className="flex items-center gap-2 text-sm mb-4 flex-wrap">
          <meta itemProp="datePublished" content={year} />
          <span>{year}</span>
          <span aria-hidden="true">•</span>
          <meta itemProp="contentRating" content={rating} />
          <span>{rating}</span>
          <span aria-hidden="true">•</span>
          <meta itemProp="duration" content={`PT${duration}`} />
          <span>{duration}</span>
        </div>
      </div>
    </header>
  );
}
