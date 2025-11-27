// Define the structure of anime data from the API
export interface AnimeProps {
  data: AnimeData[];
  text: string;
  body: string;
}

export interface AnimeData {
  mal_id: string;
  trailer: {
    youtube_id: string;
  };
  genres: {
    mal_id: number;
    name: string;
  }[];
  title_english: string;
  title_japanese?: string;
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

// Define arrow component props
export interface ArrowProps {
  onClick?: () => void;
  isDisabled?: boolean;
}

export interface CardProps {
  title_english: string | null; // Make it nullable since the API might return null
  title?: string | null;
  images: {
    jpg: {
      large_image_url: string;
    };
  };
  mal_id: number;
  rating: string | null;
  type?: string;
  synopsis?: string;
  title_japanese?: string;
  score?: number;
  status?: string;
  aired?: {
    string: string;
  };
  genres?: {
    mal_id: number;
    name: string;
  }[];
  episodes?: number;
}
