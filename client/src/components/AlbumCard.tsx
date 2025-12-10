import { Link } from 'react-router-dom';
// import { LikeButton } from './LikeButton';

interface Album {
  id: string;
  name: string;
  artist_id: string;
  artist_name: string;
  release_date: string;
  popularity: number;
  cover_url: string;
  total_tracks: number;
  album_type: string;
}

interface AlbumCardProps {
  album: Album;
}

export function AlbumCard({ album }: AlbumCardProps) {
  const releaseYear = new Date(album.release_date).getFullYear();

  return (
    <div className="relative bg-surface rounded-lg p-4 border border-neutral-100 shadow-sm hover:shadow-lg hover:-translate-y-1 hover:scale-[1.02] transition-all duration-normal group">
      <Link to={`/album/${album.id}`} className="block">
        <div className="aspect-square rounded-md overflow-hidden mb-3">
          <img
            src={album.cover_url}
            alt={album.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-normal"
          />
        </div>
        <h3 className="text-lg font-semibold text-neutral-900 mb-1 truncate">{album.name}</h3>
        <p className="text-small text-neutral-700 mb-2 truncate">{album.artist_name}</p>
        <div className="flex items-center justify-between text-caption text-neutral-500">
          <span>{releaseYear}</span>
          <span>{album.total_tracks} tracks</span>
        </div>
      </Link>
      
      {/* 收藏按钮 */}
      {/* <div className="absolute top-2 right-2">
        <LikeButton
          objectType="albums"
          objectId={album.id}
          size="sm"
          variant="default"
        />
      </div> */}
    </div>
  );
}
