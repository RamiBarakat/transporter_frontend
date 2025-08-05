import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Search, 
  Filter, 
  Edit, 
  Eye, 
  Trash2, 
  Star, 
  Building, 
  User, 
  Phone, 
  Calendar,
  TrendingUp,
  ChevronDown
} from 'lucide-react';
import clsx from 'clsx';
import { format } from 'date-fns';
import { Pagination, PaginationInfo } from '@/shared/components/ui';

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
      'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
      className
    )}>
      {label}
    </span>
  );
};

const StarRating = ({ rating, size = 'sm' }) => {
  const stars = [];
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 !== 0;

  for (let i = 0; i < 5; i++) {
    if (i < fullStars) {
      stars.push(
        <Star
          key={i}
          className={clsx(
            'text-yellow-400 fill-current',
            size === 'sm' ? 'w-3 h-3' : 'w-4 h-4'
          )}
        />
      );
    } else if (i === fullStars && hasHalfStar) {
      stars.push(
        <div key={i} className="relative">
          <Star className={clsx('text-gray-300', size === 'sm' ? 'w-3 h-3' : 'w-4 h-4')} />
          <div className="absolute inset-0 overflow-hidden w-1/2">
            <Star className={clsx('text-yellow-400 fill-current', size === 'sm' ? 'w-3 h-3' : 'w-4 h-4')} />
          </div>
        </div>
      );
    } else {
      stars.push(
        <Star
          key={i}
          className={clsx('text-gray-300', size === 'sm' ? 'w-3 h-3' : 'w-4 h-4')}
        />
      );
    }
  }

  return (
    <div className="flex items-center gap-1">
      {stars}
      <span className={clsx(
        'ml-1 text-gray-600 dark:text-gray-400',
        size === 'sm' ? 'text-xs' : 'text-sm'
      )}>
        {rating.toFixed(1)}
      </span>
    </div>
  );
};

const DriversTableRow = ({ driver, onView, onEdit, onDelete, index }) => {
  return (
    <motion.tr
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
    >
      {/* Driver Info */}
      <td className="px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="flex-shrink-0">
            <div className="w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
              <User className="w-5 h-5 text-primary-600 dark:text-primary-400" />
            </div>
          </div>
          <div>
            <div className="font-medium text-gray-900 dark:text-white">
              {driver.name}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              ID: {driver.id}
            </div>
          </div>
        </div>
      </td>

      {/* Type */}
      <td className="px-6 py-4">
        <DriverTypeBadge type={driver.type} />
      </td>

      {/* Company/Department */}
      <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
        {driver.type === 'transporter' ? (
          <div className="flex items-center gap-2">
            <Building className="w-4 h-4 text-gray-400" />
            <span>{driver.transportCompany}</span>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <User className="w-4 h-4 text-gray-400" />
            <span>{driver.department}</span>
          </div>
        )}
      </td>

      {/* Contact */}
      <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
        {driver.type === 'transporter' ? (
          <div className="flex items-center gap-2">
            <Phone className="w-4 h-4 text-gray-400" />
            <span>{driver.phone}</span>
          </div>
        ) : (
          <span className="text-gray-500">Employee ID: {driver.employeeId}</span>
        )}
      </td>

      {/* Rating */}
      <td className="px-6 py-4">
        <StarRating rating={driver.overallRating || 0} />
      </td>

      {/* Deliveries */}
      <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-gray-400" />
          <span>{driver.totalDeliveries || 0}</span>
        </div>
      </td>

      {/* Last Delivery */}
      <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
        {driver.lastDelivery ? (
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-gray-400" />
            <span>{format(new Date(driver.lastDelivery), 'MMM dd, yyyy')}</span>
          </div>
        ) : (
          <span className="text-gray-500">Never</span>
        )}
      </td>

      {/* Actions */}
      <td className="px-6 py-4">
        <div className="flex items-center gap-2">
          <button
            onClick={() => onView(driver)}
            className="p-1.5 text-gray-400 hover:text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-lg transition-colors"
            title="View Details"
          >
            <Eye className="w-4 h-4" />
          </button>
          <button
            onClick={() => onEdit(driver)}
            className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
            title="Edit Driver"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(driver)}
            className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
            title="Delete Driver"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </td>
    </motion.tr>
  );
};

export const DriversTable = ({ 
  drivers = [], 
  loading = false, 
  onView, 
  onEdit, 
  onDelete,
  searchTerm,
  onSearchChange,
  typeFilter,
  onTypeFilterChange,
  // Pagination props
  currentPage = 1,
  paginationInfo,
  onPageChange 
}) => {
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  const sortedDrivers = [...drivers].sort((a, b) => {
    let aVal = a[sortBy];
    let bVal = b[sortBy];

    if (sortBy === 'overallRating') {
      aVal = aVal || 0;
      bVal = bVal || 0;
    }

    if (sortBy === 'totalDeliveries') {
      aVal = aVal || 0;
      bVal = bVal || 0;
    }

    if (typeof aVal === 'string') {
      aVal = aVal.toLowerCase();
      bVal = bVal.toLowerCase();
    }

    if (sortOrder === 'asc') {
      return aVal > bVal ? 1 : -1;
    } else {
      return aVal < bVal ? 1 : -1;
    }
  });

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
        <div className="p-8 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading drivers...</p>
        </div>
      </div>
    );
  }

  if (drivers.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
        <div className="p-8 text-center">
          <User className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            No drivers found
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            {searchTerm ? 'Try adjusting your search criteria.' : 'Start by adding your first driver.'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
      {/* Filters */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search drivers..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
            />
          </div>

          {/* Type Filter */}
          <div className="relative">
            <select
              value={typeFilter}
              onChange={(e) => onTypeFilterChange(e.target.value)}
              className="pl-10 pr-8 py-2 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-900 text-gray-900 dark:text-white appearance-none"
            >
              <option value="all">All Types</option>
              <option value="transporter">Transporters</option>
              <option value="in_house">In-House</option>
            </select>
            <Filter className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <ChevronDown className="w-4 h-4 absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
                onClick={() => handleSort('name')}
              >
                <div className="flex items-center gap-2">
                  Driver
                  {sortBy === 'name' && (
                    <ChevronDown className={clsx('w-4 h-4', sortOrder === 'desc' && 'rotate-180')} />
                  )}
                </div>
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
                onClick={() => handleSort('type')}
              >
                <div className="flex items-center gap-2">
                  Type
                  {sortBy === 'type' && (
                    <ChevronDown className={clsx('w-4 h-4', sortOrder === 'desc' && 'rotate-180')} />
                  )}
                </div>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Company/Dept
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Contact
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
                onClick={() => handleSort('overallRating')}
              >
                <div className="flex items-center gap-2">
                  Rating
                  {sortBy === 'overallRating' && (
                    <ChevronDown className={clsx('w-4 h-4', sortOrder === 'desc' && 'rotate-180')} />
                  )}
                </div>
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
                onClick={() => handleSort('totalDeliveries')}
              >
                <div className="flex items-center gap-2">
                  Deliveries
                  {sortBy === 'totalDeliveries' && (
                    <ChevronDown className={clsx('w-4 h-4', sortOrder === 'desc' && 'rotate-180')} />
                  )}
                </div>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Last Delivery
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {sortedDrivers.map((driver, index) => (
              <DriversTableRow
                key={driver.id}
                driver={driver}
                onView={onView}
                onEdit={onEdit}
                onDelete={onDelete}
                index={index}
              />
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer with Pagination */}
      <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          {/* Pagination Info */}
          {paginationInfo && (
            <PaginationInfo
              currentPage={paginationInfo.currentPage}
              totalPages={paginationInfo.totalPages}
              totalItems={paginationInfo.totalItems}
              itemsPerPage={paginationInfo.itemsPerPage}
            />
          )}
          
          {/* Pagination Controls */}
          {paginationInfo && paginationInfo.totalPages > 1 && onPageChange && (
            <Pagination
              currentPage={paginationInfo.currentPage}
              totalPages={paginationInfo.totalPages}
              onPageChange={onPageChange}
              showFirstLast={true}
              showPrevNext={true}
              showPageNumbers={true}
              maxVisiblePages={5}
            />
          )}
        </div>
      </div>
    </div>
  );
};