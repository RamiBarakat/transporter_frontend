import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, Clock, Star, Building, User } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { useDebounce } from 'use-debounce';
import clsx from 'clsx';

import { useDriverSearch, useRecentDrivers } from '@/features/drivers/api';

const DriverTypeBadge = ({ type }) => {
  const config = {
    transporter: {
      label: 'Transporter',
      className: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
    },
    in_house: {
      label: 'In-House',
      className: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
    },
  };

  const { label, className } = config[type] || config.transporter;

  return (
    <span className={clsx(
      'inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium',
      className
    )}>
      {label}
    </span>
  );
};

const DriverSearchResult = ({ driver, onSelect, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      onClick={() => onSelect(driver)}
      className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer border-b border-gray-100 dark:border-gray-700 last:border-b-0"
    >
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h4 className="font-medium text-gray-900 dark:text-white">
              {driver.name}
            </h4>
            <DriverTypeBadge type={driver.type} />
          </div>
          
          <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
            {driver.type === 'transporter' ? (
              <div className="flex items-center gap-1">
                <Building className="w-4 h-4" />
                <span>{driver.transportCompany}</span>
              </div>
            ) : (
              <div className="flex items-center gap-1">
                <User className="w-4 h-4" />
                <span>ID: {driver.employeeId}</span>
              </div>
            )}
            
            {driver.overallRating > 0 && (
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 text-yellow-400 fill-current" />
                <span>{driver.overallRating}/5</span>
              </div>
            )}
            
            <span>{driver.totalDeliveries} deliveries</span>
          </div>
        </div>
        
        <button className="text-primary-600 hover:text-primary-700 text-sm font-medium">
          Select
        </button>
      </div>
    </motion.div>
  );
};

export const DriverSearch = ({ onSelectDriver, onClose, className = "" }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [debouncedSearchTerm] = useDebounce(searchTerm, 300);
  const searchInputRef = useRef(null);

  useEffect(() => {
    searchInputRef.current?.focus();
  }, []);

  const { 
    data: searchResults, 
    isLoading: isSearching 
  } = useDriverSearch(
    debouncedSearchTerm, 
    { type: typeFilter },
    { enabled: debouncedSearchTerm.length >= 2 || typeFilter !== 'all' }
  );

  const { 
    data: recentDrivers, 
    isLoading: isLoadingRecent 
  } = useRecentDrivers();

  const handleDriverSelect = (driver) => {
    const driverWithTempId = {
      ...driver,
      tempId: Date.now(),
      rating: {
        punctuality: 0,
        professionalism: 0,
        overall: 0,
        comments: ''
      }
    };
    onSelectDriver(driverWithTempId);
  };

  const showSearchResults = debouncedSearchTerm.length >= 2 || typeFilter !== 'all';
  const showRecentDrivers = !showSearchResults && !isLoadingRecent;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className={clsx(
        "bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-lg max-h-96 flex flex-col",
        className
      )}
    >
      {/* Header */}
      <div className="p-4 border-b border-gray-100 dark:border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-gray-900 dark:text-white">
            Search Drivers
          </h3>
          <button
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search Input */}
        <div className="relative mb-4">
          <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            ref={searchInputRef}
            type="text"
            placeholder="Search by name, company, or employee ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
          />
        </div>

        {/* Type Filter */}
        <div className="flex gap-2">
          {['all', 'transporter', 'in_house'].map((type) => (
            <button
              key={type}
              onClick={() => setTypeFilter(type)}
              className={clsx(
                'px-3 py-1.5 text-sm rounded-lg transition-colors',
                typeFilter === type
                  ? 'bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
              )}
            >
              {type === 'all' ? 'All' : type === 'in_house' ? 'in-house' : 'transporter'}
            </button>
          ))}
        </div>
      </div>

      {/* Results */}
      <div className="flex-1 overflow-y-auto">
        {showSearchResults ? (
          <div>
            {isSearching ? (
              <div className="p-8 text-center">
                <div className="animate-spin w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full mx-auto"></div>
                <p className="text-gray-500 dark:text-gray-400 mt-2">Searching...</p>
              </div>
            ) : searchResults?.data?.length > 0 ? (
              <div>
                <div className="p-3 bg-gray-50 dark:bg-gray-700 border-b border-gray-100 dark:border-gray-600">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Found {searchResults.data.length} driver{searchResults.data.length !== 1 ? 's' : ''}
                  </p>
                </div>
                {searchResults.data.map((driver, index) => (
                  <DriverSearchResult
                    key={driver.id}
                    driver={driver}
                    onSelect={handleDriverSelect}
                    index={index}
                  />
                ))}
              </div>
            ) : (
              <div className="p-8 text-center">
                <Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                  No drivers found
                </h4>
                <p className="text-gray-600 dark:text-gray-400">
                  Try adjusting your search terms or create a new driver.
                </p>
              </div>
            )}
          </div>
        ) : showRecentDrivers ? (
          <div>
            <div className="p-3 bg-gray-50 dark:bg-gray-700 border-b border-gray-100 dark:border-gray-600">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Recent Drivers
                </p>
              </div>
            </div>
            {recentDrivers?.data?.map((driver, index) => (
              <DriverSearchResult
                key={driver.id}
                driver={driver}
                onSelect={handleDriverSelect}
                index={index}
              />
            ))}
          </div>
        ) : (
          <div className="p-8 text-center">
            <Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h4 className="font-medium text-gray-900 dark:text-white mb-2">
              Search for drivers
            </h4>
            <p className="text-gray-600 dark:text-gray-400">
              Type at least 2 characters to search for existing drivers.
            </p>
          </div>
        )}
      </div>
    </motion.div>
  );
};