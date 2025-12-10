import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Artist } from '../lib/artistApi';

interface ArtistListProps {
  artists: Artist[]; // 当前页的艺术家数据
  loading?: boolean;
  totalItems?: number;
  currentPage?: number;
  itemsPerPage?: number;
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (pageSize: number) => void;
}

export function ArtistList({
  artists,
  loading = false,
  totalItems = 0,
  currentPage: externalCurrentPage = 1,
  itemsPerPage: externalItemsPerPage = 10,
  onPageChange,
  onPageSizeChange
}: ArtistListProps) {
  const [internalCurrentPage, setInternalCurrentPage] = useState(externalCurrentPage);
  const [internalItemsPerPage, setInternalItemsPerPage] = useState(externalItemsPerPage);

  // 使用外部传入的值或内部状态
  const currentPage = onPageChange ? externalCurrentPage : internalCurrentPage;
  const itemsPerPage = onPageSizeChange ? externalItemsPerPage : internalItemsPerPage;
  
  // 计算总页数
  const totalPages = totalItems > 0 ? Math.ceil(totalItems / itemsPerPage) : 0;

  const handlePageChange = (page: number) => {
    if (onPageChange) {
      onPageChange(page);
    } else {
      setInternalCurrentPage(page);
    }
  };

  const handlePageSizeChange = (newPageSize: number) => {
    if (onPageSizeChange) {
      onPageSizeChange(newPageSize);
    } else {
      setInternalItemsPerPage(newPageSize);
      setInternalCurrentPage(1); // 重置到第一页
    }
  };

  // 同步外部状态变化
  useEffect(() => {
    if (onPageChange) {
      setInternalCurrentPage(externalCurrentPage);
    }
  }, [externalCurrentPage, onPageChange]);

  useEffect(() => {
    if (onPageSizeChange) {
      setInternalItemsPerPage(externalItemsPerPage);
    }
  }, [externalItemsPerPage, onPageSizeChange]);

  // 计算当前页显示范围
  const startIndex = totalItems > 0 ? (currentPage - 1) * itemsPerPage + 1 : 1;
  const endIndex = totalItems > 0 ? Math.min(currentPage * itemsPerPage, totalItems) : artists.length;

  if (loading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: itemsPerPage }).map((_, index) => (
          <div key={index} className="animate-pulse">
            <div className="flex items-center gap-4 p-4 bg-surface rounded-lg border border-neutral-200">
              <div className="w-16 h-16 bg-neutral-200 rounded-lg"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-neutral-200 rounded w-1/3"></div>
                <div className="h-3 bg-neutral-200 rounded w-1/4"></div>
              </div>
              <div className="text-right space-y-2">
                <div className="h-4 bg-neutral-200 rounded w-20 ml-auto"></div>
                <div className="h-3 bg-neutral-200 rounded w-16 ml-auto"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (artists.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-body text-neutral-600">No artists available</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Artists List - 直接显示当前页的artists */}
      <div className="space-y-3">
        {artists.map((artist) => (
          <Link
            key={artist.id}
            to={`/artist/${artist.id}`}
            className="flex items-center gap-4 p-4 bg-surface rounded-lg border border-neutral-200 hover:border-primary-300 hover:shadow-md transition-all"
          >
            {/* Artist Image */}
            <img
              src={artist.urls && artist.urls.length > 0 ? artist.urls[0] : '/api/placeholder/64/64'}
              alt={artist.name}
              className="w-16 h-16 rounded-lg object-cover bg-neutral-100"
              // onError={(e) => {
              //   e.currentTarget.src = '/api/placeholder/64/64';
              // }}
            />
            
            {/* Artist Info */}
            <div className="flex-1 min-w-0">
              <h3 className="text-body font-semibold text-neutral-900 truncate">
                {artist.name}
              </h3>
              {artist.genres && artist.genres.length > 0 && (
                <p className="text-body-small text-neutral-600 truncate">
                  {artist.genres.slice(0, 3).join(', ')}
                  {artist.genres.length > 3 && ' + more'}
                </p>
              )}
            </div>

            {/* Stats */}
            <div className="text-right space-y-1">
              <div className="flex items-center gap-2 justify-end">
                <span className="text-body-small text-neutral-600">Popularity:</span>
                <span className="px-2 py-1 bg-primary-100 text-primary-700 rounded text-body-small font-medium">
                  {artist.popularity}
                </span>
              </div>
              <div className="flex items-center gap-2 justify-end">
                <span className="text-body-small text-neutral-600">Followers:</span>
                <span className="text-body font-semibold text-neutral-900">
                  {artist.followers.toLocaleString()}
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 bg-surface rounded-lg border border-neutral-200">
          {/* Page Size Selector */}
          <div className="flex items-center gap-2">
            <label htmlFor="page-size" className="text-body-small text-neutral-600">
              Show:
            </label>
            <select
              id="page-size"
              value={itemsPerPage}
              onChange={(e) => handlePageSizeChange(Number(e.target.value))}
              className="px-3 py-1 border border-neutral-300 rounded-md text-body focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
            </select>
            <span className="text-body-small text-neutral-600">per page</span>
          </div>

          {/* Page Info */}
          <div className="text-body-small text-neutral-600">
            {totalItems > 0 
              ? `Showing ${startIndex}-${endIndex} of ${totalItems} artists`
              : `Showing ${artists.length} artists`
            }
          </div>

          {/* Page Navigation */}
          <div className="flex items-center gap-1">
            <button
              onClick={() => onPageChange?.(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-3 py-1 text-body-small border border-neutral-300 rounded-md hover:bg-neutral-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Previous
            </button>
            
            {/* Page Numbers */}
            <div className="flex items-center gap-1">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (currentPage <= 3) {
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = currentPage - 2 + i;
                }

                return (
                  <button
                    key={pageNum}
                    onClick={() => onPageChange?.(pageNum)}
                    className={`px-3 py-1 text-body-small border rounded-md transition-colors ${
                      pageNum === currentPage
                        ? 'bg-primary-500 text-surface border-primary-500'
                        : 'border-neutral-300 hover:bg-neutral-50'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>

            <button
              onClick={() => onPageChange?.(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-3 py-1 text-body-small border border-neutral-300 rounded-md hover:bg-neutral-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}