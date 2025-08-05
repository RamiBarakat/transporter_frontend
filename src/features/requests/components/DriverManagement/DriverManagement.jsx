import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Users, AlertCircle } from 'lucide-react';
import { useState } from 'react';
import clsx from 'clsx';

import { DriverSearch } from './DriverSearch';
import { DriverForm } from './DriverForm';
import { DriverCard } from './DriverCard';

export const DriverManagement = ({ 
  selectedDrivers = [], 
  onUpdateDrivers,
  className = "",
  required = true
}) => {
  const [showDriverSearch, setShowDriverSearch] = useState(false);
  const [showDriverForm, setShowDriverForm] = useState(false);

  const handleAddExistingDriver = (driver) => {
    // Check if driver is already added
    const isAlreadyAdded = selectedDrivers.some(
      d => d.id === driver.id || d.tempId === driver.tempId
    );

    if (!isAlreadyAdded) {
      onUpdateDrivers([...selectedDrivers, driver]);
    }
    setShowDriverSearch(false);
  };

  const handleAddNewDriver = (driver) => {
    onUpdateDrivers([...selectedDrivers, driver]);
    setShowDriverForm(false);
  };

  const handleRemoveDriver = (driverId) => {
    onUpdateDrivers(selectedDrivers.filter(d => 
      d.id !== driverId && d.tempId !== driverId
    ));
  };

  const handleUpdateDriverRating = (driverId, rating) => {
    onUpdateDrivers(selectedDrivers.map(driver =>
      (driver.id === driverId || driver.tempId === driverId)
        ? { ...driver, rating }
        : driver
    ));
  };

  const hasValidationError = required && selectedDrivers.length === 0;

  return (
    <div className={clsx("space-y-4", className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Add existing drivers (in-house or transporter) or create new transporter drivers
            {required && <span className="text-red-500 ml-1">*</span>}
          </p>
        </div>
        <div className="text-sm text-gray-500 dark:text-gray-400">
          {selectedDrivers.length} driver{selectedDrivers.length !== 1 ? 's' : ''} added
        </div>
      </div>

      {/* Validation Error */}
      {hasValidationError && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg"
        >
          <AlertCircle className="w-4 h-4 text-red-600 dark:text-red-400" />
          <p className="text-sm text-red-700 dark:text-red-300">
            At least one driver is required for this delivery.
          </p>
        </motion.div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-3">
        <button
          onClick={() => setShowDriverSearch(true)}
          className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
        >
          <Users className="w-4 h-4" />
          Add Existing Driver
        </button>
        <button
          onClick={() => setShowDriverForm(true)}
          className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add New Transporter
        </button>
      </div>

      {/* Driver Search Modal */}
      <AnimatePresence>
        {showDriverSearch && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
            onClick={() => setShowDriverSearch(false)}
          >
            <div onClick={(e) => e.stopPropagation()} className="w-full max-w-2xl">
              <DriverSearch
                onSelectDriver={handleAddExistingDriver}
                onClose={() => setShowDriverSearch(false)}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Driver Form Modal */}
      <AnimatePresence>
        {showDriverForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
            onClick={() => setShowDriverForm(false)}
          >
            <div onClick={(e) => e.stopPropagation()} className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <DriverForm
                onSaveDriver={handleAddNewDriver}
                onCancel={() => setShowDriverForm(false)}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Selected Drivers */}
      {selectedDrivers.length > 0 && (
        <div className="space-y-4">
          <h4 className="font-medium text-gray-900 dark:text-white">
            Added Drivers ({selectedDrivers.length})
          </h4>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {selectedDrivers.map((driver, index) => (
              <DriverCard
                key={driver.tempId || driver.id}
                driver={driver}
                onRemove={handleRemoveDriver}
                onRatingChange={handleUpdateDriverRating}
                index={index}
              />
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {selectedDrivers.length === 0 && (
        <div className="text-center py-8 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-xl">
          <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h4 className="font-medium text-gray-900 dark:text-white mb-2">
            No drivers added yet
          </h4>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Add drivers who participated in this delivery to rate their performance.
          </p>
          <div className="flex flex-col sm:flex-row gap-2 justify-center">
            <button
              onClick={() => setShowDriverSearch(true)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            >
              <Users className="w-4 h-4" />
              Add Existing Driver
            </button>
            <button
              onClick={() => setShowDriverForm(true)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add New Transporter
            </button>
          </div>
        </div>
      )}
    </div>
  );
};