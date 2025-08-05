import { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

import { useRequest, useDeliveryForEdit, useUpdateDeliveryWithDrivers } from '../../api';
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

export const useDeliveryEditPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // Zustand store for driver management
  const { selectedDrivers, setSelectedDrivers, clearSelectedDrivers } = useUIStore();
  
  // API hooks
  const { data: request, isLoading: isLoadingRequest, error: requestError } = useRequest(id);
  const { data: deliveryData, isLoading: isLoadingDelivery, error: deliveryError } = useDeliveryForEdit(id, true);
  const updateDeliveryMutation = useUpdateDeliveryWithDrivers();

  // Extract data from API response
  const existingDelivery = deliveryData?.data?.delivery;
  const existingDrivers = deliveryData?.data?.drivers || [];

  // Form handling
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    watch,
    setValue,
    getValues,
    reset
  } = useForm({
    resolver: yupResolver(createDeliverySchema(request)),
    mode: 'onChange',
    defaultValues: {
      actualPickupDateTime: '',
      actualTruckCount: 1,
      invoiceAmount: 0,
      deliveryNotes: '',
    },
  });

  // Initialize form with existing delivery data
  useEffect(() => {
    if (existingDelivery) {
      reset({
        actualPickupDateTime: existingDelivery.actualPickupDateTime ? 
          new Date(existingDelivery.actualPickupDateTime).toISOString().slice(0, 16) : '',
        actualTruckCount: existingDelivery.actualTruckCount || 1,
        invoiceAmount: existingDelivery.invoiceAmount || 0,
        deliveryNotes: existingDelivery.deliveryNotes || '',
      });
    }
  }, [existingDelivery, reset]);

  // Initialize selected drivers with existing driver data
  useEffect(() => {
    if (existingDrivers.length > 0) {
      const driversWithRatings = existingDrivers.map(item => ({
        id: item.driver.id,
        name: item.driver.name,
        type: item.driver.type,
        transportCompany: item.driver.transportCompany,
        employeeId: item.driver.employeeId,
        department: item.driver.department,
        tempId: `existing-${item.driver.id}`,
        ratingId: item.ratingId,
        rating: {
          punctuality: item.ratings.punctuality || 0,
          professionalism: item.ratings.professionalism || 0,
          deliveryQuality: item.ratings.deliveryQuality || 0,
          communication: item.ratings.communication || 0,
          safety: item.ratings.safety || 0,
          policyCompliance: item.ratings.policyCompliance || 0,
          fuelEfficiency: item.ratings.fuelEfficiency || 0,
          overall: item.ratings.overallRating || 0,
          comments: item.ratings.comments || ''
        }
      }));
      setSelectedDrivers(driversWithRatings);
    }
  }, [existingDrivers, setSelectedDrivers]);

  const handleDriversUpdate = (drivers) => {
    setSelectedDrivers(drivers);
  };

  const validateDrivers = () => {
    if (!selectedDrivers || selectedDrivers.length === 0) {
      return { valid: false, message: 'At least one driver is required' };
    }

    for (const driver of selectedDrivers) {
      if (!driver.rating || driver.rating.overall < 1) {
        return { 
          valid: false, 
          message: `Please rate ${driver.name} before updating` 
        };
      }
    }

    return { valid: true };
  };

  const onSubmit = async (formData) => {
    
    // Validate drivers
    const driverValidation = validateDrivers();
    if (!driverValidation.valid) {
      return;
    }

    try {
      const deliveryUpdateData = {
        delivery: {
          actualPickupDateTime: formData.actualPickupDateTime,
          actualTruckCount: formData.actualTruckCount,
          invoiceAmount: formData.invoiceAmount,
          deliveryNotes: formData.deliveryNotes,
        },
        drivers: (selectedDrivers || []).map(driver => ({
          // Always include driver_id, and ratingId if it exists (for existing ratings)
          driver_id: driver.id,
          ...(driver.ratingId && { ratingId: driver.ratingId }),
          ratings: {
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
            overallRating: driver.rating.overall,
            comments: driver.rating.comments || '',
          },
        })),
      };

      await updateDeliveryMutation.mutateAsync({
        requestId: id,
        deliveryData: deliveryUpdateData,
      });

      // Success - clear drivers and navigate
      clearSelectedDrivers();
      navigate(`/requests`, { 
        state: { message: 'Delivery updated successfully!' } 
      });
    } catch (error) {
      console.error('Failed to update delivery:', error?.message || 'Unknown error');
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

  const isLoading = isLoadingRequest || isLoadingDelivery;
  const error = requestError || deliveryError;
  const canSubmit = isValid && selectedDrivers && selectedDrivers.length > 0 && !updateDeliveryMutation.isPending;

  return {
    // Data
    request,
    isLoading,
    error,
    existingDelivery,
    existingDrivers: selectedDrivers || [],
    
    // Form
    register,
    handleSubmit: handleSubmit(onSubmit),
    errors,
    isValid,
    watch,
    
    // State
    isSubmitting: updateDeliveryMutation.isPending,
    canSubmit,
    
    // Actions
    handleDriversUpdate,
    calculateVariancePreview,
    
    // Navigation
    goBack: () => navigate(`/requests`),
  };
};