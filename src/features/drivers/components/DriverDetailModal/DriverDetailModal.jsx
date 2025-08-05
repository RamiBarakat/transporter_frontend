import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Save,
  Edit2, 
  User, 
  Building, 
  Phone, 
  Calendar, 
  Star,
  TrendingUp,
  MapPin,
  Clock,
  Award,
  BarChart3
} from 'lucide-react';
import clsx from 'clsx';
import { format } from 'date-fns';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { DriverRatingsHistory } from '../DriverRatingsHistory';

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
      'inline-flex items-center px-3 py-1 rounded-full text-sm font-medium',
      className
    )}>
      {label}
    </span>
  );
};

const StarRating = ({ rating, size = 'md' }) => {
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
            size === 'sm' ? 'w-3 h-3' : size === 'md' ? 'w-4 h-4' : 'w-5 h-5'
          )}
        />
      );
    } else if (i === fullStars && hasHalfStar) {
      stars.push(
        <div key={i} className="relative">
          <Star className={clsx(
            'text-gray-300',
            size === 'sm' ? 'w-3 h-3' : size === 'md' ? 'w-4 h-4' : 'w-5 h-5'
          )} />
          <div className="absolute inset-0 overflow-hidden w-1/2">
            <Star className={clsx(
              'text-yellow-400 fill-current',
              size === 'sm' ? 'w-3 h-3' : size === 'md' ? 'w-4 h-4' : 'w-5 h-5'
            )} />
          </div>
        </div>
      );
    } else {
      stars.push(
        <Star
          key={i}
          className={clsx(
            'text-gray-300',
            size === 'sm' ? 'w-3 h-3' : size === 'md' ? 'w-4 h-4' : 'w-5 h-5'
          )}
        />
      );
    }
  }

  return (
    <div className="flex items-center gap-1">
      {stars}
      <span className={clsx(
        'ml-2 font-medium text-gray-700 dark:text-gray-300',
        size === 'sm' ? 'text-sm' : size === 'md' ? 'text-base' : 'text-lg'
      )}>
        {rating.toFixed(1)}
      </span>
    </div>
  );
};

const createValidationSchema = (driverType) => {
  const baseSchema = {
    name: yup.string().required('Driver name is required').min(2, 'Name must be at least 2 characters'),
  };

  if (driverType === 'transporter') {
    return yup.object({
      ...baseSchema,
      transportCompany: yup.string().required('Transport company is required'),
      phone: yup.string().required('Phone number is required').matches(/^[\d\s\-\+\(\)]+$/, 'Invalid phone number'),
      licenseNumber: yup.string(),
    });
  } else {
    return yup.object({
      ...baseSchema,
      employeeId: yup.string().required('Employee ID is required'),
      department: yup.string().required('Department is required'),
      hireDate: yup.date().required('Hire date is required'),
    });
  }
};

export const DriverDetailModal = ({ 
  driver, 
  isOpen, 
  onClose, 
  onUpdate, 
  onDelete,
  isUpdating = false,
  driverRatings = [],
  performanceSummary = null,
  isLoadingRatings = false,
  onGenerateInsights
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('info');
  
  const schema = createValidationSchema(driver?.type);
  
  const { 
    register, 
    handleSubmit, 
    formState: { errors, isValid },
    reset 
  } = useForm({
    resolver: yupResolver(schema),
    mode: 'onChange',
    defaultValues: {
      name: driver?.name || '',
      transportCompany: driver?.transportCompany || '',
      phone: driver?.phone || '',
      licenseNumber: driver?.licenseNumber || '',
      employeeId: driver?.employeeId || '',
      department: driver?.department || '',
      hireDate: driver?.hireDate || '',
    }
  });

  useEffect(() => {
    if (driver) {
      reset({
        name: driver.name || '',
        transportCompany: driver.transportCompany || '',
        phone: driver.phone || '',
        licenseNumber: driver.licenseNumber || '',
        employeeId: driver.employeeId || '',
        department: driver.department || '',
        hireDate: driver.hireDate || '',
      });
    }
  }, [driver, reset]);

  const onSubmit = async (data) => {
    try {
      await onUpdate(driver.id, data);
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update driver:', error?.message || 'Unknown error');
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
    reset({
      name: driver?.name || '',
      transportCompany: driver?.transportCompany || '',
      phone: driver?.phone || '',
      licenseNumber: driver?.licenseNumber || '',
      employeeId: driver?.employeeId || '',
      department: driver?.department || '',
      hireDate: driver?.hireDate || '',
    });
  };

  const handleCancel = () => {
    setIsEditing(false);
    reset();
  };

  if (!driver) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
          >
            {/* Header */}
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
                    <User className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                      {driver.name}
                    </h2>
                    <div className="flex items-center gap-3 mt-1">
                      <DriverTypeBadge type={driver.type} />
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        ID: {driver.id}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {!isEditing && (
                    <button
                      onClick={handleEdit}
                      className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                      title="Edit Driver"
                    >
                      <Edit2 className="w-5 h-5" />
                    </button>
                  )}
                  <button
                    onClick={onClose}
                    className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="border-b border-gray-200 dark:border-gray-700">
              <nav className="flex gap-8 px-6">
                <button
                  onClick={() => setActiveTab('info')}
                  className={clsx(
                    'py-4 text-sm font-medium border-b-2 transition-colors',
                    activeTab === 'info'
                      ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                      : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
                  )}
                >
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    Driver Info
                  </div>
                </button>
                <button
                  onClick={() => setActiveTab('ratings')}
                  className={clsx(
                    'py-4 text-sm font-medium border-b-2 transition-colors',
                    activeTab === 'ratings'
                      ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                      : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
                  )}
                >
                  <div className="flex items-center gap-2">
                    <BarChart3 className="w-4 h-4" />
                    Performance & Ratings
                    {driverRatings.length > 0 && (
                      <span className="ml-1 px-2 py-0.5 text-xs bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 rounded-full">
                        {driverRatings.length}
                      </span>
                    )}
                  </div>
                </button>
              </nav>
            </div>

            {/* Content */}
            <div className="p-6">
              {activeTab === 'info' && (
                <>
                  {/* Stats Cards */}
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                    <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg text-center">
                      <TrendingUp className="w-6 h-6 text-blue-600 dark:text-blue-400 mx-auto mb-2" />
                      <div className="text-lg font-bold text-blue-900 dark:text-blue-100">
                        {driver.totalDeliveries || 0}
                      </div>
                      <div className="text-xs text-blue-600 dark:text-blue-400">Deliveries</div>
                    </div>
                    <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg text-center">
                      <Award className="w-6 h-6 text-green-600 dark:text-green-400 mx-auto mb-2" />
                      <div className="text-lg font-bold text-green-900 dark:text-green-100">
                        {driver.totalDeliveries > 10 ? 'Expert' : driver.totalDeliveries > 5 ? 'Experienced' : 'Beginner'}
                      </div>
                      <div className="text-xs text-green-600 dark:text-green-400">Level</div>
                    </div>
                    <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg text-center">
                      <Clock className="w-6 h-6 text-purple-600 dark:text-purple-400 mx-auto mb-2" />
                      <div className="text-lg font-bold text-purple-900 dark:text-purple-100">
                        {driver.lastDelivery ? format(new Date(driver.lastDelivery), 'MMM dd') : 'Never'}
                      </div>
                      <div className="text-xs text-purple-600 dark:text-purple-400">Last Delivery</div>
                    </div>
              </div>

              {/* Driver Information */}
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6 mb-6">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
                  Driver Information
                </h3>
                
                {isEditing ? (
                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    {/* Name */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Name
                      </label>
                      <input
                        {...register('name')}
                        type="text"
                        className="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                      />
                      {errors.name && (
                        <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.name.message}</p>
                      )}
                    </div>

                    {/* Type-specific fields */}
                    {driver.type === 'transporter' ? (
                      <>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Transport Company
                          </label>
                          <input
                            {...register('transportCompany')}
                            type="text"
                            className="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                          />
                          {errors.transportCompany && (
                            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.transportCompany.message}</p>
                          )}
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Phone
                          </label>
                          <input
                            {...register('phone')}
                            type="tel"
                            className="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                          />
                          {errors.phone && (
                            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.phone.message}</p>
                          )}
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            License Number
                          </label>
                          <input
                            {...register('licenseNumber')}
                            type="text"
                            className="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                          />
                        </div>
                      </>
                    ) : (
                      <>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Employee ID
                          </label>
                          <input
                            {...register('employeeId')}
                            type="text"
                            className="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                          />
                          {errors.employeeId && (
                            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.employeeId.message}</p>
                          )}
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Department
                          </label>
                          <input
                            {...register('department')}
                            type="text"
                            className="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                          />
                          {errors.department && (
                            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.department.message}</p>
                          )}
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Hire Date
                          </label>
                          <input
                            {...register('hireDate')}
                            type="date"
                            className="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                          />
                          {errors.hireDate && (
                            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.hireDate.message}</p>
                          )}
                        </div>
                      </>
                    )}

                    {/* Actions */}
                    <div className="flex gap-3 pt-4">
                      <button
                        type="submit"
                        disabled={!isValid || isUpdating}
                        className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        <Save className="w-4 h-4" />
                        {isUpdating ? 'Saving...' : 'Save Changes'}
                      </button>
                      <button
                        type="button"
                        onClick={handleCancel}
                        className="px-4 py-2 border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {driver.type === 'transporter' ? (
                      <>
                        <div className="flex items-center gap-3">
                          <Building className="w-5 h-5 text-gray-400" />
                          <div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">Company</div>
                            <div className="font-medium text-gray-900 dark:text-white">
                              {driver.transportCompany}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Phone className="w-5 h-5 text-gray-400" />
                          <div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">Phone</div>
                            <div className="font-medium text-gray-900 dark:text-white">
                              {driver.phone}
                            </div>
                          </div>
                        </div>
                        {driver.licenseNumber && (
                          <div className="flex items-center gap-3">
                            <MapPin className="w-5 h-5 text-gray-400" />
                            <div>
                              <div className="text-sm text-gray-500 dark:text-gray-400">License</div>
                              <div className="font-medium text-gray-900 dark:text-white">
                                {driver.licenseNumber}
                              </div>
                            </div>
                          </div>
                        )}
                      </>
                    ) : (
                      <>
                        <div className="flex items-center gap-3">
                          <User className="w-5 h-5 text-gray-400" />
                          <div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">Employee ID</div>
                            <div className="font-medium text-gray-900 dark:text-white">
                              {driver.employeeId}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Building className="w-5 h-5 text-gray-400" />
                          <div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">Department</div>
                            <div className="font-medium text-gray-900 dark:text-white">
                              {driver.department}
                            </div>
                          </div>
                        </div>
                        {driver.hireDate && (
                          <div className="flex items-center gap-3">
                            <Calendar className="w-5 h-5 text-gray-400" />
                            <div>
                              <div className="text-sm text-gray-500 dark:text-gray-400">Hire Date</div>
                              <div className="font-medium text-gray-900 dark:text-white">
                                {format(new Date(driver.hireDate), 'MMM dd, yyyy')}
                              </div>
                            </div>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                )}
              </div>
                </>
              )}

              {activeTab === 'ratings' && (
                <DriverRatingsHistory
                  driver={driver}
                  ratings={driverRatings}
                  performanceSummary={performanceSummary}
                  isLoading={isLoadingRatings}
                  onGenerateInsights={onGenerateInsights}
                />
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};