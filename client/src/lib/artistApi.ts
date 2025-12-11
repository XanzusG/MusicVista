import { off } from 'process';
import { buildApiUrl, ApiResponse, PaginatedResponse } from './apiConfig';

export interface Artist {
  id: string;
  name: string;
  popularity: number;
  followers: number;
  genres?: string[];
  urls?: string[];
  album_num?: number;
  track_num?: number;
  collab_num?: number;
}

interface SearchArtistsParams {
  searchTerm?: string;
  limit?: number;
  offset?: number;
  page?: number;
  includeGenres?: boolean;
  genreFilter?: string;
  sortBy?: 'popularity' | 'name' | 'followers';
  sortOrder?: 'ASC' | 'DESC';
  ids?: string[];
}

/**
 * Generic HTTP GET request function
 */
async function apiRequest<T>(endpoint: string, errorMessage: string): Promise<T> {
  const url = buildApiUrl(endpoint);
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`${errorMessage}: ${response.statusText}`);
  }

  return response.json();
}

export async function getArtistById(artistId: string): Promise<ApiResponse<Artist>> {
  return apiRequest<ApiResponse<Artist>>(`artists/${artistId}`, 'Failed to get artist details');
}

export async function getTrendingArtists(limit: number = 10): Promise<ApiResponse<Artist[]>> {
  return apiRequest<ApiResponse<Artist[]>>(`artists/trending?limit=${limit}`, 'Failed to get trending artists');
}
// export async function getTrendingArtists(limit: number = 20): Promise<Artist[]> {
//   const url = buildApiUrl(`artists/trending?limit=${limit}`);
//   const response = await fetch(url, {
//     method: 'GET',
//     headers: {
//       'Content-Type': 'application/json',
//     },
//   });

//   if (!response.ok) {
//     throw new Error(`Failed to get trending artists: ${response.statusText}`);
//   }
//   const result = await response.json();
//   return result.data;
// }

export async function searchArtists(query: SearchArtistsParams): Promise<ApiResponse<Artist[]>> {
  return apiRequest<ApiResponse<Artist[]>>(`artists/search?searchTerm=${encodeURIComponent(query.searchTerm || '')}&limit=${query.limit || 10}&offset=${query.offset || 0}&includeGenres=${query.includeGenres || true}&genreFilter=${encodeURIComponent(query.genreFilter || '')}&sortBy=${query.sortBy || 'popularity'}&sortOrder=${query.sortOrder || 'DESC'}`, 'Failed to search artists');
}

export async function getArtistCount(params: SearchArtistsParams): Promise<ApiResponse<number>> {
  return apiRequest<ApiResponse<number>>(`artists/count?searchTerm=${encodeURIComponent(params.searchTerm || '')}&genreFilter=${encodeURIComponent(params.genreFilter || '')}`, 'Failed to get artist count');
}

// export async function getRangeAnalytics(params: SearchArtistsParams): Promise<ApiResponse<any>> {
//   console.log(params);
//   return apiRequest<ApiResponse<any>>(`artists/analytics?searchTerm=${encodeURIComponent(params.searchTerm || '')}&genreFilter=${encodeURIComponent(params.genreFilter || '')}&includeGenres=${params.includeGenres || true}&sortBy=${params.sortBy || 'popularity'}&sortOrder=${params.sortOrder || 'DESC'}&ids=${encodeURIComponent(params.ids? params.ids[0] : '')}`, 'Failed to get range analytics');
// }
export async function getGenreDistribution(params: SearchArtistsParams): Promise<ApiResponse<any[]>> {
  return apiRequest<ApiResponse<any[]>>(`artists/genre-distribution?searchTerm=${encodeURIComponent(params.searchTerm || '')}&genreFilter=${encodeURIComponent(params.genreFilter || '')}&ids=${encodeURIComponent(params.ids? params.ids[0] : '')}`, 'Failed to get genre distribution');
}
export async function getEmotionDistribution(params: SearchArtistsParams): Promise<ApiResponse<any[]>> {
  return apiRequest<ApiResponse<any[]>>(`artists/emotion-distribution?searchTerm=${encodeURIComponent(params.searchTerm || '')}&genreFilter=${encodeURIComponent(params.genreFilter || '')}&ids=${encodeURIComponent(params.ids? params.ids[0] : '')}`, 'Failed to get emotion distribution');
}
export async function getEmotionDistributionById(artistId: string): Promise<ApiResponse<any[]>> {
  return apiRequest<ApiResponse<any[]>>(`artists/${artistId}/emotion-distribution`, 'Failed to get emotion distribution by artist ID');
}
export async function getGenreDistributionById(artistId: string): Promise<ApiResponse<any[]>> {
  return apiRequest<ApiResponse<any[]>>(`artists/${artistId}/genre-distribution`, 'Failed to get genre distribution by artist ID');
}

export async function getGenreCount(): Promise<ApiResponse<number>> {
  return apiRequest<ApiResponse<number>>(`artists/genres/count`, 'Failed to get artist genre count');
}

// export async function getRangeAnalytics(params: SearchArtistsParams): Promise<ApiResponse<any>> {
//   // Build base URL
//   let url = `artists/analytics?searchTerm=${encodeURIComponent(params.searchTerm || '')}&genreFilter=${encodeURIComponent(params.genreFilter || '')}&includeGenres=${params.includeGenres || true}&sortBy=${params.sortBy || 'popularity'}&sortOrder=${params.sortOrder || 'DESC'}`;
  
//   // If ids array is provided, convert it to multiple ids parameters
//   if (params.ids && params.ids.length > 0) {
//     const idsParams = params.ids.map(id => `ids=${encodeURIComponent(id)}`).join('&');
//     url += `&${idsParams}`;
//   }

//   return apiRequest<ApiResponse<any>>(url, 'Failed to get range analytics');
// }

export async function getCollaborators(artistId: string): Promise<ApiResponse<Artist[]>> {
  return apiRequest<ApiResponse<Artist[]>>(`artists/${artistId}/collaborators`, 'Failed to get collaborating artists');
}