import { off } from 'process';
import pool from '../database/connection';
import { QueryResult } from 'pg';
import { on } from 'events';

export interface Artist {
  id: string;
  name?: string;
  popularity?: number;
  followers?: number;
  genres?: string[];
  urls?: string[];
  album_num?: number;
  track_num?: number;
  collab_num?: number;
}

interface getArtistsParams {
  searchTerm?: string;
  limit?: number;
  offset?: number;
  includeGenres?: boolean;
  genreFilter?: string;
  sortBy?: 'popularity' | 'name' | 'followers';
  sortOrder?: 'ASC' | 'DESC';
  onlyId?: boolean;
  includeImages?: boolean;
  ids?: string[];
}

// export async function getArtists(params: getArtistsParams): Promise<Artist[]> {
//     const {
//         searchTerm = '',
//         limit = -1,
//         offset = 0,
//         includeGenres = true,
//         genreFilter = '',
//         sortBy = 'popularity',
//         sortOrder = 'DESC',
//         onlyId = false,
//         includeImages = true,
//     } = params;
//     console.log(params);
//     try {
//         let query = '';

//         if (onlyId) {
//             query = `
//                 SELECT a.id
//                 FROM artist a
//             `;
//         } else { 
//             query = `
//                 SELECT 
//                     a.id,
//                     a.name,
//                     a.popularity,
//                     a.followers
//                     -- a.url
//                     FROM artist a
//             `;
//         }
        
//         if (genreFilter) {
//             query += `
//                 LEFT JOIN artist_genre ag ON a.id = ag.artist_id
//             `;
//         }
        
//         const whereConditions = [];
//         const queryParams = [];

//         if (searchTerm) {
//             whereConditions.push(`a.name ILIKE $${queryParams.length + 1}`);
//             queryParams.push(`%${searchTerm}%`);
//         }
        
//         if (genreFilter) {
//             whereConditions.push(`ag.genre ILIKE $${queryParams.length + 1}`);
//             queryParams.push(`%${genreFilter}%`);
//         }

//         if (whereConditions.length > 0) {
//             query += ' WHERE ' + whereConditions.join(' AND ');
//         }
        
//         if (includeGenres) {
//             query = `
//                 WITH selected_artists AS (
//                     ${query}
//                 )
//                 SELECT 
//                     sa.*,
//                     COALESCE(
//                         ARRAY_AGG(ag.genre) 
//                         FILTER (WHERE ag.genre IS NOT NULL), 
//                         ARRAY[]::text[]
//                     ) AS genres
//                 FROM selected_artists sa
//                 LEFT JOIN artist_genre ag ON sa.id = ag.artist_id
//                 -- GROUP BY sa.id, sa.name, sa.popularity, sa.followers
//             `;
//             if (!onlyId) {
//                 query += ' GROUP BY sa.id, sa.name, sa.popularity, sa.followers';
//             } else {
//                 query += ' GROUP BY sa.id';
//             }
//         }

//         if (includeImages) {
//             query = `
//                 WITH selected_artists2 AS (
//                     ${query}
//                 )
//                 SELECT 
//                     sa2.*,
//                     COALESCE(
//                         ARRAY_AGG(ai.url) 
//                         FILTER (WHERE ai.url IS NOT NULL), 
//                         ARRAY[]::text[]
//                     ) AS urls
//                 FROM selected_artists2 sa2
//                 LEFT JOIN artist_image ai ON sa2.id = ai.artist_id
//                 -- GROUP BY sa.id, sa.name, sa.popularity, sa.followers
//             `;
//             if (!onlyId) {
//                 query += ' GROUP BY sa2.id, sa2.name, sa2.popularity, sa2.followers';
//             } else {
//                 query += ' GROUP BY sa2.id';
//             }
//             if (includeGenres) {
//                 query += ', sa2.genres';
//             }
//         }

//         if (!onlyId) {
//             query += ' ORDER BY ' + sortBy + ' ' + sortOrder;
//         }
        
//         if (limit > 0) {
//             query += `
//                 LIMIT $${queryParams.length + 1}
//             `;
//             queryParams.push(limit);
//         }

//         if (offset > 0) {
//             query += `
//                 OFFSET $${queryParams.length + 1}
//             `;
//             queryParams.push(offset);
//         }

//         // console.log(query);
//         // console.log(query, queryParams);

//         const result: QueryResult = await pool.query(query, queryParams);
        
//         return result.rows;
//     } catch (error) {
//         console.error('Error searching artists:', error);
//         throw new Error('Error searching artists');
//     }
// }



// export async function getArtistCount(params: getArtistsParams): Promise<number> {
//     try {
//         const { genreFilter = '', searchTerm = '' } = params;
//         const queryParams = []; 
//         const query = `
//             SELECT COUNT(DISTINCT a.id) AS artist_cnt
//             FROM artist a
//         ` + (genreFilter ? `
//             JOIN artist_genre ag ON a.id = ag.artist_id
//             WHERE ag.genre ILIKE '%$${queryParams.length + 1}%'
//         ` : '') + (searchTerm ? 
//             (genreFilter ? ' AND ' : ' WHERE ') + `a.name ILIKE '%${searchTerm || ''}%'
//         ` : '');

//         const result: QueryResult<{ artist_cnt: number }> = await pool.query(query);
        
//         return result.rows[0].artist_cnt;
//     } catch (error) {
//         console.error('Error fetching artist count:', error);
//         throw new Error('Error fetching artist count');
//     }
// }

export async function getArtists(params: getArtistsParams): Promise<Artist[]> {
    const {
        searchTerm = '',
        limit = -1,
        offset = 0,
        genreFilter = '',
        sortBy = 'popularity',
        sortOrder = 'DESC',
        ids = [],
    } = params;
    console.log(params);
    try {
        const queryParams = [];
        let paramIndex = 0;
        const query = `
            WITH 
            artists AS (
                SELECT 
                    a.id,
                    a.name,
                    a.popularity,
                    a.followers
                FROM artist a
                WHERE 1 = 1
                ${searchTerm ? `AND a.name ILIKE $${++paramIndex}` : ''}
                ${ids.length > 0 ? `AND a.id = ANY($${++paramIndex}::TEXT[])` : ''}
                ORDER BY ${sortBy} ${sortOrder}
                ${limit > 0 ? `LIMIT $${++paramIndex}` : ''}
                ${offset > 0 ? `OFFSET $${++paramIndex}` : ''}
            ),
            genres AS (
                SELECT 
                    a.*,
                    COALESCE(
                        ARRAY_AGG(ag.genre) 
                        FILTER (WHERE ag.genre IS NOT NULL), 
                        ARRAY[]::text[]
                    ) AS genres
                FROM artists a
                LEFT JOIN artist_genre ag ON a.id = ag.artist_id
                ${genreFilter ? `WHERE ag.genre ILIKE $${++paramIndex}` : ''}
                GROUP BY a.id, a.name, a.popularity, a.followers
            )
            SELECT 
                g.*,
                COALESCE(
                    ARRAY_AGG(ai.url) 
                    FILTER (WHERE ai.url IS NOT NULL), 
                    ARRAY[]::text[]
                ) AS urls
            FROM genres g
            LEFT JOIN artist_image ai ON g.id = ai.artist_id
            GROUP BY g.id, g.name, g.popularity, g.followers, g.genres
            ORDER BY ${sortBy} ${sortOrder}
        `;

        if (searchTerm) {
            queryParams.push(`%${searchTerm}%`);
        }
        if (ids.length > 0) {
            queryParams.push(ids);
        }
        if (limit > 0) {
            queryParams.push(limit);
        }
        if (offset > 0) {
            queryParams.push(offset);
        }
        if (genreFilter) {
            queryParams.push(`%${genreFilter}%`);
        }

        console.log(query);
        // console.log(query, queryParams);

        const result: QueryResult = await pool.query(query, queryParams);
        
        return result.rows;
    } catch (error) {
        console.error('Error searching artists:', error);
        throw new Error('Error searching artists');
    }
}

export async function getArtistCount(params: getArtistsParams): Promise<number> {
    try {
        const { genreFilter = '', searchTerm = '', ids = []} = params;
        const queryParams = []; 
        let paramIndex = 0;
        // const query = `
        //     WITH
        //     artists1 AS (
        //         SELECT 
        //             a.id
        //         FROM artist a
        //         WHERE 1 = 1
        //         ${searchTerm ? `
        //         AND a.name ILIKE $${++paramIndex}
        //         ` : ''}
        //         ${ids.length > 0 ? `
        //         AND a.id = ANY($${++paramIndex}::TEXT[])
        //         ` : ''}
        //     )

        //     )
        const query = `
            SELECT COUNT(DISTINCT a.id) AS artist_cnt
            FROM artist a
            ${genreFilter ? `
            JOIN artist_genre ag ON a.id = ag.artist_id
            WHERE ag.genre ILIKE $${++paramIndex}
            ` : ''} 
            ${searchTerm ? `
            ${genreFilter ? ' AND ' : ' WHERE '} a.name ILIKE $${++paramIndex}
            ` : ''};
            ${ids.length > 0 ? `
            ${genreFilter || searchTerm ? ' AND ' : ' WHERE '} a.id = ANY($${++paramIndex}::TEXT[])
            ` : ''}
            `;
        if (genreFilter) {
            queryParams.push(`%${genreFilter}%`);
        }   
        if (searchTerm) {
            queryParams.push(`%${searchTerm}%`);
        }
        if (ids.length > 0) {
            queryParams.push(ids);
        }

        const result: QueryResult<{ artist_cnt: number }> = await pool.query(query, queryParams);
        
        return result.rows[0].artist_cnt;
    } catch (error) {
        console.error('Error fetching artist count:', error);
        throw new Error('Error fetching artist count');
    }
}

export async function getGenreCount(): Promise<number> {
    try {
        const query = `
            SELECT COUNT(DISTINCT genre) AS genre_cnt
            FROM artist_genre
        `;
        const result: QueryResult<{ genre_cnt: number }> = await pool.query(query);
        
        return result.rows[0].genre_cnt;
    } catch (error) {
        console.error('Error fetching genre count:', error);
        throw new Error('Error fetching genre count');
    }
}

// export async function getArtistById(artistId: string): Promise<Artist> {
//   try {
//     const query = `
//     WITH 
//     the_artist AS (
//       SELECT *
//       FROM artist
//       WHERE id = $1
//     ),
//     album_cnt AS (
//         SELECT
//             artist_id AS id,
//             COUNT(album_id) AS album_num
//         FROM album_artist
//         WHERE artist_id = $1
//         GROUP BY artist_id
//     ),
//     track_cnt AS (
//         SELECT
//             artist_id AS id,
//             COUNT(track_id) AS track_num
//         FROM track_artist
//         WHERE artist_id = $1
//         GROUP BY artist_id
//     ),
//     genres AS (
//         SELECT
//             artist_id AS id,
//             COALESCE(
//                 ARRAY_AGG(genre) 
//                 FILTER (WHERE genre IS NOT NULL), 
//                 ARRAY[]::text[]
//             ) AS genres
//         FROM artist_genre
//         WHERE artist_id = $1
//         GROUP BY artist_id
//     ),
//     images AS (
//         SELECT
//             artist_id AS id,
//             COALESCE(
//                 ARRAY_AGG(url) 
//                 FILTER (WHERE url IS NOT NULL), 
//                 ARRAY[]::text[]
//             ) AS urls
//         FROM artist_image
//         WHERE artist_id = $1
//         GROUP BY artist_id
//     )
//     SELECT *
//     FROM the_artist ta
//     LEFT JOIN album_cnt ac ON ta.id = ac.id
//     LEFT JOIN track_cnt tc ON ta.id = tc.id
//     LEFT JOIN genres g ON ta.id = g.id
//     LEFT JOIN images im ON ta.id = im.id
//     `;
//     const queryParams = [artistId];

//     const result = await pool.query(query, queryParams);
    
//     return result.rows[0];
//   } catch (error) {
//     console.error('Error fetching artist by ID:', error);
//     throw new Error('Error fetching artist by ID');
//   }
// }

export interface GenreDistribution {    
    genre: string;
    artist_num: number;
    ratio: number;
    // avg_popularity: number;
}

// export async function getGenreDistribution(params: getArtistsParams): Promise<GenreDistribution[]> {
//     try { 
//         const { searchTerm = '', genreFilter = '', ids = [] } = params;
        
//         const queryParams = [];
//         let paramIndex = 0;
//         const query = `
//             SELECT ag.genre, COUNT(a.id) AS artist_cnt, avg(a.popularity) AS avg_popularity,
//             COUNT(a.id)::float / SUM(COUNT(a.id)) OVER () AS ratio
//             FROM artist a
//             ${genreFilter ? `
//             JOIN artist_genre ag ON a.id = ag.artist_id
//             WHERE ag.genre ILIKE $${++paramIndex}
//             ` : ''} 
//             ${searchTerm ? `
//             ${genreFilter ? ' AND ' : ' WHERE '} a.name ILIKE $${++paramIndex}
//             ` : ''};
//             ${ids.length > 0 ? `
//             ${genreFilter || searchTerm ? ' AND ' : ' WHERE '} a.id = ANY($${++paramIndex}::TEXT[])
//             ` : ''}
//             GROUP BY ag.genre
//             `;

//     } catch (error) {
//         console.error('Error fetching genre distribution:', error);
//         throw new Error('Error fetching genre distribution');
//     }
// }

interface GenreDistributionParams {
    artistIds: string[];
    limit?: number;
}

// export async function getGenreDistribution(params: GenreDistributionParams): Promise<GenreDistribution[]> {
//     try { 
//         const { artistIds, limit = 10 } = params;
//         if (artistIds.length === 0) {
//             return [];
//         }

//         const query = `
//             SELECT
//                 genre,
//                 COUNT(*) AS artist_num
//             FROM artist_genre
//             WHERE artist_id = ANY($1::TEXT[])
//             AND genre IS NOT NULL
//             GROUP BY genre
//             ORDER BY artist_num DESC
//             LIMIT $2
//         `;
//         const queryParams = [artistIds, limit];
//         // console.log(query, queryParams);

//         const result: QueryResult = await pool.query(query, queryParams);

//         return result.rows;
//     } catch (error) {
//         console.error('Error fetching artist genre distribution:', error);
//         throw new Error('Error fetching artist genre distribution');
//     }
// }

export async function getGenreDistribution(params: getArtistsParams): Promise<GenreDistribution[]> {
    try { 
        const { genreFilter = '', searchTerm = '', ids = []} = params;
        const queryParams = []; 
        let paramIndex = 0;
        const query = `
            WITH
            artist_ids AS (
                SELECT
                    id
                FROM artist
                WHERE 1 = 1
                ${searchTerm ? `AND name ILIKE $${++paramIndex}` : ''}
                ${ids.length > 0 ? `AND id = ANY($${++paramIndex}::TEXT[])` : ''}
            ),
            genre_cnt AS (
                SELECT
                    genre,
                    COUNT(*) AS artist_num
                FROM artist_genre
                WHERE artist_id IN (SELECT id FROM artist_ids)
                AND genre IS NOT NULL
                ${genreFilter ? `AND genre ILIKE $${++paramIndex}` : ''}
                GROUP BY genre
                ORDER BY artist_num DESC
                LIMIT 10
            ),
            total AS (
                SELECT SUM(artist_num) AS total_num
                FROM genre_cnt
            )
            SELECT
                genre,
                artist_num,
                1.0 * artist_num / (SELECT total_num FROM total) AS ratio
            FROM genre_cnt
        `;
        if (searchTerm) {
            queryParams.push(`%${searchTerm}%`);
        }
        if (ids.length > 0) {
            queryParams.push(ids);
        }
        if (genreFilter) {
            queryParams.push(`%${genreFilter}%`);
        }

        const result: QueryResult = await pool.query(query, queryParams);

        return result.rows;
    } catch (error) {
        console.error('Error fetching artist genre distribution:', error);
        throw new Error('Error fetching artist genre distribution');
    }
}

export interface EmotionDistribution {
  emotion: string;
  track_num: number;
  ratio: number;
}
export async function getEmotionDistribution(params: getArtistsParams): Promise<EmotionDistribution[] | null> {
  try { 
    const { genreFilter = '', searchTerm = '', ids = []} = params;
    const queryParams = []; 
    let paramIndex = 0;
    const query = `
        WITH
        artist_ids AS (
            SELECT
                id
            FROM artist
            WHERE 1 = 1
            ${searchTerm ? `AND name ILIKE $${++paramIndex}` : ''}
            ${ids.length > 0 ? `AND id = ANY($${++paramIndex}::TEXT[])` : ''}
        ),
        artist_ids2 AS (
            SELECT
                artist_id
            FROM artist_genre
            WHERE artist_id IN (SELECT id FROM artist_ids)
            ${genreFilter ? `AND genre ILIKE $${++paramIndex}` : ''}
        ),
        track_ids AS (
            SELECT
                track_id
            FROM track_artist
            WHERE artist_id IN (SELECT artist_id FROM artist_ids2)
        ),
        emotion_cnt AS (
            SELECT
                CASE
                WHEN energy >= 0.666 AND valence < 0.333 THEN 'Frantic'
                WHEN energy >= 0.666 AND valence >= 0.333 AND valence < 0.666 THEN 'Tense'
                WHEN energy >= 0.666 AND valence >= 0.666 THEN 'Euphotic'
                WHEN energy >= 0.333 AND energy < 0.666 AND valence < 0.333 THEN 'Upset'
                WHEN energy >= 0.333 AND energy < 0.666 AND valence >= 0.333 AND valence < 0.666 THEN 'Calm'
                WHEN energy >= 0.333 AND energy < 0.666 AND valence >= 0.666 THEN 'Cheerful'
                WHEN energy < 0.333 AND valence < 0.333 THEN 'Bleak'
                WHEN energy < 0.333 AND valence >= 0.333 AND valence < 0.666 THEN 'Apathetic'
                WHEN energy < 0.333 AND valence >= 0.666 THEN 'Serene'
                ELSE 'Other'
                END AS emotion,
                COUNT(energy) AS track_num
            FROM track
            WHERE id IN (SELECT track_id FROM track_ids)
            GROUP BY emotion
        ),
        total AS (
            SELECT SUM(track_num) AS total_num
            FROM emotion_cnt
        )
        SELECT
            emotion,
            track_num,
            1.0 * track_num / (SELECT total_num FROM total) AS ratio
        FROM emotion_cnt
    `;

    if (searchTerm) {
      queryParams.push(`%${searchTerm}%`);
    }
    if (ids.length > 0) {
      queryParams.push(ids);
    }
    if (genreFilter) {
      queryParams.push(`%${genreFilter}%`);
    }

    const result: QueryResult = await pool.query(query, queryParams);
    console.log(result.rows);
    return result.rows.length > 0 ? result.rows : null;
  } catch (error) {
    console.error('Error fetching emotion distribution:', error);
    throw new Error('Error fetching emotion distribution');
  }

}

export async function getCollaborators(artistId: string): Promise<Artist[]> {
    try {
        const query = `
            WITH
            tracks AS (
                SELECT 
                    track_id
                FROM track_artist
                WHERE artist_id = $1
            ),
            collaboration_cnt AS (
                SELECT
                    ta.artist_id,
                    COUNT(*) AS collab_num
                FROM track_artist ta
                WHERE ta.track_id IN (SELECT track_id FROM tracks)
                AND ta.artist_id <> $1
                GROUP BY ta.artist_id
            ),
            collaborators AS (
                SELECT
                    a.*,
                    cc.collab_num
                FROM artist a
                RIGHT JOIN collaboration_cnt cc ON a.id = cc.artist_id
                ORDER BY collab_num DESC
            ),
            genres AS (
                SELECT
                    c.*,
                    COALESCE(
                    ARRAY_AGG(ag.genre) 
                    FILTER (WHERE ag.genre IS NOT NULL), 
                    ARRAY[]::text[]
                    ) AS genres
                FROM collaborators c
                LEFT JOIN artist_genre ag ON c.id = ag.artist_id
                GROUP BY c.id, c.name, c.popularity, c.followers, c.collab_num
            )
            SELECT
                g.*,
                COALESCE(
                    ARRAY_AGG(ai.url) 
                    FILTER (WHERE ai.url IS NOT NULL), 
                    ARRAY[]::text[]
                ) AS urls
            FROM genres g
            LEFT JOIN artist_image ai ON g.id = ai.artist_id
            GROUP BY g.id, g.name, g.popularity, g.followers, g.collab_num, g.genres
            ORDER BY collab_num DESC
        `;
        const queryParams = [artistId];
        console.log(query, queryParams);

        const result: QueryResult = await pool.query(query, queryParams);

        return result.rows;
    } catch (error) {
        console.error('Error fetching collaborators:', error);
        throw new Error('Error fetching collaborators');
    }
}


// export async function getGenreAnalytics(artistIds: string[]): Promise<GenreAnalytics[]> {
//     try { 
//         if (artistIds.length === 0) {
//             return [];
//         }

//         // Create placeholders for IN clause ($1, $2, $3, ...)
//         const placeholders = artistIds.map((_, index) => `$${index + 1}`).join(', ');
        
//         const query = `
//             WITH
//             genres AS (
//                 SELECT DISTINCT genre
//                 FROM artist_genre 
//                 WHERE artist_id IN (${placeholders})
//             )
//             track_ids AS (
//                 SELECT 
//                     track_id
//                 FROM track_artist
//                 WHERE artist_id IN (${placeholders})
//             )
//             tracks AS (
//                 SELECT 
//                     id,
//                     popularity,
//                     genre
//                 FROM track
//                 WHERE id IN (SELECT track_id FROM track_ids)
//             )
//             SELECT
//                 genre,
//                 COUNT(id) AS track_num,
//                 AVG(popularity) AS avg_popularity
//             FROM tracks
//             WHERE genre IN (SELECT genre FROM genres)
//             GROUP BY genre
//         `;
//         const queryParams = artistIds;

//         const result: QueryResult = await pool.query(query, queryParams);

//         return result.rows;
//     } catch (error) {
//         console.error('Error fetching artist genre analytics:', error);
//         throw new Error('Error fetching artist genre analytics');
//     }
// }

// export interface HighFreqWord {
//     high_freq_word: string;
//     word_num: number;
// }

// export async function getHighFreqWords(artistId: string): Promise<HighFreqWord[]> {
//     try {
//         const query = `
//             WITH
//             track_ids AS (
//                 SELECT 
//                     track_id,
//                 FROM track_artist
//                 WHERE artist_id = 
//             )
//             lyrics AS (
//                 SELECT 
//                     id,
//                     lyrics
//                 FROM track_lyrics
//                 WHERE id IN (SELECT track_id FROM track_ids)
//             )
//             SELECT
//                 high_freq_word,
//                 COUNT(*) AS word_num
//             FROM lyrics
//             GROUP BY high_freq_word
//             ORDER BY word_num DESC
//             LIMIT 10
//         `;
//         const queryParams = [artistId];

//         const result: QueryResult = await pool.query(query, queryParams);

//         return result.rows;
//     } catch (error) {
//         console.error('Error fetching artist high freq words:', error);
//         throw new Error('Error fetching artist high freq words');
//     }
// }

// export interface ArtistTrack {
//     id: string;
//     name: string;
//     duration_ms: number;
//     [key: string]: any;
// }
// export interface ArtistTrackParams {
//     artistId: string;
//     attribute1?: string;
//     attribute2?: string;
// }
// export async function getArtistTracks(params: ArtistTrackParams): Promise<ArtistTrack[]> {
//     try {
//         const {
//             artistId,
//             attribute1 = '',
//             attribute2 = '',
//         } = params;
        
//         let query = `
//             WITH 
//             track_ids AS (
//                 SELECT 
//                     track_id,
//                 FROM track_artist
//                 WHERE artist_id = $1
//             )
//             SELECT
//                 id,
//                 name,
//                 duration_ms
//         `;

//         const queryParams = [params.artistId];

//         if (attribute1) {
//             query += `, $${queryParams.length + 1}`;
//             queryParams.push(attribute1);
//         }
//         if (attribute2) {
//             query += `, $${queryParams.length + 1}`;
//             queryParams.push(attribute2);
//         }
//         query += `
//             FROM track
//             WHERE id IN (SELECT track_id FROM track_ids)
//             ORDER BY popularity DESC
//         `;
//         const result: QueryResult = await pool.query(query, queryParams);
//         return result.rows;
//     } catch (error) {
//         console.error('Error fetching artist tracks:', error);
//         throw new Error('Error fetching artist tracks');
//     }
// }

// export interface ArtistAlbum {    
//     id: string;
//     name: string;
//     release_date: string;
//     total_tracks: number;
// }

// export async function getArtistAlbums(artistId: string): Promise<ArtistAlbum[]> {
//     try { 
//         const query = `
//             WITH
//             album_ids AS (
//                 SELECT 
//                     album_id,
//                 FROM album_artist
//                 WHERE artist_id = $1
//             )
//             SELECT
//                 id,
//                 name,
//                 release_date,
//                 total_tracks
//             FROM album
//             WHERE id IN (SELECT album_id FROM album_ids)
//         `;
//         const queryParams = [artistId];

//         const result: QueryResult = await pool.query(query, queryParams);

//         return result.rows;
//     } catch (error) {
//         console.error('Error fetching artist albums:', error);
//         throw new Error('Error fetching artist albums');
//     }
// }

// export interface AlbumTypeAnalytics {
//     type: string;
//     album_num: number;
//     avg_track_num: number;
//     avg_popularity: number;
// }

// export async function getAlbumTypeAnalytics(artistId: string): Promise<AlbumTypeAnalytics> {
//     try { 
//         const query = `
//             WITH
//             album_ids AS (
//                 SELECT 
//                     album_id,
//                 FROM album_artist
//                 WHERE artist_id = $1
//             )
//             SELECT
//                 type,
//                 COUNT(id) AS album_num,
//                 AVG(total_tracks) AS avg_track_num,
//                 AVG(popularity) AS avg_popularity
//             FROM album
//             WHERE id IN (SELECT album_id FROM album_ids)
//             GROUP BY type
//         `;
//         const queryParams = [artistId];
//         const result: QueryResult = await pool.query(query, queryParams);
//         return result.rows[0];
//     } catch (error) {
//         console.error('Error fetching artist album type analytics:', error);
//         throw new Error('Error fetching artist album type analytics');
//     }
// }

// export async function getArtistByAlbumId(albumId: string): Promise<Artist[]> {
//     try {
//         const query = `
//             WITH
//             artist_ids AS (
//                 SELECT artist_id
//                 FROM album_artist
//                 WHERE album_id = $1
//             )
//             SELECT
//                 a.*
//             FROM artists a
//             WHERE a.id IN (SELECT artist_id FROM artist_ids)
//         `;
//         const queryParams = [albumId];
//         const result: QueryResult = await pool.query(query, queryParams);
//         return result.rows;
//     } catch (error) {
//         console.error('Error fetching artist by album ID:', error);
//         throw new Error('Error fetching artist by album ID');
//     }
// }

// export async function getArtistByTrackId(trackId: string): Promise<Artist[]> { 
//     try {
//         const query = `
//             WITH
//             artist_ids AS (
//                 SELECT artist_id
//                 FROM track_artist
//                 WHERE track_id = $1
//             )
//             SELECT *
//             FROM artist
//             WHERE id IN (SELECT artist_id FROM artist_ids)
//         `;
//         const queryParams = [trackId];
//         const result: QueryResult = await pool.query(query, queryParams);
//         return result.rows;
//     } catch (error) {
//         console.error('Error fetching artist by track ID:', error);
//         throw new Error('Error fetching artist by track ID');
//     }
// }

