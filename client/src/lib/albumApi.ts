import { buildApiUrl, ApiResponse, PaginatedResponse } from './apiConfig';

export interface Album {
  id: string;
  name: string;
  artist_ids: string[];
  artist_names: string[];
  release_date: string;
  popularity: number;
  urls?: string[];
  num_tracks: number;
  type: string;
}

export interface SearchAlbumsParams {
  searchTerm?: string;
  typeFilter?: 'single' | 'album' | 'compilation' | 'all';
  sortBy?: 'popularity' | 'release_date' | 'name';
  sortOrder?: 'ASC' | 'DESC';
  limit?: number;
  offset?: number;
}

// async function apiRequest<T>(endpoint: string, errorMessage: string): Promise<T> {
//   const url = buildApiUrl(endpoint);
//   const response = await fetch(url, {
//     method: 'GET',
//     headers: {
//       'Content-Type': 'application/json',
//     },
//   });

//   if (!response.ok) {
//     throw new Error(`${errorMessage}: ${response.statusText}`);
//   }

//   return response.json();
// }

export async function searchAlbums(params: SearchAlbumsParams): Promise<ApiResponse<Album[]>> {
  const queryParams = new URLSearchParams();
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        queryParams.append(key, String(value));
      }
    });
  }
  const url = buildApiUrl(`albums/search${queryParams.toString() ? `?${queryParams}` : ''}`);
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  const data = await response.json();
  return data;
}

export async function getAlbumsByArtist({artistId, limit = 10, offset = 0}: {artistId: string, limit?: number, offset?: number}): Promise<ApiResponse<Album[]>> {
  const url = buildApiUrl(`artists/${artistId}/albums?limit=${limit}&offset=${offset}`);
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  const data = await response.json();
  return data;
}

export async function getAlbumCountByArtist(artistId: string): Promise<ApiResponse<number>> {
  const url = buildApiUrl(`artists/${artistId}/albums/count`);
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  const data = await response.json();
  return data;
}

export async function getAlbumById(albumId: string): Promise<ApiResponse<Album>> {
  const url = buildApiUrl(`albums/${albumId}`);
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  const data = await response.json();
  return data;
}

export async function getTracksByAlbum(albumId: string): Promise<ApiResponse<any[]>> {
  const url = buildApiUrl(`albums/${albumId}/tracks`);
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  const data = await response.json();
  return data;
}

export async function getRecentAlbums(limit: number = 10): Promise<ApiResponse<Album[]>> {
  const url = buildApiUrl(`albums/recent?limit=${limit}`);
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  const data = await response.json();
  return data;
}

export async function getAlbumCount(params: SearchAlbumsParams): Promise<ApiResponse<number>> {
  const queryParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      queryParams.append(key, String(value));
    }
  });

  const url = buildApiUrl(`albums/count${queryParams.toString() ? `?${queryParams}` : ''}`);
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  const data = await response.json();
  return data;
}

export async function getTypeDistributionFromSearch(params: SearchAlbumsParams): Promise<ApiResponse<any[]>> {
  const queryParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      queryParams.append(key, String(value));
    }
  });
  const url = buildApiUrl(`albums/search/type-distribution${queryParams.toString() ? `?${queryParams}` : ''}`);
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  const data = await response.json();
  return data;
}