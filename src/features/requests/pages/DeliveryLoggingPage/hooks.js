import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

import { useRequest, useLogDeliveryWithDrivers, useConfirmDeliveryCompletion } from '../../api';
import { useUIStore } from '@/app/store';

const createDeliverySchema = (request) => yup.object({
  actualPickupDateTime: yup
    .string()
    .required('Actual pickup date and time is required')
    .test('valid-date', 'Please enter a valid date and time', function(value) {
      if (!value) return false;
      const date = new Date(value);
      return !isNaN(date.getTime());
    })
    .test('min-pickup-date', 'Actual pickup time cannot be before the planned pickup time', function(value) {
      if (!value || !request) return true;
      const actualDate = new Date(value);
      const plannedDate = new Date(request.pickUpDateTime || request.pickupDate);
      return actualDate >= plannedDate;
    }),
  actualTruckCount: yup
    .number()
    .required('Actual truck count is required')
    .positive('Truck count must be positive')
    .integer('Truck count must be a whole number'),
  invoiceAmount: yup
    .number()
    .required('Invoice amount is required')
    .positive('Invoice amount must be positive'),
  deliveryNotes: yup.string(),
});

export const useDeliveryLoggingPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  
  // Zustand store for driver management
  const { selectedDrivers, setSelectedDrivers, clearSelectedDrivers } = useUIStore();
  
  // API hooks
  const { data: request, isLoading, error } = useRequest(id);
  const logDeliveryMutation = useLogDeliveryWithDrivers();
  const confirmDeliveryMutation = useConfirmDeliveryCompletion();

  // Form handling
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    watch,
    setValue,
    getValues,
  } = useForm({
    resolver: yupResolver(createDeliverySchema(request)),
    mode: 'onChange',
    defaultValues: {
      actualPickupDateTime: '',
      actualTruckCount: request?.truckCount || 1,
      invoiceAmount: request?.estimatedCost || 0,
      deliveryNotes: '',
    },
  });

  // Update form defaults when request data loads
  if (request && !watch('actualTruckCount')) {
    setValue('actualTruckCount', request.truckCount);
    setValue('invoiceAmount', request.estimatedCost);
  }

  const handleDriversUpdate = (drivers) => {
    setSelectedDrivers(drivers);
  };

  const validateDrivers = () => {
    if (!selectedDrivers || selectedDrivers.length === 0) {
      return { valid: false, message: 'At least one driver is required' };
    }

    for (const driver of selectedDrivers) {
      if (!driver.rating || driver.rating < 1) {
        return { 
          valid: false, 
          message: `Please rate ${driver.name} before submitting` 
        };
      }
    }

    return { valid: true };
  };

  const onSubmit = async (formData) => {
    console.log('onSubmit called with formData:', formData);
    // Validate drivers
    const driverValidation = validateDrivers();
    if (!driverValidation.valid) {
      // Driver validation failed - this is handled by form validation, just return
      return;
    }

    try {
      const deliveryData = {
        actualPickupDateTime: formData.actualPickupDateTime,
        actualTruckCount: formData.actualTruckCount,
        invoiceAmount: formData.invoiceAmount,
        deliveryNotes: formData.deliveryNotes,
        drivers: (selectedDrivers || []).map(driver => ({
          driver_id: driver.id, // Backend ID
          punctuality: driver.rating.punctuality,
          professionalism: driver.rating.professionalism,
          ...(driver.type === 'transporter' ? {
            deliveryQuality: driver.rating.deliveryQuality,
            communication: driver.rating.communication,
          } : {
            safety: driver.rating.safety,
            policyCompliance: driver.rating.policyCompliance,
            fuelEfficiency: driver.rating.fuelEfficiency,
          }),
          overall: driver.rating.overall,
          comments: driver.rating.comments || '',
        })),
      };

      await logDeliveryMutation.mutateAsync({
        requestId: id,
        deliveryData,
      });

      // After logging delivery, confirm completion to resolve race condition
      await confirmDeliveryMutation.mutateAsync(id);

      // Success - clear drivers and navigate
      clearSelectedDrivers();
      navigate(`/requests/${id}`, { 
        state: { message: 'Delivery logged and confirmed successfully!' } 
      });
    } catch (error) {
      // Error is already handled by the mutation's onError
      console.error('Failed to log delivery:', error);
    }
  };

  // Calculate variance preview
  const calculateVariancePreview = () => {
    const currentFormData = getValues();
    if (!request) return null;

    return {
      truckVariance: currentFormData.actualTruckCount - request.truckCount,
      costVariance: currentFormData.invoiceAmount - request.estimatedCost,
      costVariancePercentage: request.estimatedCost > 0 
        ? ((currentFormData.invoiceAmount - request.estimatedCost) / request.estimatedCost * 100).toFixed(1)
        : 0,
    };
  };

  const canSubmit = isValid && selectedDrivers && selectedDrivers.length > 0 && !logDeliveryMutation.isPending && !confirmDeliveryMutation.isPending;

  return {
    // Data
    request,
    isLoading,
    error,
    selectedDrivers: selectedDrivers || [],
    
    // Form
    register,
    handleSubmit: handleSubmit(onSubmit),
    errors,
    isValid,
    watch,
    
    // State
    isSubmitting: logDeliveryMutation.isPending || confirmDeliveryMutation.isPending,
    canSubmit,
    
    // Actions
    handleDriversUpdate,
    calculateVariancePreview,
    
    // Navigation
    goBack: () => navigate(`/requests/${id}`),
  };
};