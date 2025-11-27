"use client";
import { GetAnimeById } from "@/action";
import { CharacterComponent } from "@/components/character";
import { Episode } from "@/components/episode";
import MovieHeader from "@/components/header";
import SummaryComponent from "@/components/summary";
import TelegramLinksComponent from "@/components/telegramLinksComponent";
import VideoSection from "@/components/videoSection";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import Link from "next/link";

interface AnimeData {
  mal_id: string;
  trailer: {
    youtube_id: string;
  };
  genres: {
    mal_id: number;
    name: string;
  }[];
  titles: {
    type: string;
    title: string;
  }[];
  images: {
    jpg: {
      large_image_url: string;
    };
  };
  status: string;
  episodes: number;
  type: string;
  studios: [
    {
      name: string;
    }
  ];
  score: number;
  duration: string;
  aired: {
    string: string;
  };
  popularity: number;
  englishTitle: string;
  japaneseTitle: string;
  synopsis: string;
  rating: string;
  scored_by: number;
  season: string;
}

export default function ProfilePage() {
  const params = useParams();
  const id = params.id as string;

  const { data, error } = useQuery<AnimeData>({
    queryKey: ["AnimeById", id],
    queryFn: async () => {
      const res = await GetAnimeById({
        id: id,
      });
      if (!res.success || !res.data) {
        throw new Error("No data found");
      }
      if (Array.isArray(res.data) && res.data.length === 0) {
        throw new Error("No data found");
      }
      return res.data as unknown as AnimeData;
    },
    staleTime: 1000 * 60 * 60,
    refetchOnWindowFocus: false,
  });

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center h-screen">
        <h1 className="text-xl md:text-2xl text-center px-4 text-destructive">
          Error loading anime data: {error.message}
        </h1>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="animate-pulse">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="p-4 rounded-lg bg-muted/50">
            <div className="flex items-start space-x-4">
              <div className="w-14 h-14 rounded-lg bg-muted"></div>
              <div className="flex-1 space-y-2">
                <div className="h-3 bg-muted rounded w-3/4"></div>
                <div className="h-2 bg-muted rounded w-1/2"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  const japaneseTitle =
    data.titles.find((title) => title.type === "Japanese")?.title ?? "";
  const englishTitle =
    data.titles.find((title) => title.type === "English")?.title ?? "";

  // Generate breadcrumb list
  const breadcrumbs = [
    { name: "Home", href: "/" },
    {
      name: data.type === "Movie" ? "Movies" : "TV Series",
      href: data.type === "Movie" ? "/movies" : "/tv-series",
    },
    { name: englishTitle || japaneseTitle, href: "#" },
  ];

  return (
    <>
      {/* Structured data for breadcrumbs */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: breadcrumbs.map((item, index) => ({
              "@type": "ListItem",
              position: index + 1,
              item: {
                "@id": `https://animax-v2.vercel.app/${item.href}`,
                name: item.name,
              },
            })),
          }),
        }}
      />

      {/* Breadcrumb navigation */}
      <nav aria-label="Breadcrumb" className="py-2 px-4">
        <ol className="flex items-center space-x-2 text-sm">
          {breadcrumbs.map((item, index) => (
            <li
              key={item.href}
              className="flex items-center text-sm font-semibold"
            >
              {index > 0 && <span className="mx-2 text-gray-400">/</span>}
              {index === breadcrumbs.length - 1 ? (
                <span className="text-primary">{item.name}</span>
              ) : (
                <Link
                  href={item.href}
                  className="text-muted-foreground hover:text-primary"
                >
                  {item.name}
                </Link>
              )}
            </li>
          ))}
        </ol>
      </nav>

      <div className="min-h-screen pt-4 xl:pt-10 flex flex-col gap-5 p-4">
        <MovieHeader
          duration={data.aired.string}
          rating={data.rating}
          originalTitle={japaneseTitle}
          title={englishTitle}
          year={data.aired.string}
        />

        {data.trailer?.youtube_id && (
          <VideoSection videoUrl={data.trailer.youtube_id} />
        )}

        <SummaryComponent
          genres={data.genres.map((genre) => genre.name)}
          image={data.images.jpg.large_image_url}
          status={data.status}
          episodes={data.episodes}
          type={data.type}
          studios={data.studios.map((studio) => studio.name)}
          released={data.aired.string}
          rating={data.rating}
          synopsis={data.synopsis}
        />

        <Episode />
        <CharacterComponent />
        <TelegramLinksComponent />
      </div>
    </>
  );
}
