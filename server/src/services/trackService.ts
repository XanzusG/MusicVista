import pool from '../database/connection';
import { QueryResult } from 'pg';

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
  explicit?: boolean;
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
  similarity?: number;
  release_date?: string;
}

export interface getTrackParams {
  trackId: string;
  detail?: boolean;
}

// export async function getTrackById(trackId: string): Promise<Track | null> {
//   try {
//     const query = `
//       SELECT 
//         t.*,
//         al.name as album_name,
//         -- STRING_AGG(ar.id, ',') as artist_id,
//         COALESCE(
//             ARRAY_AGG(ar.id) 
//             FILTER (WHERE ar.id IS NOT NULL), 
//             ARRAY[]::text[]
//         ) AS artist_id,
//         -- STRING_AGG(ar.name, ',') as artist_name
//         COALESCE(
//             ARRAY_AGG(ar.name) 
//             FILTER (WHERE ar.name IS NOT NULL), 
//             ARRAY[]::text[]
//         ) AS artist_name,
//         l.lyrics
//         FROM track t
//         LEFT JOIN album al ON t.album_id = al.id
//         LEFT JOIN track_artist ta ON t.id = ta.track_id
//         LEFT JOIN artist ar ON ta.artist_id = ar.id
//         LEFT JOIN track_lyrics l ON t.id = l.track_id
//         WHERE t.id = $1
//         GROUP BY t.id, t.album_id, t.disc_num,t.duration_ms,t.explicit,t.name,t.track_num,t.danceability,t.energy,t.key,t.loudness,t.mode,t.speechiness,t.acousticness,t.instrumentalness,t.liveness,t.valence,t.tempo, al.name, l.lyrics
//     `;

//     const result: QueryResult = await pool.query(query, [trackId]);
//     console.log('result:', result);
    
//     return result.rows.length > 0 ? result.rows[0] : null;
//   } catch (error) {
//     console.error('Error fetching track by ID:', error);
//     throw new Error('Error fetching track by ID');
//   }
// }
export interface TrackSearchParams {
    searchTerm?: string;
    emotionFilter?: 'Frantic' | 'Tense' | 'Euphoric' | 'Upset' | 'Calm' | 'Cheerful' | 'Bleak' | 'Apathetic' | 'Serene' | 'All' | 'Other';
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
    ids?: string[];
    albumIds?: string[];
    artistIds?: string[];
}

export async function EmotionParams(emotion: string = 'All'): Promise<{minEnergy: number, maxEnergy: number, minValence: number, maxValence: number}> {
  switch (emotion) {
    case 'All':
      return {minEnergy: 0, maxEnergy: 1, minValence: 0, maxValence: 1};
    case 'Frantic':
      return {minEnergy: 0.666, maxEnergy: 1, minValence: 0, maxValence: 0.333};
    case 'Tense':
      return {minEnergy: 0.666, maxEnergy: 1, minValence: 0.333, maxValence: 0.666};
    case 'Euphoric':
      return {minEnergy: 0.666, maxEnergy: 1, minValence: 0.666, maxValence: 1};
    case 'Upset':
      return {minEnergy: 0.333, maxEnergy: 0.666, minValence: 0, maxValence: 0.333};
    case 'Calm':
      return {minEnergy: 0.333, maxEnergy: 0.666, minValence: 0.333, maxValence: 0.666};
    case 'Cheerful':
      return {minEnergy: 0.333, maxEnergy: 0.666, minValence: 0.666, maxValence: 1};
    case 'Bleak':
      return {minEnergy: 0.333, maxEnergy: 0.666, minValence: 0, maxValence: 0.333};
    case 'Apathetic':
      return {minEnergy: 0, maxEnergy: 0.333, minValence: 0.333, maxValence: 0.666};
    case 'Serene':
      return {minEnergy: 0, maxEnergy: 0.333, minValence: 0.666, maxValence: 1};
    default:
      return {minEnergy: 0, maxEnergy: 1, minValence: 0, maxValence: 1};
  }
}

export async function getTracks(params: TrackSearchParams): Promise<Track[] | null> { 
  try {
    const {
        searchTerm = '',
        emotionFilter = 'All',
        // minPopularity = 0,
        // maxPopularity = 100,
        // minEnergy = 0,
        // maxEnergy = 1,
        // minDanceability = 0,
        // maxDanceability = 1,
        // minValence = 0,
        // maxValence = 1,
        // minDuration = 0,
        // maxDuration = 1000000000,
        // explicit = true,
        sortBy = 'release_date',
        sortOrder = 'DESC',
        limit = -1,
        offset = 0,
        ids = [],
        albumIds = [],
        artistIds = []
    }  = params;
    const queryParams = [];
    let paramIndex = 0;
    const query = `
      WITH
      tracks AS (
        SELECT
          *
        FROM track
        WHERE 1=1
        ${searchTerm ? `AND name ILIKE $${++paramIndex}` : ''}
        ${emotionFilter !== 'All' ? `AND energy BETWEEN $${++paramIndex} AND $${++paramIndex} AND valence BETWEEN $${++paramIndex} AND $${++paramIndex}` : ''}
        ${ids.length > 0 ? ` AND id = ANY($${++paramIndex}::TEXT[])` : ''}
        ${albumIds.length > 0 ? ` AND album_id = ANY($${++paramIndex}::TEXT[])` : ''}
        ${sortBy !== 'release_date' && artistIds.length === 0 ? `
        ORDER BY ${sortBy} ${sortOrder}
        ${limit > 0 ? ` LIMIT $${++paramIndex}` : ''}
        ${offset > 0 ? ` OFFSET $${++paramIndex}` : ''}
        ` : '' }
      )
      SELECT 
        t.*,
        al.name as album_name,
        al.release_date,
        COALESCE(
            ARRAY_AGG(ar.id) 
            FILTER (WHERE ar.id IS NOT NULL), 
            ARRAY[]::text[]
        ) AS artist_ids,
        COALESCE(
            ARRAY_AGG(ar.name) 
            FILTER (WHERE ar.name IS NOT NULL), 
            ARRAY[]::text[]
        ) AS artist_names
      FROM tracks t
      JOIN album al ON t.album_id = al.id
      JOIN track_artist ta ON t.id = ta.track_id
      JOIN artist ar ON ta.artist_id = ar.id
      ${artistIds.length > 0 ? `WHERE ar.id = ANY($${++paramIndex}::TEXT[])` : ''}
      GROUP BY t.id,t.album_id,t.disc_num,t.duration_ms,
        t.explicit,t.name,t.track_num,t.danceability,
        t.energy,t.key,t.loudness,t.mode,t.speechiness,
        t.acousticness,t.instrumentalness,t.liveness,
        t.valence,t.tempo, al.name, al.release_date
      ORDER BY ${sortBy} ${sortOrder}
      ${sortBy === 'release_date' || artistIds.length > 0 ? `
      ${limit > 0 ? ` LIMIT $${++paramIndex}` : ''}
      ${offset > 0 ? ` OFFSET $${++paramIndex}` : ''}
      ` : '' }
    `;

    if (searchTerm) {
      queryParams.push(`%${searchTerm}%`);
    }
    if (emotionFilter !== 'All') {
      const emotionParams = await EmotionParams(emotionFilter);
      queryParams.push(
        emotionParams.minEnergy,
        emotionParams.maxEnergy,
        emotionParams.minValence,
        emotionParams.maxValence
      );
    }
    if (ids.length > 0) { 
      queryParams.push(ids);
    }
    if (albumIds.length > 0) { 
      queryParams.push(albumIds);
    }
    if (sortBy !== 'release_date' && artistIds.length === 0) {
      if (limit > 0) { 
        queryParams.push(limit);
      }
      if (offset > 0) {
        queryParams.push(offset);
      }
    }
    if (artistIds.length > 0) { 
      queryParams.push(artistIds);
    }
    if (sortBy === 'release_date' || artistIds.length > 0) {
      if (limit > 0) { 
        queryParams.push(limit);
      }
      if (offset > 0) {
        queryParams.push(offset);
      }
    }
    // console.log('query:', query);
            // --t.popularity BETWEEN $1 AND $2 AND
            // --t.energy BETWEEN $3 AND $4 AND
            // --t.danceability BETWEEN $5 AND $6 AND
            // --t.valence BETWEEN $7 AND $8 AND
            // --t.duration_ms BETWEEN $9 AND 0 AND
            // --t.explicit = $11

    // const queryParams = [
    //     `%${searchTerm}%`,
    //     // minPopularity,
    //     // maxPopularity,
    //     // minEnergy,
    //     // maxEnergy,
    //     // minDanceability,
    //     // maxDanceability,
    //     // minValence,
    //     // maxValence,
    //     // minDuration,
    //     // maxDuration,
    //     // explicit,
    //     sortBy,
    //     sortOrder,
    //     limit,
    // ];
    const result: QueryResult = await pool.query(query, queryParams);
    return result.rows.length > 0 ? result.rows : null;
  } catch (error) {
    console.error('Error fetching tracks:', error);
    throw new Error('Error fetching tracks');
  }
}
export interface SearchSimilarParams {
  trackId: string;
  limit?: number;
} 

export async function getTrackCount(params: TrackSearchParams): Promise<number> {
    try {
        const {
          searchTerm = '', 
          emotionFilter = 'All',
          ids = [],
          albumIds = [],
          artistIds = []
        } = params;
        const queryParams = [];
        let paramIndex = 0;
        const query = `
            SELECT COUNT(*) AS count
            FROM track
            WHERE 1=1
            ${searchTerm ? `AND name ILIKE $${++paramIndex}` : ''}
            ${emotionFilter !== 'All' ? `AND energy BETWEEN $${++paramIndex} AND $${++paramIndex} AND valence BETWEEN $${++paramIndex} AND $${++paramIndex}` : ''}
            ${ids.length > 0 ? ` AND id = ANY($${++paramIndex}::TEXT[])` : ''}
            ${albumIds.length > 0 ? ` AND album_id = ANY($${++paramIndex}::TEXT[])` : ''}
            ${artistIds.length > 0 ? ` AND id IN (SELECT ta.track_id FROM track_artist ta WHERE ta.artist_id = ANY($${++paramIndex}::TEXT[]))` : ''}
        `;
        if (searchTerm) {
            queryParams.push(`%${searchTerm}%`);
        }
        if (emotionFilter !== 'All') {
            const emotionParams = await EmotionParams(emotionFilter);
            queryParams.push(
                emotionParams.minEnergy,
                emotionParams.maxEnergy,
                emotionParams.minValence,
                emotionParams.maxValence
            );
        }
        if (ids.length > 0) {
            queryParams.push(ids);
        }
        if (albumIds.length > 0) {
            queryParams.push(albumIds);
        }
        if (artistIds.length > 0) {
            queryParams.push(artistIds);
        }
        const result: QueryResult<{ count: number }> = await pool.query(query, queryParams);
        // console.log('Track count result:', result.rows[0].count);
        return result.rows[0].count;
    } catch (error) {
        console.error('Error fetching track count:', error);
        throw new Error('Error fetching track count');
    }
}

export async function getLyricsByTrackId(trackId: string): Promise<string | null> {
  try {
    const query = `
      SELECT lyrics
      FROM track_lyrics
      WHERE track_id = $1
    `;
    const result: QueryResult<{ lyrics: string }> = await pool.query(query, [trackId]);
    return result.rows.length > 0 ? result.rows[0].lyrics : null;
  } catch (error) {
    console.error('Error fetching lyrics:', error);
    throw new Error('Error fetching lyrics');
  }
}

export async function getSimilarTracks(params: SearchSimilarParams): Promise<Track[] | null> {
  try { 
    const { trackId = '', limit = -1 } = params;
    let query = `
      WITH
      the_track AS (
        SELECT 
          energy, 
          valence
        FROM track
        WHERE id = $1
      ),
      rank AS (
        SELECT DISTINCT ON (t.name)
          1.0*(-POWER((energy - (SELECT energy FROM the_track)), 2) -
          POWER((valence - (SELECT valence FROM the_track)), 2))/2 AS similarity,
          t.id, t.name, t.duration_ms, t.explicit, 
          al.name as album_name,
          STRING_AGG(ar.id, ',') as artist_id,
          STRING_AGG(ar.name, ',') as artist_name
        FROM track t
        JOIN album al ON t.album_id = al.id
        JOIN track_artist ta ON t.id = ta.track_id
        JOIN artist ar ON ta.artist_id = ar.id
        WHERE t.id <> $1
        GROUP BY t.id, t.name, al.name, similarity
        ORDER BY t.name, similarity desc
      )
        SELECT *
        FROM rank
        ORDER BY similarity DESC
    `;

    const queryParams: any[] = [trackId];

    if (limit > 0) {
      query += ` LIMIT $2`;
      queryParams.push(limit);
    }

    const result: QueryResult = await pool.query(query, queryParams);
    return result.rows.length > 0 ? result.rows : null;
  } catch (error) {
    console.error('Error fetching similar tracks:', error);
    throw new Error('Error fetching similar tracks');
  }
}

// export interface EmotionDistribution {
//   emotion: string;
//   track_num: number;
// }
// export async function getEmotionDistribution(trackIds: string[]): Promise<EmotionDistribution[] | null> {
//   try { 
//     const query = `
//       SELECT
//         CASE
//           WHEN energy >= 0.666 AND valence < 0.333 THEN 'Frantic'
//           WHEN energy >= 0.666 AND valence >= 0.333 AND valence < 0.666 THEN 'Tense'
//           WHEN energy >= 0.666 AND valence >= 0.666 THEN 'Euphoric'
//           WHEN energy >= 0.333 AND energy < 0.666 AND valence < 0.333 THEN 'Upset'
//           WHEN energy >= 0.333 AND energy < 0.666 AND valence >= 0.333 AND valence < 0.666 THEN 'Calm'
//           WHEN energy >= 0.333 AND energy < 0.666 AND valence >= 0.666 THEN 'Cheerful'
//           WHEN energy < 0.333 AND valence < 0.333 THEN 'Bleak'
//           WHEN energy < 0.333 AND valence >= 0.333 AND valence < 0.666 THEN 'Apathetic'
//           WHEN energy < 0.333 AND valence >= 0.666 THEN 'Serene'
//           ELSE 'Other'
//         END AS emotion,
//         COUNT(energy) AS track_num
//       FROM track
//       WHERE id = ANY($1::TEXT[])
//       GROUP BY emotion
//     `;
//     const queryParams = [trackIds];
//     const result: QueryResult = await pool.query(query, queryParams);
//     console.log(result.rows);
//     return result.rows.length > 0 ? result.rows : null;
//   } catch (error) {
//     console.error('Error fetching emotion distribution:', error);
//     throw new Error('Error fetching emotion distribution');
//   }

// }

// export interface TracksByArtists {
//   artistIds: string[];
//   limit?: number;
//   offset?: number;
// }
// export async function getTracksByArtists(params: TracksByArtists): Promise<Track[]> {
//   try { 
//     const { artistIds, limit = -1, offset = 0 } = params;
//     let query = `
//       SELECT t.*
//       FROM track t
//       JOIN track_artist ta ON t.id = ta.track_id
//       WHERE ta.artist_id = ANY($1::TEXT[])
//     `;
//     const queryParams: any[]= [artistIds];
//     if (limit > 0) {
//       query += ` LIMIT $${queryParams.length + 1}`;
//       queryParams.push(limit);
//     }
//     if (offset > 0) {
//       query += ` OFFSET $${queryParams.length + 1}`;
//       queryParams.push(offset);
//     }
//     console.log('query:', query);
//     console.log('queryParams:', queryParams);
//     const result: QueryResult = await pool.query(query, queryParams);
//     return result.rows;
//   } catch (error) {
//     console.error('Error fetching tracks by artist:', error);
//     throw new Error('Error fetching tracks by artist');
//   }
// }

export async function getTracksByAlbum(albumId: string): Promise<Track[] | null> {
  try {
    const query = `
      SELECT t.*
      FROM track t
      WHERE t.album_id = $1
    `;
    const queryParams = [albumId];
    const result: QueryResult = await pool.query(query, queryParams);
    return result.rows.length > 0 ? result.rows : null;
  } catch (error) {
    console.error('Error fetching tracks by album:', error);
    throw new Error('Error fetching tracks by album');
  }
}
// export async function getHighFreqWords(req: Request, res: Response): Promise<void> {