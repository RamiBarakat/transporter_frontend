import { motion } from 'framer-motion';
import { ArrowLeft, Edit, Truck, Calendar, MapPin, DollarSign, FileText } from 'lucide-react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';

import { StatusBadge } from '../../components/StatusBadge';

const DetailField = ({ label, value, icon: Icon }) => (
  <div className="flex items-center gap-3">
    {Icon && <Icon className="w-5 h-5 text-gray-500 dark:text-gray-400" />}
    <div>
      <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
      <p className="text-gray-900 dark:text-white font-medium">{value}</p>
    </div>
  </div>
);

export const RequestDetailPageUI = ({
  request,
  isLoading,
  error,
  permissions,
  deliveryDrivers = [],
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
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-800">Error loading request: {error.message}</p>
        <button onClick={goBack} className="mt-2 text-red-600 hover:text-red-500 text-sm">
          ← Go back
        </button>
      </div>
    );
  }

  if (!request) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Request not found</h2>
        <button onClick={goBack} className="text-primary-600 hover:text-primary-500 mt-4">
          ← Go back
        </button>
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
              Request #{request.id}
            </h1>
            <StatusBadge status={request.status} />
          </div>
          <p className="text-gray-600 dark:text-gray-400">
            {request.origin} → {request.destination}
          </p>
        </div>
        <div className="flex items-center gap-3">
          {permissions.canLogDelivery && (
            <Link
              to={`/requests/${request.id}/delivery`}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              Log Delivery
            </Link>
          )}
          {permissions.canEditRequest && (
            <Link
              to={`/requests/${request.id}/edit`}
              className="inline-flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            >
              <Edit className="w-4 h-4" />
              Edit
            </Link>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Request Details */}
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Request Details</h3>
          <div className="space-y-4">
            <DetailField
              label="Pickup Date & Time"
              value={format(new Date(request.pickUpDateTime || request.pickupDate), 'MMM dd, yyyy HH:mm')}
              icon={Calendar}
            />
            <DetailField
              label="Route"
              value={`${request.origin} → ${request.destination}`}
              icon={MapPin}
            />
            <DetailField
              label="Truck Count"
              value={request.truckCount}
              icon={Truck}
            />
            <DetailField
              label="Estimated Cost"
              value={`$${request.estimatedCost?.toLocaleString()}`}
              icon={DollarSign}
            />
            {request.loadDetails && (
              <DetailField
                label="Load Details"
                value={request.loadDetails}
                icon={FileText}
              />
            )}
          </div>
        </div>

        {/* Delivery Details */}
        {request.delivery ? (
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Delivery Details</h3>
            <div className="space-y-4">
              <DetailField
                label="Actual Pickup"
                value={format(new Date(request.delivery.actualPickupDateTime), 'MMM dd, yyyy HH:mm')}
                icon={Calendar}
              />
              <DetailField
                label="Actual Trucks"
                value={request.delivery.actualTruckCount}
                icon={Truck}
              />
              <DetailField
                label="Invoice Amount"
                value={`$${request.delivery.invoiceAmount?.toLocaleString()}`}
                icon={DollarSign}
              />
              {request.delivery.deliveryNotes && (
                <DetailField
                  label="Notes"
                  value={request.delivery.deliveryNotes}
                  icon={FileText}
                />
              )}
            </div>

            {/* Simple Performance Comparison */}
            <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
              <h4 className="font-medium text-gray-900 dark:text-white mb-3">Performance</h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Truck Variance</p>
                  <p className={`font-medium ${
                    request.delivery.actualTruckCount - request.truckCount === 0
                      ? 'text-gray-900 dark:text-white'
                      : request.delivery.actualTruckCount - request.truckCount < 0
                      ? 'text-green-600'
                      : 'text-red-600'
                  }`}>
                    {request.delivery.actualTruckCount - request.truckCount > 0 ? '+' : ''}
                    {request.delivery.actualTruckCount - request.truckCount} trucks
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Cost Variance</p>
                  <p className={`font-medium ${
                    request.delivery.invoiceAmount - request.estimatedCost === 0
                      ? 'text-gray-900 dark:text-white'
                      : request.delivery.invoiceAmount - request.estimatedCost < 0
                      ? 'text-green-600'
                      : 'text-red-600'
                  }`}>
                    {request.delivery.invoiceAmount - request.estimatedCost > 0 ? '+' : ''}
                    ${Math.abs(request.delivery.invoiceAmount - request.estimatedCost).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>

            {/* Drivers Section */}
            {deliveryDrivers && deliveryDrivers.length > 0 && (
              <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
                <h4 className="font-medium text-gray-900 dark:text-white mb-4">Delivery Drivers</h4>
                <div className="space-y-4">
                  {deliveryDrivers.map((driverData, index) => (
                    <div
                      key={driverData.ratingId || index}
                      className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 border border-gray-200 dark:border-gray-600"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h5 className="font-medium text-gray-900 dark:text-white">
                            {driverData.driver.name}
                          </h5>
                          <p className="text-sm text-gray-600 dark:text-gray-400 capitalize">
                            {driverData.driver.type === 'in_house' ? 'In-House' : 'Transporter'}
                          </p>
                          {driverData.driver.transportCompany && (
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              {driverData.driver.transportCompany}
                            </p>
                          )}
                        </div>
                        <div className="text-right">
                          <div className="flex items-center gap-1">
                            <span className="text-lg font-semibold text-gray-900 dark:text-white">
                              {driverData.ratings.overallRating || 0}
                            </span>
                            <span className="text-sm text-gray-500">/5</span>
                          </div>
                          <p className="text-xs text-gray-500 dark:text-gray-400">Overall</p>
                        </div>
                      </div>
                      
                      {/* Rating breakdown */}
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-400">Punctuality</span>
                          <span className="text-gray-900 dark:text-white">
                            {driverData.ratings.punctuality || 0}/5
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-400">Professional</span>
                          <span className="text-gray-900 dark:text-white">
                            {driverData.ratings.professionalism || 0}/5
                          </span>
                        </div>
                        {driverData.driver.type === 'transporter' ? (
                          <>
                            <div className="flex justify-between">
                              <span className="text-gray-600 dark:text-gray-400">Quality</span>
                              <span className="text-gray-900 dark:text-white">
                                {driverData.ratings.deliveryQuality || 0}/5
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600 dark:text-gray-400">Communication</span>
                              <span className="text-gray-900 dark:text-white">
                                {driverData.ratings.communication || 0}/5
                              </span>
                            </div>
                          </>
                        ) : (
                          <>
                            <div className="flex justify-between">
                              <span className="text-gray-600 dark:text-gray-400">Safety</span>
                              <span className="text-gray-900 dark:text-white">
                                {driverData.ratings.safety || 0}/5
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600 dark:text-gray-400">Compliance</span>
                              <span className="text-gray-900 dark:text-white">
                                {driverData.ratings.policyCompliance || 0}/5
                              </span>
                            </div>
                          </>
                        )}
                      </div>
                      
                      {/* Comments if available */}
                      {driverData.ratings.comments && (
                        <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-600">
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            "{driverData.ratings.comments}"
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="bg-gray-50 dark:bg-gray-700 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Delivery Pending</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              This request has not been delivered yet.
            </p>
            {permissions.canLogDelivery && (
              <Link
                to={`/requests/${request.id}/delivery`}
                className="inline-flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              >
                Log Delivery
              </Link>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
};