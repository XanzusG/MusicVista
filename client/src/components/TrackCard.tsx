import { Link } from 'react-router-dom';

interface Track {
  id: string;
  name: string;
  album_id: string;
  album_name: string;
  artist_id: string;
  artist_name: string;
  popularity: number;
  energy: number;
  danceability: number;
  valence: number;
  duration_ms: number;
  explicit: boolean;
  genres?: string[];
}

interface TrackCardProps {
  track: Track;
}

export function TrackCard({ track }: TrackCardProps) {
  const formatDuration = (durationMs: number) => {
    const minutes = Math.floor(durationMs / 60000);
    const seconds = Math.floor((durationMs % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="relative bg-surface rounded-lg p-4 border border-neutral-100 shadow-sm hover:shadow-lg hover:-translate-y-1 hover:scale-[1.02] transition-all duration-normal group">
      <Link to={`/track/${track.id}`} className="block">
        <div className="flex items-start gap-4">
          {/* Album cover placeholder */}
          <div className="w-16 h-16 rounded-md overflow-hidden flex-shrink-0 bg-neutral-200">
            <img
              src={`https://picsum.photos/seed/${track.album_id}/64/64.jpg`}
              alt={track.album_name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-normal"
            />
          </div>
          
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-neutral-900 mb-1 truncate">{track.name}</h3>
            <p className="text-small text-neutral-700 mb-2 truncate">{track.artist_name}</p>
            <p className="text-caption text-neutral-500 mb-2 truncate">{track.album_name}</p>
            
            <div className="flex items-center justify-between text-caption text-neutral-500">
              <div className="flex items-center gap-2">
                <span>{formatDuration(track.duration_ms)}</span>
                {track.explicit && (
                  <span className="px-1 py-0.5 bg-neutral-800 text-white text-xs rounded">E</span>
                )}
              </div>
              <div className="flex items-center gap-2">
                <span className="bg-primary-100 text-primary-800 px-2 py-1 rounded text-xs">
                  {track.popularity}%
                </span>
              </div>
            </div>
            
            {/* Audio features indicators */}
            <div className="flex gap-2 mt-2">
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-xs text-neutral-600">Energy {Math.round(track.energy * 100)}%</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span className="text-xs text-neutral-600">Dance {Math.round(track.danceability * 100)}%</span>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}