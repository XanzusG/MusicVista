import pool from '../database/connection';
import { QueryResult } from 'pg';

export interface LoveDistribution {    
    emotion: string;
    cnt: number;
    ratio: number;
}

export interface ArtistGrowthData {
    artist_id: number;
    artist: string;
    pre_album_id: number;
    prev_album: string;
    prev_release_date: string;
    prev_popularity: number;
    curr_album_id: number;
    curr_album: string;
    curr_release_date: string;
    curr_popularity: number;
    popularity_growth_ratio: number;
}

export interface ArtistEmotionVarietyData {
    id: number;
    name: string;
    variety: number;
}
const basicStopWords = [
    '',
    // Articles
    'a', 'an', 'the',
    
    // Common conjunctions
    'and', 'or', 'but', 'if', 'because', 'as', 'so', 'than', 'such',
    
    // Pronouns
    'i', 'me', 'my', 'mine', 'myself',
    'you', 'your', 'yours', 'yourself', 'yourselves',
    'he', 'him', 'his', 'himself',
    'she', 'her', 'hers', 'herself',
    'it', 'its', 'itself',
    'we', 'us', 'our', 'ours', 'ourselves',
    'they', 'them', 'their', 'theirs', 'themselves',
    'this', 'that', 'these', 'those',
    
    // Prepositions
    'about', 'above', 'across', 'after', 'against', 'along', 'among', 'around',
    'at', 'before', 'behind', 'below', 'beneath', 'beside', 'between', 'beyond',
    'by', 'down', 'during', 'except', 'for', 'from', 'in', 'inside', 'into',
    'near', 'of', 'off', 'on', 'onto', 'out', 'outside', 'over', 'past',
    'since', 'through', 'throughout', 'till', 'to', 'toward', 'under',
    'underneath', 'until', 'up', 'upon', 'with', 'within', 'without',
    
    // Auxiliary and linking verbs
    'am', 'is', 'are', 'was', 'were', 'be', 'been', 'being',
    'have', 'has', 'had', 'having',
    'do', 'does', 'did', 'doing',
    
    // Modal verbs
    'can', 'could', 'may', 'might', 'must', 'shall', 'should', 'will', 'would',
    
    // Adverbs
    'very', 'too', 'just', 'then', 'there', 'here', 'when', 'where', 'why',
    'how', 'now', 'then', 'again', 'also', 'even', 'only', 'not', 'no',
    
    // Other common words
    'all', 'any', 'both', 'each', 'few', 'more', 'most', 'other', 'some',
    'same', 'own', 'else', 'whether', 'while', 'though', 'although',
    
    // Quantifiers
    'one', 'two', 'three', 'first', 'second', 'third', 'many', 'much',
    'more', 'most', 'less', 'least', 'few', 'fewer', 'fewest'
];
export async function getLoveDistribution(): Promise<LoveDistribution[]> { 
    try {
        const query = `
            WITH
            love_tracks AS (
                SELECT track_id, (CHAR_LENGTH(lyrics) - CHAR_LENGTH(REPlACE(lyrics, 'love', ''))) / CHAR_LENGTH('love') AS cnt
                FROM track_lyrics
                WHERE lyrics ILIKE '%love%'
            ),
            track_emotion AS (
                SELECT t.id,
                    lt.cnt,
                    CASE
                        WHEN energy < 0.333 AND valence < 0.333 THEN 'Bleak'
                        WHEN energy < 0.333 AND valence > 0.666 THEN 'Serene'
                        WHEN energy < 0.333 AND valence  BETWEEN 0.333 AND 0.666 THEN 'Apathetic'
                        WHEN energy > 0.666 AND valence < 0.333 THEN 'Frantic'
                        WHEN energy > 0.666 AND valence > 0.666 THEN 'Euphoric'
                        WHEN energy > 0.666 AND valence BETWEEN 0.333 AND 0.666 THEN 'Tense'
                        WHEN energy BETWEEN 0.333 AND 0.666 AND valence < 0.333 THEN 'Upset'
                        WHEN energy BETWEEN 0.333 AND 0.666 AND valence > 0.666 THEN 'Cheerful'
                        WHEN energy BETWEEN 0.333 AND 0.666 AND valence BETWEEN 0.333 AND 0.666 THEN 'Calm'
                        ELSE 'Other' END AS emotion
                FROM track t
                RIGHT JOIN love_tracks lt ON t.id = lt.track_id
            ),
            count AS (
                SELECT emotion, SUM(cnt) AS cnt
                FROM track_emotion
                GROUP BY emotion
            ),
            total_cnt AS (
                SELECT SUM(cnt) AS total
                FROM love_tracks
            )
            SELECT emotion, cnt, 1.0 * cnt / (SELECT total FROM total_cnt) AS ratio
            FROM count;
        `;
        const result: QueryResult = await pool.query(query);
        return result.rows;
    } catch (error) {
        console.error('Error executing query', error);
        throw error;
    }
};

export async function getArtistPopularityGrowth(): Promise<ArtistGrowthData[]> {
    try {
        const query = `
            with
            artist_albums as (
                select aa.album_id, aa.artist_id, al.name, al.release_date, al.popularity,
                       row_number() over (order by aa.artist_id, al.release_date) as rn
                from album_artist aa join album al on aa.album_id = al.id
            )
            select a.id as artist_id, a.name as artist,
                   al1.album_id as pre_album_id,
                   al1.name AS prev_album,
              al1.release_date AS prev_release_date,
              al1.popularity AS prev_popularity,
              al2.album_id as curr_album_id,
              al2.name AS curr_album,
              al2.release_date AS curr_release_date,
              al2.popularity AS curr_popularity,
              ROUND(1.0*(al2.popularity - al1.popularity)/al1.popularity * 100, 2) AS popularity_growth_ratio
            FROM
              artist a
            join artist_albums al1 on a.id = al1.artist_id
            join artist_albums al2 on a.id = al2.artist_id
            where al2.rn - al1.rn = 1
            and al1.popularity > 0
            and al1.release_date >= '1900'
            and al2.release_date >= '1900'
            and al2.popularity >= 80
            order by popularity_growth_ratio desc
            limit 3;
        `;
        
        const result: QueryResult = await pool.query(query);
        return result.rows;
    } catch (error) {
        console.error('Error executing artist popularity growth query', error);
        throw error;
    }
};

export async function getArtistEmotionVariety(): Promise<ArtistEmotionVarietyData[]> {
    try {
        const query = `
            with
            at as (
                select ar.id, ar.name, tr.energy, tr.valence
                from artist ar
                join track_artist ta on ar.id = ta.artist_id
                join track tr on ta.track_id = tr.id
            ),
            mean as (
                select id, name, avg(energy) as avg_energy, avg(valence) as avg_valence, count(*) as track_num
                from at
                group by id, name
            )
            select at.id, at.name, sum(power((at.energy - mean.avg_energy), 2)) / mean.track_num + sum(power((at.valence - mean.avg_valence), 2)) / mean.track_num as variety
            from at join mean on at.id = mean.id
            group by at.id, at.name, mean.track_num
            order by variety desc
            limit 5;
        `;
        
        const result: QueryResult = await pool.query(query);
        return result.rows;
    } catch (error) {
        console.error('Error executing artist emotion variety query', error);
        throw error;
    }
};

export async function getPopWords(): Promise<{ word: string; cnt: number }[]> {
    try {
        const query = String.raw`
            with
            artist_ids as (
                select distinct artist_id
                from artist_genre
                where genre ilike '%city pop%'
            ),
            track_ids as  (
                select ta.track_id
                from track_artist ta join track t on ta.track_id = t.id
                where artist_id in (select artist_id from artist_ids)
                and energy BETWEEN 0.333 AND 0.666 AND valence > 0.666
            ),
            lyrics as (
                select *
                from track_lyrics
                where track_id in (select track_id from track_ids)
            ),
            words as (
                SELECT lower(trim(regexp_replace(word, '[^a-zA-Z]+', '', 'g'))) AS cleaned_word
                FROM lyrics,
                    regexp_split_to_table(lyrics, E'[\\s\\n\\r\\t]+') AS word   -- Use PostgreSQL escape syntax
                WHERE length(trim(regexp_replace(word, '[^a-zA-Z]+', '', 'g'))) >= 3
                AND lower(trim(regexp_replace(word, '[^a-zA-Z]+', '', 'g'))) <> ANY ($1::TEXT[])
            )
            select cleaned_word as word, count(cleaned_word) as cnt
            from words
            -- where cleaned_word ~ '^[a-z]+$'  -- Ensure only letters
            group by cleaned_word
            order by cnt desc
            limit 40;
        `;
        
        const result: QueryResult = await pool.query(query, [basicStopWords]);
        console.log('Query result:', result.rows);
        return result.rows;
    } catch (error) {
        console.error('Error executing query', error);
        throw error;
    }
};
