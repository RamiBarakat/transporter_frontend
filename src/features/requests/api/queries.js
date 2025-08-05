import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { requestsApi } from './requestsApi';
import { deliveryApi } from './deliveryApi';
import { useNotificationStore } from '@/app/store';

// Query keys
export const requestsKeys = {
  all: ['requests'],
  lists: () => [...requestsKeys.all, 'list'],
  list: (filters) => [...requestsKeys.lists(), filters],
  details: () => [...requestsKeys.all, 'detail'],
  detail: (id) => [...requestsKeys.details(), id],
};

// Get all requests with filters
export const useRequests = (filters = {}) => {
  return useQuery({
    queryKey: [
      'requests', 
      'paginated-list',
      filters.search || '',
      filters.page || 1,
      filters.limit || 10,
      filters.status || 'all',
      filters.priority || 'all'
    ],
    queryFn: () => requestsApi.getRequests(filters),
    staleTime: 1000 * 60 * 5, // 5 minutes
    cacheTime: 1000 * 60 * 10, // 10 minutes
  });
};

// Get single request
export const useRequest = (id) => {
  return useQuery({
    queryKey: requestsKeys.detail(id),
    queryFn: () => requestsApi.getRequestById(id),
    enabled: !!id,
    staleTime: 1000 * 60 * 5,
  });
};

// Create request mutation
export const useCreateRequest = () => {
  const queryClient = useQueryClient();
  const { success, error } = useNotificationStore();
  
  return useMutation({
    mutationFn: requestsApi.createRequest,
    onSuccess: (newRequest) => {
      // Invalidate only requests lists (more specific invalidation)
      queryClient.invalidateQueries({ queryKey: ['requests', 'paginated-list'] });
      
      // Add to cache
      queryClient.setQueryData(requestsKeys.detail(newRequest.id), newRequest);
      
      success(`Request ${newRequest.id} created successfully`);
    },
    onError: (err) => {
      error('Failed to create request: ' + err.message);
    },
  });
};

// Update request mutation
export const useUpdateRequest = () => {
  const queryClient = useQueryClient();
  const { success, error } = useNotificationStore();
  
  return useMutation({
    mutationFn: ({ id, updates }) => requestsApi.updateRequest(id, updates),
    onSuccess: (updatedRequest) => {
      // Update cache
      queryClient.setQueryData(requestsKeys.detail(updatedRequest.id), updatedRequest);
      
      // Invalidate lists to trigger refetch
      queryClient.invalidateQueries({ queryKey: ['requests', 'paginated-list'] });
      
      success(`Request ${updatedRequest.id} updated successfully`);
    },
    onError: (err) => {
      error('Failed to update request: ' + err.message);
    },
  });
};

// Delete request mutation
export const useDeleteRequest = () => {
  const queryClient = useQueryClient();
  const { success, error } = useNotificationStore();
  
  return useMutation({
    mutationFn: requestsApi.deleteRequest,
    onSuccess: (_, deletedId) => {
      // Remove from cache
      queryClient.removeQueries({ queryKey: requestsKeys.detail(deletedId) });
      
      // Invalidate lists
      queryClient.invalidateQueries({ queryKey: ['requests', 'paginated-list'] });
      
      success(`Request ${deletedId} deleted successfully`);
    },
    onError: (err) => {
      error('Failed to delete request: ' + err.message);
    },
  });
};

// Delivery logging mutations
export const useLogDeliveryWithDrivers = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ requestId, deliveryData }) => 
      deliveryApi.logDeliveryWithDrivers(requestId, deliveryData),
    onSuccess: (result, { requestId }) => {
      // Invalidate and refetch request queries
      queryClient.invalidateQueries({ queryKey: ['requests', 'paginated-list'] });
      queryClient.invalidateQueries({ queryKey: ['request', requestId] });
      
      // Invalidate driver queries to update their stats
      queryClient.invalidateQueries({ queryKey: ['drivers'] });

    },
    onError: (error) => {
      console.error('Failed to log delivery:', error);
    },
  });
};

export const useUpdateDelivery = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ requestId, deliveryId, deliveryData }) => 
      deliveryApi.updateDelivery(requestId, deliveryId, deliveryData),
    onSuccess: (result, { requestId }) => {
      queryClient.invalidateQueries({ queryKey: ['requests', 'paginated-list'] });
      queryClient.invalidateQueries({ queryKey: ['request', requestId] });
      queryClient.invalidateQueries({ queryKey: ['drivers'] });

      
    },
    onError: (error) => {
      console.error('Failed to log delivery:', error);

    },
  });
};

// Confirm delivery completion mutation
export const useConfirmDeliveryCompletion = () => {
  const queryClient = useQueryClient();
  const { addNotification } = useNotificationStore();

  return useMutation({
    mutationFn: (requestId) => deliveryApi.confirmDeliveryCompletion(requestId),
    onSuccess: (result, requestId) => {
      // Invalidate request queries to reflect the confirmed status
      queryClient.invalidateQueries({ queryKey: ['requests', 'paginated-list'] });
      queryClient.invalidateQueries({ queryKey: ['request', requestId] });
      
      addNotification({
        type: 'success',
        title: 'Delivery Confirmed',
        message: 'Delivery completion has been confirmed successfully.',
      });
    },
    onError: (error) => {
      addNotification({
        type: 'error',
        title: 'Failed to Confirm Delivery',
        message: error.message || 'An unexpected error occurred while confirming delivery completion.',
      });
    },
  });
};