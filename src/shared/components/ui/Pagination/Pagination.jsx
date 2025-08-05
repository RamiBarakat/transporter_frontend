import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react';
import clsx from 'clsx';

const PaginationButton = ({ 
  children, 
  onClick, 
  disabled = false, 
  active = false, 
  className = "" 
}) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={clsx(
      'inline-flex items-center justify-center px-3 py-2 text-sm font-medium transition-colors',
      'border border-gray-300 dark:border-gray-600',
      'disabled:opacity-50 disabled:cursor-not-allowed',
      active
        ? 'bg-primary-600 text-white border-primary-600 dark:bg-primary-500 dark:border-primary-500'
        : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700',
      'first:rounded-l-lg last:rounded-r-lg',
      className
    )}
  >
    {children}
  </button>
);

const PaginationEllipsis = () => (
  <span className="inline-flex items-center justify-center px-3 py-2 text-sm font-medium text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600">
    <MoreHorizontal className="w-4 h-4" />
  </span>
);

export const Pagination = ({
  currentPage = 1,
  totalPages = 1,
  onPageChange,
  showFirstLast = true,
  showPrevNext = true,
  showPageNumbers = true,
  maxVisiblePages = 5,
  className = ""
}) => {
  if (totalPages <= 1) return null;

  const generatePageNumbers = () => {
    const pages = [];
    const halfVisible = Math.floor(maxVisiblePages / 2);
    
    let startPage = Math.max(1, currentPage - halfVisible);
    let endPage = Math.min(totalPages, currentPage + halfVisible);
    
    // Adjust if we're near the beginning or end
    if (endPage - startPage + 1 < maxVisiblePages) {
      if (startPage === 1) {
        endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
      } else {
        startPage = Math.max(1, endPage - maxVisiblePages + 1);
      }
    }
    
    // Show first page if there's a gap
    if (startPage > 1) {
      pages.push(1);
      if (startPage > 2) {
        pages.push('ellipsis-start');
      }
    }
    
    // Show page numbers
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    
    // Show last page if there's a gap
    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        pages.push('ellipsis-end');
      }
      pages.push(totalPages);
    }
    
    return pages;
  };

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages && page !== currentPage) {
      onPageChange(page);
    }
  };

  const pageNumbers = showPageNumbers ? generatePageNumbers() : [];

  return (
    <div className={clsx('flex items-center justify-center space-x-0', className)}>
      <nav className="inline-flex -space-x-px rounded-lg shadow-sm" role="navigation">
        {/* First Page */}
        {showFirstLast && currentPage > 1 && (
          <PaginationButton
            onClick={() => handlePageChange(1)}
            disabled={currentPage === 1}
            className="rounded-l-lg border-r-0"
          >
            First
          </PaginationButton>
        )}

        {/* Previous Page */}
        {showPrevNext && (
          <PaginationButton
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className={clsx(
              'border-r-0',
              !showFirstLast && 'rounded-l-lg'
            )}
          >
            <ChevronLeft className="w-4 h-4" />
            <span className="sr-only">Previous</span>
          </PaginationButton>
        )}

        {/* Page Numbers */}
        {showPageNumbers && pageNumbers.map((page, index) => {
          if (typeof page === 'string' && page.startsWith('ellipsis')) {
            return <PaginationEllipsis key={page} />;
          }

          return (
            <PaginationButton
              key={page}
              onClick={() => handlePageChange(page)}
              active={page === currentPage}
              className="border-r-0"
            >
              {page}
            </PaginationButton>
          );
        })}

        {/* Next Page */}
        {showPrevNext && (
          <PaginationButton
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={clsx(
              'border-r-0',
              !showFirstLast && 'rounded-r-lg'
            )}
          >
            <ChevronRight className="w-4 h-4" />
            <span className="sr-only">Next</span>
          </PaginationButton>
        )}

        {/* Last Page */}
        {showFirstLast && currentPage < totalPages && (
          <PaginationButton
            onClick={() => handlePageChange(totalPages)}
            disabled={currentPage === totalPages}
            className="rounded-r-lg"
          >
            Last
          </PaginationButton>
        )}
      </nav>
    </div>
  );
};

// Additional component for showing pagination info
export const PaginationInfo = ({ 
  currentPage, 
  totalPages, 
  totalItems, 
  itemsPerPage,
  className = "" 
}) => {
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  return (
    <div className={clsx('text-sm text-gray-700 dark:text-gray-300', className)}>
      Showing <span className="font-medium">{startItem}</span> to{' '}
      <span className="font-medium">{endItem}</span> of{' '}
      <span className="font-medium">{totalItems}</span> results
    </div>
  );
};