import GenresComponent from '@/components/genres';
import Airing from './airing';
import Popularity from './byPopularity';
import Favorite from './favorite';
import Hero from './hero';
import FavMovies from './movies';
import Trending from './trending';
import Upcoming from './upcomingMovies';
import HomeWrapper from './homeWrapper';
import PostGridComponent from '@/components/postGridComponent';

export default function Home() {
  return (
    <div>
      <Hero />
      <HomeWrapper className="flex flex-col  space-y-10">
        <section className="mt-5 flex flex-col lg:gap-y-10 gap-y-5">
          <Trending />
          <Upcoming />
        </section>
        <section className="grid md:grid-cols-3 lg:grid-cols-4 gap-2 grid-cols-1 mt-5">
          <Favorite />
          <Popularity />
          <Airing />
          <FavMovies />
        </section>
        <div className="flex px-2 gap-y-5 gap-x-2 mt-5">
          <div className="flex-1 flex flex-col gap-5">
            <PostGridComponent title="movies" type="movie" />
            <PostGridComponent title="Tv series" type="tv" />
            <PostGridComponent title="special" type="special" />
          </div>
          <aside className="hidden lg:flex flex-col ">
            <GenresComponent />
          </aside>
        </div>
      </HomeWrapper>
    </div>
  );
}
