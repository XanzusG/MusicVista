import { buildApiUrl, ApiResponse, PaginatedResponse } from './apiConfig';
 
export interface Track {
  id: string;
  name: string;
  album_id: string;
  album_name: string;
  artist_ids: string[];
  artist_names: string[];
  energy?: number;
  danceability?: number;
  valence?: number;
  duration_ms?: number;
  explicit: boolean;
  key?: number;
  mode?: number;
  time_signature?: number;
  loudness?: number;
  speechiness?: number;
  acousticness?: number;
  instrumentalness?: number;
  liveness?: number;
  tempo?: number;
  lyrics?: string;
  release_date?: string;
  similarity?: number;
}
export interface TrackSearchParams {
    searchTerm?: string;
    emotionFilter?: 'Frantic' | 'Tense' | 'Euphotic' | 'Upset' | 'Calm' | 'Cheerful' | 'Bleak' | 'Apathetic' | 'Serene' | 'All' | 'Other';
    // minPopularity?: number;
    // maxPopularity?: number;
    // minEnergy?: number;
    // maxEnergy?: number;
    // minDanceability?: number;
    // maxDanceability?: number;
    // minValence?: number;
    // maxValence?: number;
    // minDuration?: number;
    // maxDuration?: number;
    // explicit?: boolean;
    sortBy?: 'release_date' | 'name' | 'duration_ms';
    sortOrder?: string;
    limit?: number;
    offset?: number;
} 
export async function searchTracks(params: TrackSearchParams): Promise<ApiResponse<Track[]>> {
  const queryParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      queryParams.append(key, String(value));
    }
  });
  const url = buildApiUrl(`tracks/search${queryParams.toString() ? `?${queryParams}` : ''}`);
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });   
  const data = await response.json();
  return data;
}

export interface TracksByArtistParams {
  artistId: string;
  limit?: number;
offset?: number;
}
export async function getTracksByArtist(params: TracksByArtistParams): Promise<ApiResponse<Track[]>> {
  const { artistId, limit = 10, offset = 0 } = params;
  const url = buildApiUrl(`artists/${artistId}/tracks?limit=${limit}&offset=${offset}`);
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });   
  const data = await response.json();
  return data;
}

export async function getTrackCountByArtist(artistId: string): Promise<ApiResponse<number>> {
  const url = buildApiUrl(`artists/${artistId}/tracks/count`);
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });   
  const data = await response.json();
  return data;
}

export async function getTrackById(trackId: string): Promise<ApiResponse<Track>> {
  const url = buildApiUrl(`tracks/${trackId}`);
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });   
  const data = await response.json();
  return data;
}

export async function getLyricsByTrackId(trackId: string): Promise<ApiResponse<string>> {
  const url = buildApiUrl(`tracks/${trackId}/lyrics`);
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });   
  const data = await response.json();
  return data;
}

export async function getTrackCount(params: TrackSearchParams): Promise<ApiResponse<number>> {
  const queryParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      queryParams.append(key, String(value));
    }
  });
  const url = buildApiUrl(`tracks/count${queryParams.toString() ? `?${queryParams}` : ''}`);
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });   
  const data = await response.json();
  return data;
}

export async function getSimilarTracks(trackId: string, limit: number = 3): Promise<ApiResponse<Track[]>> {
  const url = buildApiUrl(`tracks/${trackId}/similar?limit=${limit}`);
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });   
  const data = await response.json();
  return data;
}