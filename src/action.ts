"use server";
import { cache } from "react";
const API = process.env.API_URL;

const fetchWithRetry = cache(async (url: string, retries = 3, delay = 1000) => {
  try {
    const fetchOptions = {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      next: {
        revalidate: 3600 * 2, // 2 hours
        tags: ["anime-data"],
      },
    };

    const response = await fetch(url, fetchOptions);

    if (response.status === 429 && retries > 0) {
      console.log(
        `Rate limited. Retrying in ${delay}ms... (${retries} retries left)`
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

const fetchWithCache = fetchWithRetry;

export interface MovieProps {
  mal_id: number;
  title?: string;
  title_english?: string;
  rating?: string;
  score?: number;
  status?: string;
  synopsis?: string;
  title_japanese?: string;
  episodes?: number;
  aired: {
    string: string;
  };
  type?: string;
  genres?: { mal_id: number; name: string }[];
  images: {
    jpg: {
      large_image_url: string;
    };
  };
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
    const params = new URLSearchParams({
      q: q || "",
      type: type || "",
      rating: rating || "",
      status: status || "",
      page: page?.toString() || "1",
      limit: limit?.toString() || "18",
      genres: genres || "",
      order_by: order_by || "",
    });

    // Remove empty params
    for (const [key, value] of Array.from(params.entries())) {
      if (!value) params.delete(key);
    }

    const res = await fetchWithCache(`${API}/anime?${params.toString()}`);

    return {
      data: res.data || [],
      success: true,
      message: "Movies fetched successfully",
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
    const params = new URLSearchParams();
    if (limit) params.append("limit", limit.toString());
    if (filter) params.append("filter", filter);
    if (type) params.append("type", type);

    const url = `${API}/seasons/now?${params.toString()}`;
    const data = await fetchWithCache(url);

    return {
      data: data.data || [],
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
      `${API}/anime/${id}/recommendations?limit=${limit}&order_by=${order_by}`
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

export async function GetCharacterInfo({
  id,
}: Readonly<{ id: string }>): Promise<GetAnimeResponse> {
  try {
    const res = await fetchWithCache(`${API}/anime/${id}/characters`);
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
    const params = new URLSearchParams();
    if (limit) params.append("limit", limit.toString());
    if (filter) params.append("filter", filter);
    if (continuing !== undefined)
      params.append("continuing", continuing.toString());

    const uri = `${API}/seasons/upcoming?${params.toString()}`;
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
    const params = new URLSearchParams();
    if (limit) params.append("limit", limit.toString());
    if (filter) params.append("filter", filter);
    if (type) params.append("type", type);

    const uri = `${API}/top/anime?${params.toString()}`;
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
      data: res.results || [],
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
    const params = new URLSearchParams();
    if (query) params.append("q", query);
    if (genre) params.append("genres", genre);

    const res = await fetchWithCache(`${API}/anime?${params.toString()}`);
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
