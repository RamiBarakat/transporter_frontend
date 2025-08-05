import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

import { useCreateRequest, useUpdateRequest, useRequest } from '../../api';

const requestSchema = yup.object({
  origin: yup
    .string()
    .required('Origin is required')
    .min(2, 'Origin must be at least 2 characters')
    .max(100, 'Origin must be less than 100 characters'),
  
  destination: yup
    .string()
    .required('Destination is required')
    .min(2, 'Destination must be at least 2 characters')
    .max(100, 'Destination must be less than 100 characters'),
  
  pickUpDateTime: yup
    .string()
    .required('Pick-up date and time is required'),
  
  truckCount: yup
    .number()
    .required('Truck count is required')
    .min(1, 'At least 1 truck is required')
    .max(20, 'Maximum 20 trucks allowed')
    .integer('Truck count must be a whole number'),
  
  loadDetails: yup
    .string()
    .required('Load details are required')
    .min(10, 'Please provide more detailed description (at least 10 characters)')
    .max(1000, 'Load details must be less than 1000 characters'),
});

export const useCreateRequestPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = Boolean(id);
  
  // API hooks
  const createRequestMutation = useCreateRequest();
  const updateRequestMutation = useUpdateRequest();
  const { data: existingRequest, isLoading: isLoadingRequest } = useRequest(id);
  
  const [estimatedDistance, setEstimatedDistance] = useState(0);
  const [isCalculatingDistance, setIsCalculatingDistance] = useState(false);

  const mockDistances = {
    'dallas-houston': 362,
    'houston-dallas': 362,
    'dallas-austin': 312,
    'austin-dallas': 312,
    'houston-austin': 265,
    'austin-houston': 265,
    'dallas-san antonio': 435,
    'houston-san antonio': 315,
  };

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors, isSubmitting, isValid }
  } = useForm({
    resolver: yupResolver(requestSchema),
    mode: 'onBlur',
    defaultValues: {
      origin: '',
      destination: '',
      pickUpDateTime: '',
      truckCount: 1,
      loadDetails: '',
    }
  });

  // Load existing data into form when in edit mode
  useEffect(() => {
    if (isEditMode && existingRequest) {
      // Format the date for datetime-local input
      const formattedDateTime = existingRequest.pickUpDateTime 
        ? new Date(existingRequest.pickUpDateTime).toISOString().slice(0, 16)
        : '';
      
      reset({
        origin: existingRequest.origin || '',
        destination: existingRequest.destination || '',
        pickUpDateTime: formattedDateTime,
        truckCount: existingRequest.truckCount || 1,
        loadDetails: existingRequest.loadDetails || '',
      });
      
      // Set the estimated distance from existing data
      if (existingRequest.estimatedDistance) {
        setEstimatedDistance(existingRequest.estimatedDistance);
      }
    }
  }, [isEditMode, existingRequest, reset]);

  // Watch origin and destination for distance calculation
  const [origin, destination] = watch(['origin', 'destination']);

  // Auto-calculate distance when origin/destination changes
  useEffect(() => {
    const calculateDistance = async () => {
      if (origin && destination && origin !== destination) {
        setIsCalculatingDistance(true);
        
        const key = `${origin.toLowerCase()}-${destination.toLowerCase()}`;
        const calculatedDistance = mockDistances[key] || Math.floor(Math.random() * 500) + 100;
        
        setEstimatedDistance(calculatedDistance);
        setIsCalculatingDistance(false);
      } else {
        setEstimatedDistance(0);
      }
    };

  // Debounce the calculation
  const timer = setTimeout(calculateDistance, 500);
    return () => clearTimeout(timer);
  }, [origin, destination]);

  const onSubmit = async (data) => {
    try {
      const calculatedEstimatedCost = estimatedDistance * 2.5 * data.truckCount;
      
      const requestData = {
        origin: data.origin,
        destination: data.destination,
        pickUpDateTime: data.pickUpDateTime,
        truckCount: data.truckCount,
        loadDetails: data.loadDetails,
        estimatedDistance: estimatedDistance,
        estimatedCost: calculatedEstimatedCost,
      };

      if (isEditMode) {
        console.log('Updating request:', id, requestData);
        await updateRequestMutation.mutateAsync({ id, updates: requestData });
      } else {
        console.log('Creating new request:', requestData);
        await createRequestMutation.mutateAsync(requestData);
      }
      
      navigate('/requests');
      
    } catch (error) {
      console.error(`Error ${isEditMode ? 'updating' : 'creating'} request:`, error);
      alert(`Failed to ${isEditMode ? 'update' : 'create'} request. Please try again.`);
    }
  };

  const goBack = () => {
    navigate('/requests');
  };

  return {
    register,
    handleSubmit: handleSubmit(onSubmit),
    watch,
    errors,
    isValid,
    isSubmitting: isSubmitting || createRequestMutation.isPending || updateRequestMutation.isPending,
    
    estimatedDistance,
    isCalculatingDistance,
    
    // Edit mode data
    isEditMode,
    isLoadingRequest,
    existingRequest,
    
    goBack,
  };
};