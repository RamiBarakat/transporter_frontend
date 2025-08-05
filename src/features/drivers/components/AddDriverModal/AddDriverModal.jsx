import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, User, Building, Phone, Calendar, CreditCard, Users } from 'lucide-react';
import clsx from 'clsx';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

const DriverTypeBadge = ({ type }) => {
  const config = {
    transporter: {
      label: 'Transporter',
      color: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
    },
    in_house: {
      label: 'In-House',
      color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'
    }
  };

  const { label, color } = config[type] || config.transporter;

  return (
    <span className={clsx('px-2 py-1 text-xs font-medium rounded-full', color)}>
      {label}
    </span>
  );
};
// ============================================================================

const createValidationSchema = (driverType) => {
  const baseSchema = {
    name: yup.string().min(2, 'Name must be at least 2 characters').max(100, 'Name must be less than 100 characters').required('Name is required'),
    type: yup.string().oneOf(['transporter', 'in_house'], 'Invalid driver type').required('Driver type is required'),
  };

  if (driverType === 'transporter') {
    return yup.object({
      ...baseSchema,
      transportCompany: yup.string().required('Transport company is required'),
      phone: yup.string().max(20, 'Phone number must be less than 20 characters'),
      licenseNumber: yup.string().max(50, 'License number must be less than 50 characters'),
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

export const AddDriverModal = ({ 
  isOpen, 
  onClose, 
  onCreate,
  isCreating = false 
}) => {
  const [driverType, setDriverType] = useState('transporter');
  
  const schema = createValidationSchema(driverType);
  
  const { 
    register, 
    handleSubmit, 
    formState: { errors, isValid },
    reset,
    watch,
    setValue
  } = useForm({
    resolver: yupResolver(schema),
    mode: 'onChange',
    defaultValues: {
      type: driverType,
      name: '',
      transportCompany: '',
      phone: '',
      licenseNumber: '',
      employeeId: '',
      department: '',
      hireDate: ''
    }
  });

  const watchedType = watch('type');
  
  if (watchedType !== driverType) {
    setDriverType(watchedType);
  }

  const onSubmit = async (data) => {
    try {
      const driverData = { ...data };
      
      if (data.type === 'in_house' && data.hireDate) {
        const hireDate = new Date(data.hireDate);
        if (!isNaN(hireDate.getTime())) {
          driverData.hireDate = hireDate.toISOString();
        }
      } else {
        delete driverData.hireDate;
      }
      
      await onCreate(driverData);
      reset();
      setDriverType('transporter');
    } catch (error) {
      console.error('Failed to create driver:', error);
    }
  };

  const handleClose = () => {
    reset();
    setDriverType('transporter');
    onClose();
  };

  const handleTypeChange = (newType) => {
    setDriverType(newType);
    setValue('type', newType);
    
    if (newType === 'transporter') {
      setValue('employeeId', '');
      setValue('department', '');
      setValue('hireDate', new Date().toISOString().split('T')[0]);
    } else {
      setValue('transportCompany', '');
      setValue('phone', '');
      setValue('licenseNumber', '');
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
          onClick={handleClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="w-full max-w-md bg-white dark:bg-gray-800 rounded-lg shadow-xl max-h-[90vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Add New Driver
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Create a new driver profile
                </p>
              </div>
              <button
                onClick={handleClose}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
              </button>
            </div>

            {/* Form */}
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Driver Type Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                    Driver Type
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => handleTypeChange('transporter')}
                      className={clsx(
                        'p-4 border-2 rounded-lg text-left transition-all',
                        driverType === 'transporter'
                          ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                          : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <Building className="w-5 h-5 text-green-600 dark:text-green-400" />
                        <div>
                          <div className="font-medium text-gray-900 dark:text-white">Transporter</div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">External company driver</div>
                        </div>
                      </div>
                    </button>
                    
                    <button
                      type="button"
                      onClick={() => handleTypeChange('in_house')}
                      className={clsx(
                        'p-4 border-2 rounded-lg text-left transition-all',
                        driverType === 'in_house'
                          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                          : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <Users className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                        <div>
                          <div className="font-medium text-gray-900 dark:text-white">In-House</div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">Company employee</div>
                        </div>
                      </div>
                    </button>
                  </div>
                  <input type="hidden" {...register('type')} />
                </div>

                {/* Selected Type Badge */}
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Selected type:</span>
                  <DriverTypeBadge type={driverType} />
                </div>

                {/* Name Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    <User className="w-4 h-4 inline mr-2" />
                    Full Name *
                  </label>
                  <input
                    type="text"
                    {...register('name')}
                    className={clsx(
                      'w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white transition-colors',
                      errors.name ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                    )}
                    placeholder="Enter driver's full name"
                  />
                  {errors.name && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.name.message}</p>
                  )}
                </div>

                {/* Type-specific Fields */}
                {driverType === 'transporter' ? (
                  <>
                    {/* Transport Company */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        <Building className="w-4 h-4 inline mr-2" />
                        Transport Company *
                      </label>
                      <input
                        type="text"
                        {...register('transportCompany')}
                        className={clsx(
                          'w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white transition-colors',
                          errors.transportCompany ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                        )}
                        placeholder="Enter company name"
                      />
                      {errors.transportCompany && (
                        <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.transportCompany.message}</p>
                      )}
                    </div>

                    {/* Phone */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        <Phone className="w-4 h-4 inline mr-2" />
                        Phone Number
                      </label>
                      <input
                        type="text"
                        {...register('phone')}
                        className={clsx(
                          'w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white transition-colors',
                          errors.phone ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                        )}
                        placeholder="Enter phone number"
                      />
                      {errors.phone && (
                        <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.phone.message}</p>
                      )}
                    </div>

                    {/* License Number */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        <CreditCard className="w-4 h-4 inline mr-2" />
                        License Number
                      </label>
                      <input
                        type="text"
                        {...register('licenseNumber')}
                        className={clsx(
                          'w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white transition-colors',
                          errors.licenseNumber ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                        )}
                        placeholder="Enter license number"
                      />
                      {errors.licenseNumber && (
                        <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.licenseNumber.message}</p>
                      )}
                    </div>
                  </>
                ) : (
                  <>
                    {/* Employee ID */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        <CreditCard className="w-4 h-4 inline mr-2" />
                        Employee ID *
                      </label>
                      <input
                        type="text"
                        {...register('employeeId')}
                        className={clsx(
                          'w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white transition-colors',
                          errors.employeeId ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                        )}
                        placeholder="Enter employee ID"
                      />
                      {errors.employeeId && (
                        <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.employeeId.message}</p>
                      )}
                    </div>

                    {/* Department */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        <Building className="w-4 h-4 inline mr-2" />
                        Department *
                      </label>
                      <input
                        type="text"
                        {...register('department')}
                        className={clsx(
                          'w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white transition-colors',
                          errors.department ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                        )}
                        placeholder="Enter department"
                      />
                      {errors.department && (
                        <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.department.message}</p>
                      )}
                    </div>

                    {/* Hire Date */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        <Calendar className="w-4 h-4 inline mr-2" />
                        Hire Date *
                      </label>
                      <input
                        type="date"
                        {...register('hireDate')}
                        className={clsx(
                          'w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white transition-colors',
                          errors.hireDate ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                        )}
                      />
                      {errors.hireDate && (
                        <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.hireDate.message}</p>
                      )}
                    </div>
                  </>
                )}

                {/* Form Actions */}
                <div className="flex gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <button
                    type="button"
                    onClick={handleClose}
                    className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    disabled={isCreating}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={!isValid || isCreating}
                    className={clsx(
                      'flex-1 px-4 py-2 rounded-lg text-white font-medium transition-colors',
                      isValid && !isCreating
                        ? 'bg-primary-600 hover:bg-primary-700'
                        : 'bg-gray-400 cursor-not-allowed'
                    )}
                  >
                    {isCreating ? (
                      <div className="flex items-center justify-center gap-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Creating...
                      </div>
                    ) : (
                      'Create Driver'
                    )}
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};