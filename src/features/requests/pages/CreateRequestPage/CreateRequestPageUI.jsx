import { motion } from 'framer-motion';
import { ArrowLeft, Save, MapPin, Calendar, Truck, Package } from 'lucide-react';

export const CreateRequestPageUI = ({
  register,
  handleSubmit,
  watch,
  errors,
  isValid,
  isSubmitting,
  estimatedDistance,
  isCalculatingDistance,
  isEditMode = false,
  goBack,
}) => {
  const [origin, destination] = watch(['origin', 'destination']);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={goBack}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-300" />
        </button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            {isEditMode ? 'Edit Transportation Request' : 'Create Transportation Request'}
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            {isEditMode 
              ? 'Update your transportation request details'
              : 'Request transportation for your cargo with detailed specifications'
            }
          </p>
        </div>
      </div>

      {/* Form */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
        <div className="p-6 space-y-6">
          {/* Route Information */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Origin */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <MapPin className="w-4 h-4" />
                Origin
              </label>
              <input
                {...register('origin')}
                type="text"
                placeholder="e.g., Dallas Warehouse"
                className={`w-full px-4 py-2 bg-white dark:bg-gray-700 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 transition-colors ${
                  errors.origin 
                    ? 'border-red-500 focus:ring-red-500' 
                    : 'border-gray-200 dark:border-gray-600'
                }`}
              />
              {errors.origin && (
                <p className="text-red-600 text-sm mt-1 flex items-center gap-1">
                  <span className="text-red-500">⚠</span>
                  {errors.origin.message}
                </p>
              )}
            </div>

            {/* Destination */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <MapPin className="w-4 h-4" />
                Destination
              </label>
              <input
                {...register('destination')}
                type="text"
                placeholder="e.g., Houston Distribution Center"
                className={`w-full px-4 py-2 bg-white dark:bg-gray-700 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 transition-colors ${
                  errors.destination 
                    ? 'border-red-500 focus:ring-red-500' 
                    : 'border-gray-200 dark:border-gray-600'
                }`}
              />
              {errors.destination && (
                <p className="text-red-600 text-sm mt-1 flex items-center gap-1">
                  <span className="text-red-500">⚠</span>
                  {errors.destination.message}
                </p>
              )}
            </div>
          </div>

          {/* Distance Display */}
          {(origin && destination && origin !== destination) && (
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                  <MapPin className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="text-blue-900 dark:text-blue-100 font-medium">
                    Route: {origin} → {destination}
                  </p>
                  <div className="flex items-center gap-2 text-sm text-blue-700 dark:text-blue-300">
                    {isCalculatingDistance ? (
                      <>
                        <div className="animate-spin h-3 w-3 border-2 border-blue-600 border-t-transparent rounded-full"></div>
                        Calculating distance...
                      </>
                    ) : estimatedDistance > 0 ? (
                      <>
                        <span>Estimated distance: {estimatedDistance} km</span>
                        <span className="text-blue-500">•</span>
                        <span>Base cost: ~${(estimatedDistance * 2.5).toFixed(0)} USD</span>
                      </>
                    ) : null}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Scheduling & Logistics */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Pick-up Date & Time */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <Calendar className="w-4 h-4" />
                Pick-up Date & Time
              </label>
              <input
                {...register('pickUpDateTime')}
                type="datetime-local"
                min={new Date().toISOString().slice(0, 16)}
                className={`w-full px-4 py-2 bg-white dark:bg-gray-700 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 transition-colors ${
                  errors.pickUpDateTime 
                    ? 'border-red-500 focus:ring-red-500' 
                    : 'border-gray-200 dark:border-gray-600'
                }`}
              />
              {errors.pickUpDateTime && (
                <p className="text-red-600 text-sm mt-1 flex items-center gap-1">
                  <span className="text-red-500">⚠</span>
                  {errors.pickUpDateTime.message}
                </p>
              )}
              <p className="text-gray-500 text-xs mt-1">
                Please select a future date and time for cargo pickup
              </p>
            </div>

            {/* Truck Count */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <Truck className="w-4 h-4" />
                Number of Trucks Required
              </label>
              <input
                {...register('truckCount')}
                type="number"
                min="1"
                max="20"
                step="1"
                placeholder="e.g., 2"
                className={`w-full px-4 py-2 bg-white dark:bg-gray-700 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 transition-colors ${
                  errors.truckCount 
                    ? 'border-red-500 focus:ring-red-500' 
                    : 'border-gray-200 dark:border-gray-600'
                }`}
              />
              {errors.truckCount && (
                <p className="text-red-600 text-sm mt-1 flex items-center gap-1">
                  <span className="text-red-500">⚠</span>
                  {errors.truckCount.message}
                </p>
              )}
              <p className="text-gray-500 text-xs mt-1">
                How many trucks will be needed for this shipment? (1-20)
              </p>
            </div>
          </div>

          {/* Load Details */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              <Package className="w-4 h-4" />
              Load Details
            </label>
            <textarea
              {...register('loadDetails')}
              rows={4}
              placeholder="Describe the cargo, weight, dimensions, and any special requirements... (e.g., 500 boxes of electronics, each weighing 25 lbs, fragile items)"
              className={`w-full px-4 py-2 bg-white dark:bg-gray-700 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 transition-colors resize-none ${
                errors.loadDetails 
                  ? 'border-red-500 focus:ring-red-500' 
                  : 'border-gray-200 dark:border-gray-600'
              }`}
            />
            {errors.loadDetails && (
              <p className="text-red-600 text-sm mt-1 flex items-center gap-1">
                <span className="text-red-500">⚠</span>
                {errors.loadDetails.message}
              </p>
            )}
            <p className="text-gray-500 text-xs mt-1">
              {watch('loadDetails')?.length || 0}/1000 characters
            </p>
          </div>

          {/* Form Summary */}
          {isValid && estimatedDistance > 0 && (
            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
              <h3 className="text-green-800 dark:text-green-200 font-medium mb-2">Request Summary</h3>
              <div className="text-sm text-green-700 dark:text-green-300 space-y-1">
                <p>• Route: {origin} → {destination}</p>
                <p>• Distance: {estimatedDistance} km</p>
                <p>• Trucks: {watch('truckCount')} truck(s)</p>
                <p>• Estimated Cost: ~${estimatedDistance * 2.5 * (watch('truckCount') || 1)} USD</p>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-end gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <button
              type="button"
              onClick={goBack}
              className="px-6 py-2 border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={!isValid || isSubmitting || estimatedDistance === 0}
              className="inline-flex items-center gap-2 px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                  {isEditMode ? 'Updating...' : 'Creating...'}
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  {isEditMode ? 'Update Request' : 'Create Request'}
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};