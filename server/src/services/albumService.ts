import pool from '../database/connection';
import { QueryResult } from 'pg';

export interface Album {
    id: string;
    name: string;
    release_date: string;
    popularity: number;
    urls?: string[];
    num_tracks: number;
    type: string;
    label?: string;
    release_date_precision?: string;
    artist_ids?: string[];
    artist_names?: string[];
}

// export interface AlbumDetail extends Album {
//   genres?: string[];
//   avg_track_popularity?: number;
// }

export interface SearchAlbumsParams {
    searchTerm?: string;
    typeFilter?: 'single' | 'album' | 'compilation' | 'all';
    sortBy?: 'popularity' | 'release_date' | 'name';
    sortOrder?: 'ASC' | 'DESC';
    limit?: number;
    offset?: number;
    ids?: string[];
    artistIds?: string[];
}

export async function getAlbums(params: SearchAlbumsParams): Promise<Album[] | null> {
    try {
        const {
            searchTerm = '',
            typeFilter = 'all',
            sortBy = 'popularity',
            sortOrder = 'DESC',
            limit = -1,
            offset = 0,
            ids = [],
            artistIds = []
        } = params;

        const queryParams = [];

        let paramIndex = 0;
        const query = `
            WITH albums AS (
                SELECT *
                FROM album
                WHERE 1=1
                ${searchTerm ? ` AND name ILIKE $${++paramIndex}` : ''}
                ${typeFilter !== 'all' ? ` AND type = $${++paramIndex}` : ''}
                ${ids.length > 0 ? ` AND id = ANY($${++paramIndex}::text[])` : ''}
                ${artistIds.length === 0 ? `
                ORDER BY ${sortBy} ${sortOrder}
                ${limit > 0 ? ` LIMIT $${++paramIndex}` : ''}
                ${offset > 0 ? ` OFFSET $${++paramIndex}` : ''}
                ` : '' }
            ),
            albums2 AS (
                SELECT 
                    al.*,
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
                FROM albums al
                LEFT JOIN album_artist aa ON al.id = aa.album_id
                LEFT JOIN artist ar ON aa.artist_id = ar.id
                ${artistIds.length > 0 ? ` WHERE ar.id = ANY($${++paramIndex}::text[])` : ''}
                GROUP BY al.id, al.name, al.release_date, al.popularity, al.num_tracks, al.type, al.label, al.release_date_precision
            )
            SELECT
                al2.*,
                COALESCE(
                ARRAY_AGG(ai.url) 
                FILTER (WHERE ai.url IS NOT NULL), 
                ARRAY[]::text[]
            ) AS urls
            FROM albums2 al2
            LEFT JOIN album_image ai ON al2.id = ai.album_id
            GROUP BY al2.id, al2.name, al2.release_date, al2.popularity, al2.num_tracks, al2.type, al2.label, al2.release_date_precision, al2.artist_ids, al2.artist_names
            ORDER BY ${sortBy} ${sortOrder}
            ${artistIds.length > 0 ? `
            ${limit > 0 ? ` LIMIT $${++paramIndex}` : ''}
            ${offset > 0 ? ` OFFSET $${++paramIndex}` : ''}
            ` : '' }
        `;
        if (searchTerm) {
            queryParams.push(`%${searchTerm}%`);
        }
        if (typeFilter !== 'all') {
            queryParams.push(typeFilter);
        }
        if (ids.length > 0) {
            queryParams.push(ids);
        }
        if (artistIds.length > 0) {
            queryParams.push(artistIds);
        }
        if (limit > 0) {
            queryParams.push(limit);
        }   
        if (offset > 0) {
            queryParams.push(offset);
        }

        // console.log('With parameters:', queryParams, 'Query:', query);
        
        const result: QueryResult<Album> = await pool.query(query, queryParams);
        return result.rows.length > 0 ? result.rows : null;
    } catch (error) {
        console.error('Error fetching albums:', error);
        throw error;
    }
}

export async function getAlbumCount(params: SearchAlbumsParams): Promise<number> {
    try {
        const {
            searchTerm = '',
            typeFilter = 'all',
            ids = [],
            artistIds = []
        } = params;
        const queryParams = [];
        let paramIndex = 0;
        const query = `
            SELECT COUNT(*) AS count
            FROM album
            WHERE 1=1
            ${searchTerm ? `AND name ILIKE $${++paramIndex}` : ''}
            ${typeFilter !== 'all' ? `AND type = $${++paramIndex}` : ''}
            ${ids.length > 0 ? ` AND id = ANY($${++paramIndex}::text[])` : ''}
            ${artistIds.length > 0 ? ` AND id IN (SELECT album_id FROM album_artist WHERE artist_id = ANY($${++paramIndex}::text[]))` : ''}
        `;

        if (searchTerm) {
            queryParams.push(`%${searchTerm}%`);
        }
        if (typeFilter !== 'all') {
            queryParams.push(typeFilter);
        }
        if (ids.length > 0) {
            queryParams.push(ids);
        }
        if (artistIds.length > 0) {
            queryParams.push(artistIds);
        }

        const result: QueryResult<{ count: string }> = await pool.query(query, queryParams);
        return result.rows.length > 0 ? parseInt(result.rows[0].count, 10) : 0;
    } catch (error) {
        console.error('Error fetching album count:', error);
        throw error;
    }
}

export interface TypeDistribution {
    type: string;
    count: number;
    ratio: number;
}

export async function getTypeDistributionFromSearch(params: SearchAlbumsParams): Promise<TypeDistribution[]> {
    try {
        const {
            searchTerm = '',
            typeFilter = 'all',
            ids = [],
            artistIds = []
        } = params;
        const queryParams = [];
        let paramIndex = 0;
        const query = `
        WITH 
        type_cnts AS (
            SELECT type, COUNT(*) AS cnt
            FROM album
            WHERE 1=1
            ${searchTerm ? `AND name ILIKE $${++paramIndex}` : ''}
            ${typeFilter !== 'all' ? `AND type = $${++paramIndex}` : ''}
            ${ids.length > 0 ? ` AND id = ANY($${++paramIndex}::text[])` : ''}
            ${artistIds.length > 0 ? ` AND id IN (SELECT album_id FROM album_artist WHERE artist_id = ANY($${++paramIndex}::text[]))` : ''}
            AND type IS NOT NULL
            GROUP BY type
        ),
        cnt_total AS (
            SELECT SUM(cnt) AS total
            FROM type_cnts
        )
        SELECT
            tc.*,
            1.0 * tc.cnt / NULLIF(ct.total, 0) AS ratio
        FROM type_cnts tc, cnt_total ct
        `;

        if (searchTerm) {
            queryParams.push(`%${searchTerm}%`);
        }
        if (typeFilter !== 'all') {
            queryParams.push(typeFilter);
        }
        if (ids.length > 0) {
            queryParams.push(ids);
        }
        if (artistIds.length > 0) {
            queryParams.push(artistIds);
        }

        const result: QueryResult = await pool.query(query, queryParams);
        return result.rows
    } catch (error) {
        console.error('Error fetching type distribution:', error);
        throw error;
    }
}

export async function getAlbumById(albumId: string): Promise<Album | null> {
    try {
        let query = `
            SELECT 
                al.*,
                -- STRING_AGG(ar.id, ',') AS artist_ids,
                COALESCE(
                    ARRAY_AGG(ar.id) 
                    FILTER (WHERE ar.id IS NOT NULL), 
                    ARRAY[]::text[]
                ) AS artist_ids,
                -- STRING_AGG(ar.name, ',') AS artist_names
                COALESCE(
                    ARRAY_AGG(ar.name) 
                    FILTER (WHERE ar.name IS NOT NULL), 
                    ARRAY[]::text[]
                ) AS artist_names
            FROM album al
            LEFT JOIN album_artist aa ON al.id = aa.album_id
            LEFT JOIN artist ar ON aa.artist_id = ar.id
            WHERE al.id = $1
            GROUP BY al.id, al.name, al.release_date, al.popularity, al.num_tracks, al.type, al.label, al.release_date_precision
        `;

        query = `
        WITH albums2 AS (
            ${query}
        )
        SELECT al2.*,
        COALESCE(
            ARRAY_AGG(ai.url) 
            FILTER (WHERE ai.url IS NOT NULL), 
            ARRAY[]::text[]
        ) AS urls
        FROM albums2 al2
        LEFT JOIN album_image ai ON al2.id = ai.album_id
        GROUP BY al2.id, al2.name, al2.release_date, al2.popularity, al2.num_tracks, al2.type, al2.label, al2.release_date_precision, al2.artist_ids, al2.artist_names
        `;
        const queryParams = [albumId];

        const result: QueryResult<Album> = await pool.query(query, queryParams);
        
        return result.rows.length > 0 ? result.rows[0] : null;
    } catch (error) {
        console.error('Error fetching album by ID:', error);
        throw new Error('Error fetching album by ID');
    }
}

// export async function getAlbumsByArtist(artistId: string): Promise<Album[] | null> {
//     try {
//         const query = `
//             WITH
//             album_ids AS (
//                 SELECT album_id
//                 FROM album_artist
//                 WHERE artist_id = $1
//             ),
//             images AS (
//                 SELECT
//                     album_id,
//                     COALESCE(
//                         ARRAY_AGG(url) 
//                         FILTER (WHERE url IS NOT NULL), 
//                         ARRAY[]::text[]
//                     ) AS urls
//                 FROM album_image
//                 GROUP BY album_id
//             )
//             SELECT al.*, imgs.urls
//             FROM album al
//             LEFT JOIN images imgs ON al.id = imgs.album_id
//             WHERE al.id IN (SELECT album_id FROM album_ids)
//         `;
//         const queryParams = [artistId];

//         const result: QueryResult<Album> = await pool.query(query, queryParams);
//         return result.rows.length > 0 ? result.rows : null;
//     } catch (error) {
//         console.error('Error fetching albums by artist ID:', error);
//         throw new Error('Error fetching albums by artist ID');
//     }
// }



