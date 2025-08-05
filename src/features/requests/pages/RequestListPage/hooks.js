import { useMemo, useState, useEffect } from 'react';
import { useRequests } from '../../api';
import { useRequestsStore } from '../../store';

export const useRequestListPage = () => {
  const { filters, setFilter } = useRequestsStore();
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  
  const { data, isLoading, error, refetch } = useRequests({ 
    search: filters.search,
    page: currentPage,
    limit: itemsPerPage
  });
  
  const requests = data?.data || [];

  const handleSearch = (term) => {
    setFilter('search', term);
  };

  const handleRefresh = () => {
    refetch();
  };

  // Extract pagination metadata from response
  const paginationInfo = useMemo(() => {
    if (!data) return null;
    
    if (data.pagination) {
      const pagination = data.pagination;
      return {
        currentPage: pagination.currentPage || currentPage,
        totalPages: pagination.totalPages || 1,
        totalItems: pagination.totalItems || 0,
        itemsPerPage: pagination.itemsPerPage || itemsPerPage,
        hasNextPage: pagination.hasNextPage || false,
        hasPrevPage: pagination.hasPrevPage || false
      };
    }
    
    // No fallback - backend should always provide pagination metadata
    return null;
  }, [data, currentPage, itemsPerPage]);

  // Pagination handlers
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Reset pagination when search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [filters.search]);

  // Calculate simple stats - use pagination total if available
  const stats = useMemo(() => {
    if (!requests || !Array.isArray(requests)) return { total: 0, planned: 0, completed: 0 };
    
    // Use pagination total for accurate count, fallback to current page count
    const totalCount = paginationInfo?.totalItems || requests.length;
    
    return {
      total: totalCount,
      planned: requests.filter(r => r.status === 'planned' || r.status === 'approved').length,
      completed: requests.filter(r => r.status === 'completed').length,
    };
  }, [requests, paginationInfo]);

  return {
    requests: Array.isArray(requests) ? requests : [],
    isLoading,
    error,
    stats,
    filters,
    
    // Pagination
    currentPage,
    paginationInfo,
    
    // Actions
    handleSearch,
    handleRefresh,
    handlePageChange,
  };
};