declare global {
  interface ImportMetaEnv {
    readonly VITE_API_BASE_URL?: string;
    readonly VITE_API_TIMEOUT?: string;
    readonly DEV?: boolean;
  }

  interface ImportMeta {
    readonly env: ImportMetaEnv;
  }
}

// API configuration utilities
export const API_CONFIG = {
  // Base URL configuration
  baseURL: import.meta.env.VITE_API_BASE_URL || 
    (import.meta.env.DEV ? 'http://localhost:3001/api' : '/api'),
  
  // Request timeout
  timeout: Number(import.meta.env.VITE_API_TIMEOUT) || 10000,
  
  // Default headers
  defaultHeaders: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  
  // API endpoints configuration
  endpoints: {
    auth: {
      login: '/auth/login',
      register: '/auth/register',
      logout: '/auth/logout',
      me: '/auth/me',
      refresh: '/auth/refresh',
      forgotPassword: '/auth/forgot-password',
      resetPassword: '/auth/reset-password',
    },
    users: {
      profile: '/users/profile',
      updateProfile: '/users/profile',
      deleteAccount: '/users/account',
    },
    // likes: {
    //   list: '/likes',
    //   add: '/likes',
    //   remove: '/likes',
    //   check: '/likes/check',
    //   stats: '/likes/stats',
    //   user: (userId: string | number) => `/users/${userId}/likes`,
    //   userStats: (userId: string | number) => `/users/${userId}/likes/stats`,
    // },
    // lyrics: {
    //   search: '/lyrics/search',
    //   getById: (trackId: string) => `/lyrics/${trackId}`,
    //   getAll: '/lyrics/all',
    //   sentiment: (trackId: string) => `/lyrics/${trackId}/sentiment`,
    //   trending: '/lyrics/trending',
    //   suggestions: '/lyrics/suggestions',
    //   popular: '/lyrics/popular-searches',
    //   favorites: '/lyrics/favorites',
    //   addFavorite: (lyricId: string) => `/lyrics/${lyricId}/favorite`,
    //   removeFavorite: (lyricId: string) => `/lyrics/${lyricId}/favorite`,
    //   checkFavorite: (lyricId: string) => `/lyrics/${lyricId}/favorite/check`,
    //   share: (lyricId: string) => `/lyrics/${lyricId}/share`,
    //   translate: (lyricId: string) => `/lyrics/${lyricId}/translate`,
    //   history: '/lyrics/history',
    //   clearHistory: '/lyrics/history',
    //   stats: '/lyrics/stats',
    // },
    artists: {
      // list: '/artists',
      getById: (artistId: string) => `/artists/${artistId}`,
      search: '/artists/search',
      trending: '/artists/trending',
      // byGenre: (genreName: string) => `/artists/genre/${genreName}`,
    },
    albums: {
      list: '/albums',
      getById: (albumId: string) => `/albums/${albumId}`,
      search: '/albums/search',
      recent: '/albums/recent',
      byArtist: (artistId: string) => `/albums/artist/${artistId}`,
    },
    tracks: {
      list: '/tracks',
      getById: (trackId: string) => `/tracks/${trackId}`,
      search: '/tracks/search',
      trending: '/tracks/trending',
      byAlbum: (albumId: string) => `/tracks/album/${albumId}`,
      byArtist: (artistId: string) => `/tracks/artist/${artistId}`,
    },
    genres: {
      list: '/genres',
    },
    social: {
      google: '/social/google',
      github: '/social/github',
      facebook: '/social/facebook',
      twitter: '/social/twitter',
    },
  },
  
  // Error message mapping
  errorMessages: {
    network: 'Network connection failed, please check your network settings',
    timeout: 'Request timeout, please try again later',
    serverError: 'Internal server error, please try again later',
    unauthorized: 'Authentication failed, please log in again',
    forbidden: 'You do not have permission to perform this action',
    notFound: 'The requested resource does not exist',
    validation: 'Request parameters are invalid',
    unknown: 'Unknown error, please try again later',
  },
};

// Build complete API URL
export const buildApiUrl = (endpoint: string): string => {
  // If it's an absolute URL, return directly
  if (endpoint.startsWith('http://') || endpoint.startsWith('https://')) {
    return endpoint;
  }
  
  // Remove leading slash to ensure correct path
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint;
  
  // Ensure baseURL ends with slash
  const baseUrl = API_CONFIG.baseURL.endsWith('/') ? API_CONFIG.baseURL : `${API_CONFIG.baseURL}/`;
  
  return `${baseUrl}${cleanEndpoint}`;
};

// API response type definitions
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  code?: number;
  timestamp?: string;
}

export interface PaginatedResponse<T = any> {
  success: boolean;
  data: T[];
  pagination: {
    page: number;
    size: number;
    total: number;
    totalPages: number;
  };
  message?: string;
}

// HTTP status code mapping
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  METHOD_NOT_ALLOWED: 405,
  CONFLICT: 409,
  INTERNAL_SERVER_ERROR: 500,
  BAD_GATEWAY: 502,
  SERVICE_UNAVAILABLE: 503,
} as const;

// Get error message
export const getErrorMessage = (status: number): string => {
  if (status >= 400 && status < 500) {
    if (status === HTTP_STATUS.UNAUTHORIZED) {
      return API_CONFIG.errorMessages.unauthorized;
    }
    if (status === HTTP_STATUS.FORBIDDEN) {
      return API_CONFIG.errorMessages.forbidden;
    }
    if (status === HTTP_STATUS.NOT_FOUND) {
      return API_CONFIG.errorMessages.notFound;
    }
    if (status === HTTP_STATUS.BAD_REQUEST) {
      return API_CONFIG.errorMessages.validation;
    }
    return API_CONFIG.errorMessages.validation;
  }
  
  if (status >= 500) {
    return API_CONFIG.errorMessages.serverError;
  }
  
  return API_CONFIG.errorMessages.unknown;
};

export default API_CONFIG;