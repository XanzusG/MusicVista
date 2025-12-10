import { buildApiUrl, ApiResponse, PaginatedResponse } from './apiConfig';

export async function getLoveDistribution(): Promise<ApiResponse<any>> {
    const url = buildApiUrl('/insights/love-distribution');
    const response = await fetch(url);
    return response.json();
}

export async function getPopWords(): Promise<ApiResponse<any>> {
    const url = buildApiUrl('/insights/pop-words');
    const response = await fetch(url);
    return response.json();
}

export async function getArtistPopularityGrowth(): Promise<ApiResponse<any>> {
    const url = buildApiUrl('/insights/artist-popularity-growth');
    const response = await fetch(url);
    return response.json();
}

export async function getArtistEmotionVariety(): Promise<ApiResponse<any>> {
    const url = buildApiUrl('/insights/artist-emotion-variety');
    const response = await fetch(url);
    return response.json();
}