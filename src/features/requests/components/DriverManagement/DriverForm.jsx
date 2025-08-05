import { motion } from 'framer-motion';
import { X, User, Building, Phone, Calendar, CreditCard } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import clsx from 'clsx';

import { useCreateDriver } from '@/features/drivers/api';

const transporterSchema = yup.object({
  name: yup.string().required('Driver name is required').min(2, 'Name must be at least 2 characters'),
  driverType: yup.string().required('Driver type is required').oneOf(['transporter'], 'Invalid driver type'),
  transportCompany: yup.string().required('Transport company is required'),
  phone: yup.string().required('Phone number is required').matches(/^[\d\s\-\+\(\)]+$/, 'Invalid phone number'),
  licenseNumber: yup.string().optional(),
});

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

export const DriverForm = ({ onSaveDriver, onCancel, className = "" }) => {
  const createDriverMutation = useCreateDriver();

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    reset,
  } = useForm({
    resolver: yupResolver(transporterSchema),
    mode: 'onChange',
    defaultValues: {
      name: '',
      driverType: 'transporter',
      transportCompany: '',
      phone: '',
      licenseNumber: '',
    },
  });

  const onSubmit = async (data) => {
    try {

      const driverData = {
        name: data.name,
        type: 'transporter', 
        transportCompany: data.transportCompany,
        phone: data.phone,
        licenseNumber: data.licenseNumber || '',
      };

      const response = await createDriverMutation.mutateAsync(driverData);
      
      // Extract the actual driver data from the response
      const newDriver = response.data || response; // Handle both wrapped and unwrapped responses
      
      // Simple: just use the driver data + add rating structure
      const driverToSave = {
        ...newDriver, // This includes the id from backend
        tempId: Date.now(), // For frontend tracking
        rating: {
          punctuality: 0,
          professionalism: 0,
          deliveryQuality: 0,
          communication: 0,
          overall: 0,
          comments: ''
        }
      };
      
      onSaveDriver(driverToSave);
      reset();
      onCancel(); // Close the modal after successful submission
    } catch (error) {
      // Error is handled by the mutation's onError callback
      console.error('Failed to create driver:', error?.message || 'Unknown error');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className={clsx("bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6", className)}
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Add New Transporter Driver
        </h3>
        <button
          onClick={onCancel}
          className="p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <form 
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }} 
        className="space-y-6" 
        noValidate
      >
        {/* Hidden Driver Type Field - Always Transporter */}
        <input type="hidden" {...register('driverType')} value="transporter" />
        
        {/* Driver Type Display (Read-only) */}
        <FormField
          label="Driver Type"
          icon={User}
        >
          <div className="p-4 border-2 border-green-200 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <div className="text-center">
              <div className="text-sm font-medium text-green-800 dark:text-green-300">Transporter Driver</div>
              <div className="text-xs text-green-600 dark:text-green-400">External company driver</div>
            </div>
          </div>
        </FormField>

        {/* Driver Name */}
        <FormField
          label="Driver Name"
          error={errors.name}
          required
          icon={User}
        >
                  <input
          {...register('name')}
          name="name"
          type="text"
          placeholder="Enter driver's full name"
          className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
        />
        </FormField>

        {/* Transporter Driver Fields */}
        <FormField
          label="Transport Company"
          error={errors.transportCompany}
          required
          icon={Building}
        >
          <input
            {...register('transportCompany')}
            name="transportCompany"
            type="text"
            placeholder="e.g., ABC Logistics"
            className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
          />
        </FormField>

        <FormField
          label="Phone Number"
          error={errors.phone}
          required
          icon={Phone}
        >
          <input
            {...register('phone')}
            name="phone"
            type="tel"
            placeholder="(555) 123-4567"
            className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
          />
        </FormField>

        <FormField
          label="License Number"
          error={errors.licenseNumber}
          icon={CreditCard}
          description="Commercial driver's license number (optional)"
        >
          <input
            {...register('licenseNumber')}
            name="licenseNumber"
            type="text"
            placeholder="CDL123456"
            className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
          />
        </FormField>

        {/* Form Actions */}
        <div className="flex items-center gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
          <button
            type="button"
            disabled={!isValid || createDriverMutation.isPending}
            className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            onClick={async (e) => {
              e.preventDefault();
              e.stopPropagation();
              
              
              // Get form data manually
              const formData = new FormData(e.target.closest('form'));
              const data = {
                name: formData.get('name'),
                driverType: 'transporter',
                transportCompany: formData.get('transportCompany'),
                phone: formData.get('phone'),
                licenseNumber: formData.get('licenseNumber') || '',
              };
              
              // Call onSubmit manually
              await onSubmit(data);
            }}
          >
            {createDriverMutation.isPending ? 'Adding Driver...' : 'Add Transporter Driver'}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>
    </motion.div>
  );
};