import { motion } from 'framer-motion';
import { ArrowLeft, Calendar, Truck, DollarSign, FileText, AlertTriangle, CheckCircle } from 'lucide-react';
import { format } from 'date-fns';
import clsx from 'clsx';

import { DriverManagement } from '../../components/DriverManagement';
import { StatusBadge } from '../../components/StatusBadge';

const FormField = ({ 
  label, 
  error, 
  required = false, 
  icon: Icon, 
  children,
  description
}) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
      <div className="flex items-center gap-2">
        {Icon && <Icon className="w-4 h-4" />}
        {label}
        {required && <span className="text-red-500">*</span>}
      </div>
    </label>
    {description && (
      <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">{description}</p>
    )}
    {children}
    {error && (
      <p className="text-sm text-red-600 dark:text-red-400 mt-1">{error.message}</p>
    )}
  </div>
);

const VariancePreview = ({ preview }) => {
  if (!preview) return null;

  const getVarianceColor = (variance, type = 'neutral') => {
    if (variance === 0) return 'text-gray-600 dark:text-gray-400';
    
    // For trucks and cost, negative is generally better
    const isPositive = variance > 0;
    
    if (type === 'cost') {
      return isPositive ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400';
    }
    
    return isPositive ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400';
  };

  const formatVariance = (variance, type = 'number') => {
    if (type === 'currency') {
      return variance >= 0 ? `+$${variance.toLocaleString()}` : `-$${Math.abs(variance).toLocaleString()}`;
    }
    return variance >= 0 ? `+${variance}` : `${variance}`;
  };

  return (
    <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
      <h4 className="font-medium text-blue-900 dark:text-blue-300 mb-3">Performance Preview</h4>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <p className="text-sm text-blue-800 dark:text-blue-200">Truck Variance</p>
          <p className={clsx('font-medium', getVarianceColor(preview.truckVariance))}>
            {formatVariance(preview.truckVariance)} trucks
          </p>
        </div>
        <div>
          <p className="text-sm text-blue-800 dark:text-blue-200">Cost Variance</p>
          <p className={clsx('font-medium', getVarianceColor(preview.costVariance, 'cost'))}>
            {formatVariance(preview.costVariance, 'currency')} ({preview.costVariancePercentage}%)
          </p>
        </div>
      </div>
    </div>
  );
};

export const DeliveryLoggingPageUI = ({
  request,
  isLoading,
  error,
  selectedDrivers,
  register,
  handleSubmit,
  errors,
  watch,
  isSubmitting,
  canSubmit,
  handleDriversUpdate,
  calculateVariancePreview,
  goBack,
}) => {
  
  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-4"></div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {[1, 2].map((i) => (
              <div key={i} className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
                <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-4"></div>
                <div className="space-y-3">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">Error loading request: {error.message}</p>
          <button 
            onClick={goBack}
            className="mt-2 text-red-600 hover:text-red-500 text-sm"
          >
            ← Go back
          </button>
        </div>
      </div>
    );
  }

  if (!request) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Request not found</h2>
        <p className="text-gray-600 dark:text-gray-400 mt-2">The requested transportation request could not be found.</p>
        <button 
          onClick={goBack}
          className="text-primary-600 hover:text-primary-500 mt-4 inline-block"
        >
          ← Go back
        </button>
      </div>
    );
  }

  const watchedValues = watch();

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
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Log Delivery
            </h1>
            <StatusBadge status={request.status} />
          </div>
          <p className="text-gray-600 dark:text-gray-400">
            Record actual delivery details and rate driver performance for request {request.id}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* Original Request Details (Read-only) */}
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Original Request Details
            </h3>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Route</p>
                <p className="text-gray-900 dark:text-white font-medium">
                  {request.origin} → {request.destination}
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Planned Pickup</p>
                  <p className="text-gray-900 dark:text-white">
                    {format(new Date(request.pickUpDateTime || request.pickupDate), 'MMM dd, yyyy HH:mm')}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Planned Trucks</p>
                  <p className="text-gray-900 dark:text-white">{request.truckCount}</p>
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Estimated Cost</p>
                <p className="text-gray-900 dark:text-white">
                  ${request.estimatedCost?.toLocaleString()}
                </p>
              </div>
              {request.loadDetails && (
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Load Details</p>
                  <p className="text-gray-900 dark:text-white">{request.loadDetails}</p>
                </div>
              )}
            </div>
          </div>


          {/* Actual Delivery Details Form */}
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Actual Delivery Details
            </h3>
            <div className="space-y-4">
              <FormField
                label="Actual Pickup Date & Time"
                error={errors.actualPickupDateTime}
                required
                icon={Calendar}
                description="When was the cargo actually picked up?"
              >
                <input
                  {...register('actualPickupDateTime')}
                  type="datetime-local"
                  min={new Date(request.pickUpDateTime || request.pickupDate).toISOString().slice(0, 16)}
                  className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                />
              </FormField>

              <FormField
                label="Actual Truck Count"
                error={errors.actualTruckCount}
                required
                icon={Truck}
                description="How many trucks were actually used?"
              >
                <input
                  {...register('actualTruckCount', { valueAsNumber: true })}
                  type="number"
                  min="1"
                  className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                />
              </FormField>

              <FormField
                label="Invoice Amount"
                error={errors.invoiceAmount}
                required
                icon={DollarSign}
                description="Final amount charged for this delivery"
              >
                <input
                  {...register('invoiceAmount', { valueAsNumber: true })}
                  type="number"
                  min="0"
                  step="0.01"
                  className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                />
              </FormField>

              <FormField
                label="Delivery Notes"
                error={errors.deliveryNotes}
                icon={FileText}
                description="Additional notes about the delivery (optional)"
              >
                <textarea
                  {...register('deliveryNotes')}
                  rows={3}
                  placeholder="e.g., Delivered on time, customer satisfied..."
                  className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-900 text-gray-900 dark:text-white resize-none"
                />
              </FormField>
            </div>
          </div>
        </div>

        {/* Variance Preview */}
        {calculateVariancePreview() && (
          <VariancePreview preview={calculateVariancePreview()} />
        )}

        {/* Enhanced Driver Management */}
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Driver Management & Ratings
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
            Add drivers who participated in this delivery and rate their performance based on driver type.
          </p>
          <DriverManagement
            selectedDrivers={selectedDrivers || []}
            onUpdateDrivers={handleDriversUpdate}
            required={true}
          />
        </div>

        {/* Form Actions */}
        <div className="flex items-center justify-between pt-6 border-t border-gray-200 dark:border-gray-700">
          <button
            type="button"
            onClick={goBack}
            className="px-6 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
          >
            Cancel
          </button>
          
          <div className="flex items-center gap-4">
            {/* Submit Status */}
            {(!selectedDrivers || selectedDrivers.length === 0) && (
              <div className="flex items-center gap-2 text-orange-600 dark:text-orange-400">
                <AlertTriangle className="w-4 h-4" />
                <span className="text-sm">Add at least one driver</span>
              </div>
            )}
            
            {selectedDrivers && selectedDrivers.length > 0 && canSubmit && (
              <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
                <CheckCircle className="w-4 h-4" />
                <span className="text-sm">Ready to submit</span>
              </div>
            )}

            <button
              type="submit"
              disabled={!canSubmit}
              className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isSubmitting ? 'Logging Delivery...' : 'Log Delivery'}
            </button>
          </div>
        </div>
      </form>
    </motion.div>
  );
};