import { motion } from 'framer-motion';
import { MapPin, Truck, Calendar, Clock, Eye, Edit } from 'lucide-react';
import { format } from 'date-fns';
import { Link } from 'react-router-dom';
import clsx from 'clsx';

import { StatusBadge } from '../StatusBadge';

export const RequestCard = ({ request, index, onClick }) => {
  const isPlanned = request.status === 'pending' || request.status === 'approved';
  const isCompleted = request.status === 'completed';
  const isInProgress = request.status === 'in-progress';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ y: -4 }}
      className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm hover:shadow-lg transition-all duration-200 cursor-pointer"
      onClick={() => onClick?.(request)}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="font-mono text-sm font-medium text-gray-900 dark:text-white">
            {request.id}
          </h3>
          <StatusBadge status={request.status} className="mt-1" />
        </div>
        <div className="flex flex-col items-end">
          <span className="text-sm font-medium text-gray-900 dark:text-white">
            ${request.estimatedCost?.toLocaleString()}
          </span>
          <span className="text-xs text-gray-500 dark:text-gray-400">
            Est. Cost
          </span>
        </div>
      </div>

      {/* Route */}
      <div className="space-y-2 mb-4">
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4 text-gray-400" />
          <span className="text-sm text-gray-900 dark:text-white truncate">
            {request.origin}
          </span>
        </div>
        <div className="flex items-center gap-2 ml-6">
          <span className="text-gray-400">→</span>
          <span className="text-sm text-gray-600 dark:text-gray-400 truncate">
            {request.destination}
          </span>
        </div>
      </div>

      {/* Details */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-gray-400" />
          <div>
            <div className="text-xs text-gray-500 dark:text-gray-400">Pickup</div>
            <div className="text-sm text-gray-900 dark:text-white">
              {format(new Date(request.pickupDate), 'MMM dd')}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Truck className="w-4 h-4 text-gray-400" />
          <div>
            <div className="text-xs text-gray-500 dark:text-gray-400">Trucks</div>
            <div className="text-sm text-gray-900 dark:text-white">
              {request.truckCount}
            </div>
          </div>
        </div>
      </div>

      {/* Load Details */}
      {request.loadDetails && (
        <div className="mb-4">
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Load Details</p>
          <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-2">
            {request.loadDetails}
          </p>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex items-center gap-2 pt-4 border-t border-gray-100 dark:border-gray-700">
        <Link
          to={`/requests/${request.id}`}
          className="flex-1 inline-flex items-center justify-center gap-1 px-3 py-2 text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 rounded transition-colors"
          onClick={(e) => e.stopPropagation()}
        >
          <Eye className="w-3 h-3" />
          View
        </Link>

        {isPlanned && (
          <Link
            to={`/requests/${request.id}/edit`}
            className="flex-1 inline-flex items-center justify-center gap-1 px-3 py-2 text-xs bg-primary-100 hover:bg-primary-200 text-primary-700 rounded transition-colors"
            onClick={(e) => e.stopPropagation()}
          >
            <Edit className="w-3 h-3" />
            Edit
          </Link>
        )}

        {(isPlanned || isInProgress) && (
          <Link
            to={`/requests/${request.id}/delivery`}
            className="flex-1 inline-flex items-center justify-center gap-1 px-3 py-2 text-xs bg-success-100 hover:bg-success-200 text-success-700 rounded transition-colors"
            onClick={(e) => e.stopPropagation()}
          >
            <Truck className="w-3 h-3" />
            Log
          </Link>
        )}

        {isCompleted && (
          <Link
            to={`/requests/${request.id}/delivery/edit`}
            className="flex-1 inline-flex items-center justify-center gap-1 px-3 py-2 text-xs bg-warning-100 hover:bg-warning-200 text-warning-700 rounded transition-colors"
            onClick={(e) => e.stopPropagation()}
          >
            <Edit className="w-3 h-3" />
            Edit Delivery
          </Link>
        )}
      </div>
    </motion.div>
  );
};