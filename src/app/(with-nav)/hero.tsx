import { Wrapper } from "@/components/wrapper";
import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative  w-full overflow-hidden rounded-3xl border border-border/40">
      <div className="absolute inset-0 bg-[url(/images/9c8b3044-heroimages-swimlanes-04faves-cotn.jpg)] bg-cover" />
      <Wrapper>
        <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/60 to-transparent" />
        <div className="relative z-10 h-full px-6 py-10 flex flex-col justify-end gap-4 text-white">
          <p className="text-xs uppercase tracking-[0.3em] text-white/70">
            Stream smarter
          </p>
          <h1 className="text-3xl md:text-4xl font-bold max-w-2xl leading-tight">
            Fresh seasonal anime, curated watchlists, and instant
            recommendations.
          </h1>
          <p className="text-white/80 max-w-xl text-sm md:text-base">
            Dive into premieres, keep tabs on trending titles, and discover
            hidden gems sourced directly from the Jikan API catalog.
          </p>
          <div className="flex gap-3 flex-wrap">
            <Link
              href="/discover"
              className="rounded-full bg-white px-5 py-2 text-sm font-semibold text-black transition hover:bg-white/90"
            >
              Explore Discover
            </Link>
            <Link
              href="#season-spotlight"
              className="rounded-full border border-white/50 px-5 py-2 text-sm font-semibold text-white transition hover:border-white"
            >
              Season spotlight
            </Link>
          </div>
        </div>
      </Wrapper>
    </section>
  );
}
