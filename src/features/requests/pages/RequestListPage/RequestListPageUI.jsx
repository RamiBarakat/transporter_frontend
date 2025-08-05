import { motion } from 'framer-motion';
import { Plus, Search } from 'lucide-react';
import { Link } from 'react-router-dom';

import { RequestTable, StatsCards } from '../../components';

export const RequestListPageUI = ({
  requests,
  isLoading,
  error,
  stats,
  filters,
  onSearch,
  onRequestClick,
  
  // Pagination
  currentPage,
  paginationInfo,
  onPageChange,
}) => {
  const handleSearchChange = (e) => {
    const value = e.target.value;
    
    clearTimeout(window.searchTimeout);
    window.searchTimeout = setTimeout(() => {
      onSearch(value);
    }, 300);
  };

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-800">Error loading requests: {error.message}</p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Transportation Requests
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Manage and track all transportation requests
          </p>
        </div>
        <Link
          to="/requests/create"
          className="inline-flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          New Request
        </Link>
      </div>

      {/* Stats */}
      <StatsCards stats={stats} isLoading={isLoading} />

      {/* Search */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
        <div className="relative">
          <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search requests..."
            value={filters?.search || ''}
            onChange={handleSearchChange}
            className="w-full pl-10 pr-4 py-3 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
          />
        </div>
      </div>

      {/* Requests Table */}
      <RequestTable
        requests={requests}
        loading={isLoading}
        onRowClick={onRequestClick}
        currentPage={currentPage}
        paginationInfo={paginationInfo}
        onPageChange={onPageChange}
      />
    </motion.div>
  );
};