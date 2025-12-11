import { useState, useEffect } from 'react';
import { ArtistCard } from './ArtistCard';
import { Artist } from '../lib/artistApi';

interface PaginatedArtistCardsProps {
  artists: Artist[]; // Artist data for current page
  loading?: boolean;
  title?: string;
  currentPage?: number;
  totalItems?: number;
  itemsPerPage?: number;
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (pageSize: number) => void;
}

export function PaginatedArtistCards({
  artists,
  loading = false,
  title,
  currentPage: externalCurrentPage = 1,
  totalItems = 0,
  itemsPerPage: externalItemsPerPage = 12,
  onPageChange,
  onPageSizeChange
}: PaginatedArtistCardsProps) {
  const [internalCurrentPage, setInternalCurrentPage] = useState(externalCurrentPage);
  const [internalItemsPerPage, setInternalItemsPerPage] = useState(externalItemsPerPage);

  // Use external value or internal state
  const currentPage = onPageChange ? externalCurrentPage : internalCurrentPage;
  const itemsPerPage = onPageSizeChange ? externalItemsPerPage : internalItemsPerPage;
  
  // Calculate total pages
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
      setInternalCurrentPage(1); // Reset to first page
    }
  };

  // Synchronize external state changes
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

  // Calculate current page display range
  const startIndex = (currentPage - 1) * itemsPerPage + 1;
  const endIndex = Math.min(currentPage * itemsPerPage, totalItems);

  if (loading) {
    return (
      <div className="space-y-6">
        {title && <h2 className="text-h3 font-semibold text-neutral-900">{title}</h2>}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {Array.from({ length: itemsPerPage }).map((_, index) => (
            <div key={index} className="animate-pulse">
              <div className="bg-neutral-200 rounded-lg h-64"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (artists.length === 0) {
    return (
      <div className="space-y-6">
        {title && <h2 className="text-h3 font-semibold text-neutral-900">{title}</h2>}
        <div className="text-center py-12">
          <p className="text-body text-neutral-600">No artists found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Title */}
      {title && (
        <h2 className="text-h3 font-semibold text-neutral-900">{title}</h2>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {artists.map((artist) => (
          <ArtistCard key={artist.id} artist={artist} />
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
              <option value={8}>8</option>
              <option value={12}>12</option>
              <option value={16}>16</option>
              <option value={24}>24</option>
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
              onClick={() => handlePageChange(currentPage - 1)}
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
                    onClick={() => handlePageChange(pageNum)}
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
              onClick={() => handlePageChange(currentPage + 1)}
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