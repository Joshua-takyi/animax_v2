"use server";
import axios, { AxiosError } from "axios";
import { cache } from "react";
const API = process.env.API_URL;
const fetchWithRetry = cache(async (url: string, retries = 3, delay = 1000) => {
  try {
    // Determine if we're in a browser environment
    // const isBrowser = typeof window !== 'undefined';

    // Only use revalidate option on the server side
    const fetchOptions = {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      next: {
        // Increase revalidation time to reduce unnecessary server fetches
        revalidate: 3600 * 2, // 2 hours
        tags: ["anime-data"],
      },
    };

    const response = await fetch(url, fetchOptions);

    if (response.status === 429 && retries > 0) {
      console.log(
        `Rate limited. Retrying in ${delay}ms... (${retries} retries left)`,
      );
      await new Promise((resolve) => setTimeout(resolve, delay));
      return fetchWithRetry(url, retries - 1, delay * 2);
    }

    if (!response.ok) {
      throw new Error(`Failed to fetch: ${response.status}`);
    }

    return response.json();
  } catch (error) {
    throw error;
  }
});

// Replace the old fetchWithCache with our new implementation
const fetchWithCache = fetchWithRetry;

// get [movies,series,ove,types,q]
export interface MovieProps {
  mal_id: number;
  title: string;
  rating: string;
  score: number;
  status: string;
  synopsis: string;
  title_japanese: string;
  episodes: number;
  aired: {
    string: string;
  };
  type: string;
  genres?: { mal_id: number; name: string }[];
  images: {
    jpg: {
      large_image_url: string;
    };
  };
  // ... other properties as needed
}

type GetAnimeResponse = {
  data: MovieProps[] | [];
  success: boolean;
  message: string;
};

export async function GetAnime({
  q,
  type,
  rating,
  status,
  page,
  limit = 18,
  genres,
  order_by,
}: {
  q: string;
  type: string;
  rating: string;
  status: string;
  page: number;
  limit: number;
  genres: string;
  order_by: string;
}): Promise<GetAnimeResponse> {
  try {
    const res = await axios.get(`${API}/anime?`, {
      params: {
        q,
        type,
        rating,
        status,
        page,
        limit,
        genres,
        order_by,
      },
    });
    if (res.status === 200) {
      // Successfully fetched data
      return {
        data: res.data.data || [],
        success: true,
        message: "Movies fetched successfully",
      };
    }
    // Handle non-200 responses
    return {
      data: [],
      success: false,
      message: `Request failed with status: ${res.status}`,
    };
  } catch (error) {
    if (axios.AxiosError) {
      const axiosError = error as AxiosError<{ message: string }>;
      let errorMessage = axiosError.response?.data.message;
      if (axiosError.response?.status === 404) {
        errorMessage = "No data found";
      }
      return {
        data: [],
        success: false,
        message: errorMessage || "An unknown error occurred",
      };
    }

    return {
      data: [],
      success: false,
      message:
        error instanceof Error ? error.message : "An unknown error occurred",
    };
  }
}

interface GetSeasonNowProps {
  limit?: number;
  filter?: string;
  type?: string;
}
export async function GetSeasonNow({
  limit,
  filter,
  type,
}: Readonly<GetSeasonNowProps>): Promise<GetAnimeResponse> {
  try {
    // Construct the URL
    const url = `${API}/seasons/now?limit=${limit}&filter=${filter}&type=${type}`;

    // Use axios for consistent parameter handling across functions
    const data = await fetchWithCache(url);

    return {
      data: data.data || [], // Access data properly from axios response
      success: true,
      message: "Top Anime fetched successfully",
    };
  } catch (error) {
    return {
      data: [],
      success: false,
      message:
        error instanceof Error ? error.message : "An unknown error occurred",
    };
  }
}

// get anime recommendations
interface GetAnimeRecommendationProps {
  order_by?: string;
  id: string;
  limit?: number;
}
export async function GetAnimeRecommendations({
  order_by = "popularity",
  id,
  limit = 10,
}: Readonly<GetAnimeRecommendationProps>): Promise<GetAnimeResponse> {
  try {
    const data = await fetchWithCache(
      `${API}/anime/${id}/recommendations?limit=${limit}&order_by=${order_by}`,
    );
    return {
      data: data.data || [],
      message: "Anime recommendations fetched successfully",
      success: true,
    };
  } catch (error) {
    return {
      message:
        error instanceof Error ? error.message : "An unknown error occurred",
      success: false,
      data: [],
    };
  }
}

// get character information
export async function GetCharacterInfo({
  id,
}: Readonly<{ id: string }>): Promise<GetAnimeResponse> {
  try {
    const res = await fetchWithCache(`${API}/anime/${id}/characters`);
    // if (res.status === 200)
    return {
      data: res.data || [],
      message: "Character information fetched successfully",
      success: true,
    };
  } catch (error) {
    return {
      data: [],
      message:
        error instanceof Error ? error.message : "An unknown error occurred",
      success: false,
    };
  }
}

export async function GetAnimeById({
  id,
}: {
  id: string;
}): Promise<GetAnimeResponse> {
  try {
    const res = await fetchWithCache(`${API}/anime/${id}`);
    // if (res.status === 200) {
    return {
      success: true,
      message: "Anime fetched successfully",
      data: res.data || [],
    };
  } catch (error) {
    return {
      data: [],
      message:
        error instanceof Error ? error.message : "An unknown error occurred",
      success: false,
    };
  }
}
interface GetAnimeBySeasonProps {
  filter?: string;
  limit?: number;
  continuing?: boolean;
}

export async function GetUpcomingAnime({
  filter,
  limit = 5,
  continuing = true,
}: Readonly<GetAnimeBySeasonProps>): Promise<GetAnimeResponse> {
  try {
    const uri = `${API}/seasons/upcoming?limit=${limit}&filter=${filter}&continuing=${continuing}`;
    const res = await fetchWithCache(uri);
    return {
      success: true,
      message: "Upcoming Anime fetched successfully",
      data: res.data || [],
    };
  } catch (error) {
    return {
      data: [],
      message:
        error instanceof Error ? error.message : "An unknown error occurred",
      success: false,
    };
  }
}

interface GetTopAnimeProps {
  filter?: string;
  limit?: number;
  type?: string;
}
export async function GetTopAnime({
  filter = "bypopularity",
  limit = 5,
  type,
}: Readonly<GetTopAnimeProps>): Promise<GetAnimeResponse> {
  try {
    const uri = `${API}/top/anime?limit=${limit}&filter=${filter}&type=${type}`;
    const data = await fetchWithCache(uri);
    return {
      data: data.data || [],
      success: true,
      message: "Top Anime fetched successfully",
    };
  } catch (error) {
    return {
      data: [],
      message:
        error instanceof Error ? error.message : "An unknown error occurred",
      success: false,
    };
  }
}

const localUrl =
  process.env.NODE_ENV === "production"
    ? process.env.NEXT_PUBLIC_DOMAIN
    : process.env.NEXT_PUBLIC_URL;
export async function TelegramLinks({
  query,
}: {
  query: string;
}): Promise<GetAnimeResponse> {
  try {
    const res = await fetchWithCache(`${localUrl}/telegram?q=${query}`);
    return {
      data: res.results || [], // Access the results property from the API response
      message: "Telegram links fetched successfully",
      success: true,
    };
  } catch (error) {
    return {
      data: [],
      message:
        error instanceof Error ? error.message : "An unknown error occurred",
      success: false,
    };
  }
}
interface GetAnimeBySearchProps {
  query?: string;
  genre?: string;
}
export async function GetAnimeBySearch({
  query,
  genre,
}: GetAnimeBySearchProps): Promise<GetAnimeResponse> {
  try {
    // Fixed parameter name from 'genres' to 'genre' to match interface definition
    const res = await fetchWithCache(`${API}/anime?q=${query}&genres=${genre}`);
    return {
      data: res.data || [],
      success: true,
      message: "Anime fetched successfully",
    };
  } catch (error) {
    return {
      data: [],
      message:
        error instanceof Error ? error.message : "An unknown error occurred",
      success: false,
    };
  }
}

export async function GetAnimeEpisodesById({
  animeId,
}: {
  animeId: string;
}): Promise<GetAnimeResponse> {
  try {
    const res = await fetchWithCache(`${API}/anime/${animeId}/episodes`);
    return {
      data: res.data || [],
      success: true,
      message: "Episodes fetched successfully",
    };
  } catch (error) {
    return {
      data: [],
      message:
        error instanceof Error ? error.message : "An unknown error occurred",
      success: false,
    };
  }
}
