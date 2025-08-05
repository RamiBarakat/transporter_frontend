import { motion } from 'framer-motion';
import { Eye, Edit, Truck, Calendar, MapPin } from 'lucide-react';
import { format } from 'date-fns';
import { Link } from 'react-router-dom';
import clsx from 'clsx';

import { DataTable } from '@/shared/components/ui/DataTable';
import { Pagination, PaginationInfo } from '@/shared/components/ui';
import { StatusBadge } from '../StatusBadge';

const PriorityBadge = ({ priority }) => {
  const priorityConfig = {
    low: { label: 'Low', className: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300' },
    medium: { label: 'Medium', className: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300' },
    high: { label: 'High', className: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300' },
  };

  const config = priorityConfig[priority] || priorityConfig.medium;

  return (
    <span className={clsx(
      'inline-flex items-center px-2 py-1 rounded-md text-xs font-medium',
      config.className
    )}>
      {config.label}
    </span>
  );
};

const ActionButtons = ({ request }) => {
  const isPlanned = request.status === 'planned' || request.status === 'approved';
  const isCompleted = request.status === 'completed';
  const isInProgress = request.status === 'in-progress';

  return (
    <div className="flex items-center gap-1">
      <Link
        to={`/requests/${request.id}`}
        className="inline-flex items-center gap-1 px-2 py-1 text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 rounded transition-colors"
        onClick={(e) => e.stopPropagation()}
      >
        <Eye className="w-3 h-3" />
        View
      </Link>

      {/* Edit Button - Available for planned requests */}
      {isPlanned && (
        <Link
          to={`/requests/${request.id}/edit`}
          className="inline-flex items-center gap-1 px-2 py-1 text-xs bg-primary-100 hover:bg-primary-200 text-primary-700 rounded transition-colors"
          onClick={(e) => e.stopPropagation()}
        >
          <Edit className="w-3 h-3" />
          Edit
        </Link>
      )}

      {/* Log Delivery Button - Available for planned/in-progress requests */}
      {(isPlanned || isInProgress) && (
        <Link
          to={`/requests/${request.id}/delivery`}
          className="inline-flex items-center gap-1 px-2 py-1 text-xs bg-success-100 hover:bg-success-200 text-success-700 rounded transition-colors"
          onClick={(e) => e.stopPropagation()}
        >
          <Truck className="w-3 h-3" />
          Log Delivery
        </Link>
      )}

      {/* Edit Delivery Button - Available for completed requests */}
      {isCompleted && (
        <Link
          to={`/requests/${request.id}/delivery/edit`}
          className="inline-flex items-center gap-1 px-2 py-1 text-xs bg-warning-100 hover:bg-warning-200 text-warning-700 rounded transition-colors"
          onClick={(e) => e.stopPropagation()}
        >
          <Edit className="w-3 h-3" />
          Edit Delivery
        </Link>
      )}
    </div>
  );
};

export const RequestTable = ({ 
  requests = [], 
  loading = false, 
  onRowClick,
  className = "",
  // Pagination props
  currentPage = 1,
  paginationInfo,
  onPageChange
}) => {
  const columns = [
    {
      key: 'id',
      label: 'Request ID',
      sortable: true,
      render: (value) => (
        <span className="font-mono text-sm font-medium text-gray-900 dark:text-white">
          {value}
        </span>
      ),
    },
    {
      key: 'origin',
      label: 'Route',
      sortable: true,
      render: (value, row) => (
        <div className="max-w-xs">
          <div className="flex items-center gap-1 text-sm text-gray-900 dark:text-white">
            <MapPin className="w-3 h-3 text-gray-400" />
            <span className="truncate">{value}</span>
          </div>
          <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400 mt-1">
            <span>→</span>
            <span className="truncate">{row.destination}</span>
          </div>
        </div>
      ),
    },
    {
      key: 'pickUpDateTime',
      label: 'Pickup Date',
      sortable: true,
      render: (value) => (
        <div className="text-sm">
          <div className="text-gray-900 dark:text-white">
            {format(new Date(value), 'MMM dd, yyyy')}
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400">
            {format(new Date(value), 'HH:mm')}
          </div>
        </div>
      ),
    },
    {
      key: 'truckCount',
      label: 'Trucks',
      sortable: true,
      render: (value) => (
        <div className="flex items-center gap-1">
          <Truck className="w-4 h-4 text-gray-400" />
          <span className="text-sm font-medium text-gray-900 dark:text-white">
            {value}
          </span>
        </div>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      sortable: true,
      render: (value) => <StatusBadge status={value} />,
    },
    {
      key: 'priority',
      label: 'Priority',
      sortable: true,
      render: (value) => <PriorityBadge priority={value} />,
    },
    {
      key: 'estimatedCost',
      label: 'Est. Cost',
      sortable: true,
      render: (value) => (
        <span className="text-sm font-medium text-gray-900 dark:text-white">
          ${value?.toLocaleString()}
        </span>
      ),
    },
    {
      key: 'actions',
      label: 'Actions',
      sortable: false,
      render: (_, row) => <ActionButtons request={row} />,
    },
  ];

  return (
    <div className={clsx("bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700", className)}>
      <DataTable
        data={requests}
        columns={columns}
        loading={loading}
        emptyMessage="No transportation requests found. Create your first request to get started."
        onRowClick={onRowClick}
        className="border-0 rounded-none"
      />
      
      {/* Pagination Footer */}
      {paginationInfo && paginationInfo.totalPages > 0 && (
        <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            {/* Pagination Info */}
            <PaginationInfo
              currentPage={paginationInfo.currentPage}
              totalPages={paginationInfo.totalPages}
              totalItems={paginationInfo.totalItems}
              itemsPerPage={paginationInfo.itemsPerPage}
            />
            
            {/* Pagination Controls */}
            {paginationInfo.totalPages > 1 && onPageChange && (
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
      )}
    </div>
  );
};