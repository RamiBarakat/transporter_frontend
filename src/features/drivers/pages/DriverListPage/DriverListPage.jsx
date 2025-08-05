import { useDriverListPage } from './hooks';
import { DriverListPageUI } from './DriverListPageUI';

const DriverListPage = () => {
  const {
    // Data
    drivers,
    isLoading,
    error,
    totalCount,
    filteredCount,
    
    // UI State
    selectedDriver,
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
    isUpdating,
    isCreating,
    
    // Ratings
    driverRatings,
    performanceSummary,
    isLoadingRatings,
    handleGenerateInsights,
  } = useDriverListPage();

  return (
    <DriverListPageUI
      // Data
      drivers={drivers}
      isLoading={isLoading}
      error={error}
      totalCount={totalCount}
      filteredCount={filteredCount}
      
      // UI State
      selectedDriver={selectedDriver}
      showDetailModal={showDetailModal}
      showAddModal={showAddModal}
      searchTerm={searchTerm}
      typeFilter={typeFilter}
      
      // Pagination
      currentPage={currentPage}
      paginationInfo={paginationInfo}
      
      // Actions
      onSearchChange={setSearchTerm}
      onTypeFilterChange={setTypeFilter}
      onViewDriver={handleViewDriver}
      onEditDriver={handleEditDriver}
      onUpdateDriver={handleUpdateDriver}
      onDeleteDriver={handleDeleteDriver}
      onCloseModal={handleCloseModal}
      onAddDriver={handleAddDriver}
      onCloseAddModal={handleCloseAddModal}
      onCreateDriver={handleCreateDriver}
      onPageChange={handlePageChange}
      onRetry={refetch}
      
      // Mutations
      isUpdating={isUpdating}
      isCreating={isCreating}
      
      // Ratings
      driverRatings={driverRatings}
      performanceSummary={performanceSummary}
      isLoadingRatings={isLoadingRatings}
      onGenerateInsights={handleGenerateInsights}
    />
  );
};

export default DriverListPage;