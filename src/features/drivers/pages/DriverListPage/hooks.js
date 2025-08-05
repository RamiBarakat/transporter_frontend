import { useState, useMemo, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { driversApi } from '../../api';
import { useUpdateDriver, useCreateDriver, useDriverRatings, useGenerateDriverInsights } from '../../api';
import { useNotificationStore } from '@/app/store';

const useDriverListPage = () => {
  const [selectedDriver, setSelectedDriver] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5); // Fixed items per page


  const { 
    data: driversResponse, 
    isLoading, 
    error, 
    refetch 
  } = useQuery({
    queryKey: ['drivers', typeFilter, currentPage, itemsPerPage],
    queryFn: () => driversApi.searchDrivers('', { 
      type: typeFilter,
      page: currentPage,
      limit: itemsPerPage
    }),
    staleTime: 5 * 60 * 1000, 
    gcTime: 10 * 60 * 1000,
  });

  const updateDriverMutation = useUpdateDriver();
  const createDriverMutation = useCreateDriver();
  const generateInsightsMutation = useGenerateDriverInsights();

  // Fetch ratings for selected driver
  const { 
    data: ratingsResponse, 
    isLoading: isLoadingRatings 
  } = useDriverRatings(selectedDriver?.id, {
    enabled: !!selectedDriver?.id && showDetailModal
  });

  console.log('Driver Data Debug:', {
    selectedDriver,
    selectedDriverId: selectedDriver?.id,
    selectedDriverType: typeof selectedDriver?.id,
    showDetailModal,
    hasSelectedDriver: !!selectedDriver
  });

  // Extract drivers from response (handle wrapped response)
  const allDrivers = useMemo(() => {
    if (!driversResponse) return [];
    
    // Handle both wrapped and unwrapped responses
    const data = driversResponse.data || driversResponse;
    return Array.isArray(data) ? data : data?.data || [];
  }, [driversResponse]);

  // Extract pagination metadata from response
  const paginationInfo = useMemo(() => {
    if (!driversResponse) return null;
    
    // Check if response has pagination metadata at root level
    if (driversResponse.pagination) {
      const pagination = driversResponse.pagination;
      return {
        currentPage: pagination.currentPage || currentPage,
        totalPages: pagination.totalPages || 1,
        totalItems: pagination.total || allDrivers.length,
        itemsPerPage: pagination.limit || itemsPerPage,
        hasNextPage: pagination.hasNextPage || false,
        hasPrevPage: pagination.hasPreviousPage || false
      };
    }
    
    // Legacy: Check if pagination is embedded in data object
    const data = driversResponse.data || driversResponse;
    if (data && !Array.isArray(data)) {
      return {
        currentPage: data.currentPage || currentPage,
        totalPages: data.totalPages || 1,
        totalItems: data.totalItems || data.total || allDrivers.length,
        itemsPerPage: data.itemsPerPage || data.limit || itemsPerPage,
        hasNextPage: data.hasNextPage || currentPage < (data.totalPages || 1),
        hasPrevPage: data.hasPrevPage || currentPage > 1
      };
    }
    
    // Fallback for non-paginated response (calculate pagination based on all data)
    const totalItems = allDrivers.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    
    return {
      currentPage,
      totalPages,
      totalItems,
      itemsPerPage,
      hasNextPage: currentPage < totalPages,
      hasPrevPage: currentPage > 1
    };
  }, [driversResponse, currentPage, itemsPerPage, allDrivers.length]);


//   useEffect(() => {
//     // Only run if a driver is selected and the master list from the cache is available.
//     if (selectedDriver?.id && allDrivers.length > 0) {
//       // Find the latest version of the selected driver from the cache.
//       const updatedDriverFromCache = allDrivers.find(d => d.id === selectedDriver.id);

//       // If the driver is found and its data has changed, update our local state.
//       if (updatedDriverFromCache && JSON.stringify(updatedDriverFromCache) !== JSON.stringify(selectedDriver)) {
//         setSelectedDriver(updatedDriverFromCache);
//       }
//     }
//   }, [allDrivers, selectedDriver]); // Rerun whenever the master list or the selected driver changes.
//   // --- FIX ENDS HERE ---

  // Filter drivers based on search term and type
  const filteredDrivers = useMemo(() => {
    let filtered = allDrivers;

    // Filter by type
    if (typeFilter !== 'all') {
      filtered = filtered.filter(driver => driver.type === typeFilter);
    }

    // Filter by search term
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(driver =>
        driver.name?.toLowerCase().includes(term) ||
        driver.transportCompany?.toLowerCase().includes(term) ||
        driver.department?.toLowerCase().includes(term) ||
        driver.employeeId?.toLowerCase().includes(term) ||
        driver.phone?.includes(term)
      );
    }

    return filtered;
  }, [allDrivers, searchTerm, typeFilter]);

  const handleViewDriver = (driver) => {
    console.log('Selected driver for viewing:', driver);
    setSelectedDriver(driver);
    setShowDetailModal(true);
  };

  const handleEditDriver = (driver) => {
    setSelectedDriver(driver);
    setShowDetailModal(true);
  };

  const handleUpdateDriver = async (driverId, updateData) => {
    try {
      await updateDriverMutation.mutateAsync({ id: driverId, data: updateData });
      refetch();
    } catch (error) {
      console.error('Failed to update driver:', error);
      throw error;
    }
  };

  const handleDeleteDriver = async (driver) => {
    if (!window.confirm(`Are you sure you want to delete ${driver.name}? This action cannot be undone.`)) {
      return;
    }

    try {
      
      setShowDetailModal(false);
      refetch();
    } catch (error) {
        console.error('Failed to delete driver:', error);
    }
  };

  const handleCloseModal = () => {
    setShowDetailModal(false);
    setSelectedDriver(null);
  };

  const handleAddDriver = () => {
    setShowAddModal(true);
  };

  const handleCloseAddModal = () => {
    setShowAddModal(false);
  };

  const handleCreateDriver = async (driverData) => {
    try {
      await createDriverMutation.mutateAsync(driverData);
      setShowAddModal(false);
      refetch();
    } catch (error) {
      console.error('Failed to create driver:', error);
      // Error handling is done in the mutation
    }
  };

  const handleGenerateInsights = async (driver, ratings) => {
    try {
      console.log('Generating insights - Input validation:', {
        driver: driver,
        driverId: driver?.id,
        driverIdType: typeof driver?.id,
        driverName: driver?.name,
        hasDriver: !!driver,
        ratingsCount: ratings?.length,
        ratingsData: ratings,
        selectedDriverFromState: selectedDriver,
        selectedDriverIdFromState: selectedDriver?.id
      });

      // Validate inputs
      if (!driver) {
        console.error('Driver object is missing');
        return;
      }
      if (!driver.id) {
        console.error('Driver ID is missing from driver object');
        return;
      }
      if (!ratings || ratings.length === 0) {
        console.warn('No ratings data available for insights generation');
      }
      
      const result = await generateInsightsMutation.mutateAsync({
        driverId: driver.id,
        ratingsData: ratings || []
      });
      
      console.log('Insights generation result:', result);
      
      // Force update the selectedDriver state to reflect changes
      setSelectedDriver(prev => prev ? {
        ...prev,
        aiInsights: result.aiInsights || result.data?.aiInsights || result,
        aiInsightsUpdatedAt: new Date().toISOString()
      } : prev);
      
    } catch (error) {
      console.error('Failed to generate insights:', error);
    }
  };

  // Extract ratings from response
  const driverRatings = useMemo(() => {
    if (!ratingsResponse) return [];
    
    // Handle the nested response structure from backend
    const responseData = ratingsResponse.data || ratingsResponse;
    

    
    // Backend returns: { driver, summary, ratings, totalRatings }
    if (responseData?.ratings && Array.isArray(responseData.ratings)) {
      return responseData.ratings;
    }
    
    // Fallback for other response formats
    return Array.isArray(responseData) ? responseData : responseData?.data || [];
  }, [ratingsResponse]);

  // Extract performance summary from response
  const performanceSummary = useMemo(() => {
    if (!ratingsResponse) return null;
    
    const responseData = ratingsResponse.data || ratingsResponse;
    return responseData?.summary || null;
  }, [ratingsResponse]);

  // Pagination handlers
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Reset pagination when search/filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, typeFilter]);

  return {
    // Data
    drivers: filteredDrivers,
    allDrivers,
    isLoading,
    error,
    totalCount: allDrivers.length,
    filteredCount: filteredDrivers.length,
    
    // UI State
    selectedDriver, // Use original selectedDriver for now
    showDetailModal,
    showAddModal,
    searchTerm,
    typeFilter,
    
    // Pagination
    currentPage,
    paginationInfo,
    
    // Actions
    setSearchTerm,
    setTypeFilter,
    handleViewDriver,
    handleEditDriver,
    handleUpdateDriver,
    handleDeleteDriver,
    handleCloseModal,
    handleAddDriver,
    handleCloseAddModal,
    handleCreateDriver,
    handlePageChange,
    refetch,
    
    // Mutations
    isUpdating: updateDriverMutation.isPending,
    isCreating: createDriverMutation.isPending,
    
    // Ratings
    driverRatings,
    performanceSummary,
    isLoadingRatings,
    handleGenerateInsights,
  };
};

export { useDriverListPage };