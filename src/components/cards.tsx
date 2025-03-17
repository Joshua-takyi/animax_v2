import { Star } from "lucide-react";

interface AnimeCard {
	title: string;
	image: string;
	rating: number;
	type: string;
	episodes: number;
}
export const AnimeCard = ({
	title,
	image,
	rating,
	type,
	episodes,
}: Readonly<AnimeCard>) => {
	return (
		<div className="group cursor-pointer">
			<div className="relative overflow-hidden rounded-lg h-56 mb-2 group-hover:ring-2 ring-purple-500 transition-all">
				<div
					className="absolute inset-0 bg-cover bg-center transition-transform duration-300 group-hover:scale-110"
					style={{ backgroundImage: `url(${image})` }}
				/>
				<div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
				<div className="absolute top-2 right-2 bg-black/60 px-2 py-1 rounded text-xs text-white">
					{type}
				</div>
			</div>
			<h3 className="text-base font-medium text-white group-hover:text-purple-400 transition-colors line-clamp-1">
				{title}
			</h3>
			<div className="flex items-center gap-1">
				<Star className="w-3 h-3 text-yellow-400" />
				<span className="text-xs text-gray-300">{rating}</span>
				<span className="text-sm text-gray-300">{episodes}</span>
			</div>
		</div>
	);
};
