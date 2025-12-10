import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Layout } from '../components/Layout';
import { Music, Calendar, Disc, TrendingUp } from 'lucide-react';
import { StatCard } from '../components/StatCard';
import { Album, getAlbumById, getTracksByAlbum } from '../lib/albumApi';
import { Track } from '../lib/trackApi';
import { Artist, getArtistById } from '../lib/artistApi';

export function AlbumDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [album, setAlbum] = useState<Album | null>(null);
  const [tracks, setTracks] = useState<Track[]>([]);
  // const [artist, setArtist] = useState<Artist | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    const loadAlbumData = async () => {
      try {
        setLoading(true);
        setError(null);

        // 并行加载专辑、音轨和艺术家数据
        const [albumResponse, tracksResponse] = await Promise.all([
          getAlbumById(id),
          getTracksByAlbum(id)
        ]);

        if (albumResponse.success && albumResponse.data) {
          setAlbum(albumResponse.data);

          if (tracksResponse.success && tracksResponse.data) {
            setTracks(tracksResponse.data);

            // 获取第一个艺术家信息（假设专辑可能有多位艺术家，取第一个）
            // if (albumResponse.data.artist_ids && albumResponse.data.artist_ids.length > 0) {
            //   const artistResponse = await getArtistById(albumResponse.data.artist_ids[0]);
            //   if (artistResponse.success && artistResponse.data) {
            //     setArtist(artistResponse.data);
            //   }
            // }
          }
        }
      } catch (err: any) {
        console.error('Error loading album data:', err);
        setError(err.message || 'Failed to load album details');
      } finally {
        setLoading(false);
      }
    };

    loadAlbumData();
  }, [id]);

  const formatDuration = (ms?: number) => {
    if (!ms) return '--:--';
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const totalDuration = tracks.reduce((sum, track) => sum + (track.duration_ms || 0), 0);
  const avgEnergy = tracks.length > 0 && tracks.some(t => t.energy !== undefined)
    ? (tracks.reduce((sum, track) => sum + (track.energy || 0), 0) / tracks.filter(t => t.energy !== undefined).length).toFixed(2)
    : '--';

  if (loading) {
    return (
      <Layout>
        <div className="container mx-auto px-8 py-16 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-body-large text-neutral-500">Loading album details...</p>
        </div>
      </Layout>
    );
  }

  if (error || !album) {
    return (
      <Layout>
        <div className="container mx-auto px-8 py-16 text-center">
          <p className="text-body-large text-red-500 mb-4">
            {error || 'Album not found'}
          </p>
          <Link
            to="/explore"
            className="text-primary-500 hover:text-primary-600 underline"
          >
            Back to Explore
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-primary-50 to-surface py-12">
        <div className="container mx-auto px-8">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
            <div className="md:col-span-4">
              <img
                src={album.urls && album.urls.length > 0 ? album.urls[0] : '/api/placeholder/400/400'}
                alt={album.name}
                className="w-full aspect-square rounded-lg object-cover shadow-lg"
                // onError={(e) => {
                //   e.currentTarget.src = '/api/placeholder/400/400';
                // }}
              />
            </div>
            <div className="md:col-span-8 flex flex-col justify-center">
              <p className="text-small text-neutral-700 mb-2 capitalize">{album.type}</p>
              <h1 className="text-h1 font-bold text-neutral-900 mb-4">{album.name}</h1>
              
              {album.artist_ids && album.artist_ids.length > 0 && (
                <div className="text-body-large text-primary-500 hover:text-primary-600 mb-6">
                  {album.artist_ids.map((artistId, index) => (
                    <span key={artistId}>
                      <Link
                        to={`/artist/${artistId}`}
                        className="hover:text-primary-600 hover:underline"
                      >
                        {album.artist_names[index]}
                      </Link>
                      {index < album.artist_ids.length - 1 && <span className="text-neutral-700">, </span>}
                    </span>
                  ))}
                </div>
              )}

              <div className="flex gap-8 text-body">
                <div>
                  <p className="text-neutral-700">Release Date</p>
                  <p className="text-body font-semibold text-neutral-900">
                    {new Date(album.release_date).toLocaleDateString('en-US')}
                  </p>
                </div>
                <div>
                  <p className="text-neutral-700">Tracks</p>
                  <p className="text-body font-semibold text-neutral-900">{album.num_tracks}</p>
                </div>
                <div>
                  <p className="text-neutral-700">Popularity</p>
                  <p className="text-body font-semibold text-neutral-900">{album.popularity}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Artist Card */}
      {/* {artist && (
        <div className="bg-surface py-12">
          <div className="container mx-auto px-8">
            <h2 className="text-h2 font-semibold text-neutral-900 mb-6">Artist</h2>
            <Link
              to={`/artist/${artist.id}`}
              className="bg-surface rounded-lg p-6 border border-neutral-100 shadow-sm hover:shadow-md transition-all inline-flex items-center gap-6 group"
            >
              <img
                src={artist.urls && artist.urls.length > 0 ? artist.urls[0] : '/api/placeholder/96/96'}
                alt={artist.name}
                className="w-24 h-24 rounded-md object-cover"
                onError={(e) => {
                  e.currentTarget.src = '/api/placeholder/96/96';
                }}
              />
              <div>
                <h3 className="text-h3 font-semibold text-neutral-900 mb-2 group-hover:text-primary-500">
                  {artist.name}
                </h3>
                <p className="text-body text-neutral-700 mb-2">
                  {(artist.followers / 1000000).toFixed(1)}M followers
                </p>
                {artist.genres && artist.genres.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {artist.genres.map((genre) => (
                      <span
                        key={genre}
                        className="text-caption px-2 py-1 bg-primary-50 text-primary-900 rounded-full"
                      >
                        {genre}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </Link>
          </div>
        </div>
      )} */}

      {/* Stats */}
      {/* <div className="bg-background py-12">
        <div className="container mx-auto px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <StatCard
              icon={<Music className="w-8 h-8" />}
              title="Total Tracks"
              value={tracks.length}
            />
            <StatCard
              icon={<Calendar className="w-8 h-8" />}
              title="Total Duration"
              value={formatDuration(totalDuration)}
            />
            <StatCard
              icon={<TrendingUp className="w-8 h-8" />}
              title="Average Energy"
              value={avgEnergy}
            />
          </div>
        </div>
      </div> */}

      {/* Tracks List */}
      <div className="bg-surface py-12">
        <div className="container mx-auto px-8">
          <h2 className="text-h2 font-semibold text-neutral-900 mb-6">Track List</h2>
          <div className="bg-surface rounded-lg shadow-sm border border-neutral-100 overflow-hidden">
            <table className="w-full">
              <thead className="bg-neutral-50 border-b border-neutral-200">
                <tr>
                  <th className="text-left py-3 px-4 text-small font-semibold text-neutral-700">#</th>
                  <th className="text-left py-3 px-4 text-small font-semibold text-neutral-700">Song Title</th>
                  <th className="text-left py-3 px-4 text-small font-semibold text-neutral-700">Duration</th>
                  <th className="text-left py-3 px-4 text-small font-semibold text-neutral-700">Energy</th>
                  <th className="text-left py-3 px-4 text-small font-semibold text-neutral-700">Danceability</th>
                </tr>
              </thead>
              <tbody>
                {tracks.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-body text-neutral-600">
                      No tracks available
                    </td>
                  </tr>
                ) : (
                  tracks.map((track, index) => (
                    <tr
                      key={track.id}
                      className="border-b border-neutral-100 hover:bg-primary-50 transition-colors"
                    >
                      <td className="py-3 px-4 text-body text-neutral-600">{index + 1}</td>
                      <td className="py-3 px-4">
                        <Link
                          to={`/track/${track.id}`}
                          className="text-body font-medium text-neutral-900 hover:text-primary-500"
                        >
                          {track.name}
                        </Link>
                      </td>
                      <td className="py-3 px-4 text-body text-neutral-700">
                        {formatDuration(track.duration_ms)}
                      </td>
                      <td className="py-3 px-4 text-body text-neutral-700">
                        {track.energy !== undefined ? track.energy.toFixed(2) : '--'}
                      </td>
                      <td className="py-3 px-4 text-body text-neutral-700">
                        {track.danceability !== undefined ? track.danceability.toFixed(2) : '--'}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Layout>
  );
}