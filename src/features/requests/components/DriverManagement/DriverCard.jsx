import { motion } from 'framer-motion';
import { X, Building, User, Phone, Calendar, Star } from 'lucide-react';
import { useState } from 'react';
import clsx from 'clsx';
import { DriverRatingForm } from './DriverRatingForm';

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

export const DriverCard = ({ 
  driver, 
  onRemove, 
  onRatingChange,
  showRemoveButton = true,
  className = "",
  index = 0
}) => {
  const [ratingExpanded, setRatingExpanded] = useState(false);

  const handleRatingChange = (newRating) => {
    onRatingChange?.(driver.tempId || driver.id, newRating);
  };

  const toggleRatingForm = () => {
    setRatingExpanded(!ratingExpanded);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className={clsx(
        "bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden",
        className
      )}
    >
      {/* Driver Info Header */}
      <div className="p-4 border-b border-gray-100 dark:border-gray-700">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h3 className="font-semibold text-gray-900 dark:text-white">
                {driver.name}
              </h3>
              <DriverTypeBadge type={driver.type} />
            </div>
            
            <div className="space-y-1">
              {driver.type === 'transporter' ? (
                <>
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <Building className="w-4 h-4" />
                    <span>{driver.transportCompany}</span>
                  </div>
                  {driver.phone && (
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                      <Phone className="w-4 h-4" />
                      <span>{driver.phone}</span>
                    </div>
                  )}
                </>
              ) : (
                <>
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <User className="w-4 h-4" />
                    <span>Employee ID: {driver.id}</span>
                  </div>
                </>
              )}
            </div>

            {/* Existing Driver Stats */}
            {driver.totalDeliveries > 0 && (
              <div className="flex items-center gap-4 mt-3 pt-3 border-t border-gray-100 dark:border-gray-700">
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-yellow-400 fill-current" />
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {driver.overallRating}/5
                  </span>
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {driver.totalDeliveries} deliveries
                </div>
              </div>
            )}
          </div>

          {showRemoveButton && (
            <button
              onClick={() => onRemove(driver.tempId || driver.id)}
              className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Rating Form */}
      <DriverRatingForm
        driver={driver}
        rating={driver.rating || {}}
        onRatingChange={handleRatingChange}
        collapsed={!ratingExpanded}
        onToggleCollapse={toggleRatingForm}
        className="m-4"
      />
    </motion.div>
  );
};