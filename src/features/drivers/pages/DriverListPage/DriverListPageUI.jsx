import { motion } from 'framer-motion';
import { Users, Plus } from 'lucide-react';

import { DriversTable, DriverDetailModal, AddDriverModal } from '../../components';

export const DriverListPageUI = ({
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
  onSearchChange,
  onTypeFilterChange,
  onViewDriver,
  onEditDriver,
  onDeleteDriver,
  onCloseModal,
  onUpdateDriver,
  onAddDriver,
  onCloseAddModal,
  onCreateDriver,
  onRetry,
  onPageChange,
  
  // Mutations
  isUpdating,
  isCreating,
  
  // Ratings
  driverRatings,
  performanceSummary,
  isLoadingRatings,
  onGenerateInsights,
}) => {
  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Drivers
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage driver profiles and performance
          </p>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-8">
          <div className="text-center">
            <div className="text-red-500 mb-4">
              <Users className="w-16 h-16 mx-auto" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Failed to load drivers
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              {error.message || 'An error occurred while fetching drivers.'}
            </p>
            <button
              onClick={onRetry}
              className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Drivers
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage driver profiles and performance • {filteredCount} of {totalCount} drivers
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <button onClick={onAddDriver} className="inline-flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors">
            <Plus className="w-4 h-4" />
            Add Driver
          </button>
        </div>
      </div>

      {/* Drivers Table */}
      <DriversTable
        drivers={drivers}
        loading={isLoading}
        onView={onViewDriver}
        onEdit={onEditDriver}
        onDelete={onDeleteDriver}
        searchTerm={searchTerm}
        onSearchChange={onSearchChange}
        typeFilter={typeFilter}
        onTypeFilterChange={onTypeFilterChange}
        currentPage={currentPage}
        paginationInfo={paginationInfo}
        onPageChange={onPageChange}
      />

      {/* Driver Detail Modal */}
      <DriverDetailModal
        driver={selectedDriver}
        isOpen={showDetailModal}
        onClose={onCloseModal}
        onUpdate={onUpdateDriver}
        onDelete={onDeleteDriver}
        isUpdating={isUpdating}
        driverRatings={driverRatings}
        performanceSummary={performanceSummary}
        isLoadingRatings={isLoadingRatings}
        onGenerateInsights={onGenerateInsights}
      />

      {/* Add Driver Modal */}
      <AddDriverModal
        isOpen={showAddModal}
        onClose={onCloseAddModal}
        onCreate={onCreateDriver}
        isCreating={isCreating}
      />
    </motion.div>
  );
};