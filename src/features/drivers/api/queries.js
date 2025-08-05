import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { driversApi } from './driversApi';


// Queries
export const useDriverSearch = (searchTerm, filters = {}, options = {}) => {
  return useQuery({
    queryKey: ['drivers', 'search', searchTerm, filters],
    queryFn: () => driversApi.searchDrivers(searchTerm, filters),
    enabled: options.enabled !== false && searchTerm?.length >= 2,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    ...options,
  });
};

export const useRecentDrivers = (options = {}) => {
  return useQuery({
    queryKey: ['drivers', 'recent'],
    queryFn: driversApi.getRecentDrivers,
    staleTime: 10 * 60 * 1000,
    gcTime: 15 * 60 * 1000,
    ...options,
  });
};

export const useDriver = (id, options = {}) => {
  return useQuery({
    queryKey: ['drivers', id],
    queryFn: () => driversApi.getDriverById(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
    ...options,
  });
};

export const useDriverStats = (options = {}) => {
  return useQuery({
    queryKey: ['drivers', 'stats'],
    queryFn: driversApi.getDriverStats,
    staleTime: 15 * 60 * 1000,
    ...options,
  });
};

// Mutations
export const useCreateDriver = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: driversApi.createDriver,
    onSuccess: (newDriver) => {
      // Invalidate and refetch driver-related queries
      queryClient.invalidateQueries({ queryKey: ['drivers'] });
      
      // Optimistically update recent drivers
      queryClient.setQueryData(['drivers', 'recent'], (oldData) => {
        if (!oldData) return { data: [newDriver], total: 1 };
        return {
          data: [newDriver, ...oldData.data.slice(0, 4)],
          total: oldData.total + 1,
        };
      });

      
    },
    onError: (error) => {
      console.error('Failed to add driver:', error);
    },
  });
};

export const useUpdateDriver = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) => driversApi.updateDriver(id, data),
    onSuccess: (updatedDriver) => {
      // Update specific driver query
      queryClient.setQueryData(['drivers', updatedDriver.id], updatedDriver);
      
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: ['drivers', 'search'] });
      queryClient.invalidateQueries({ queryKey: ['drivers', 'recent'] });
      queryClient.invalidateQueries({ queryKey: ['drivers', 'stats'] });

      
    },
    onError: (error) => {
      console.error('Failed to update driver:', error);
    },
  });
};

export const useDriverRatings = (driverId, options = {}) => {
  return useQuery({
    queryKey: ['drivers', driverId, 'ratings'],
    queryFn: () => driversApi.getDriverRatings(driverId),
    enabled: !!driverId,
    staleTime: 5 * 60 * 1000,
    ...options,
  });
};


// export const useGenerateDriverInsights = () => {
//   const queryClient = useQueryClient();

//   return useMutation({
//     mutationFn: ({ driverId, ratingsData }) => driversApi.generateDriverInsights(driverId, ratingsData),
//     onSuccess: (response, { driverId }) => {
//       // --- The only thing you need to do on success ---
//       // Tell React Query that the data for this driver and the list of all drivers is now stale.
//       // React Query will automatically refetch them in the background to get the fresh data,
//       // which now includes the AI insights from the database.
//       queryClient.invalidateQueries({ queryKey: ['drivers', driverId] });
//       queryClient.invalidateQueries({ queryKey: ['drivers', 'all'] });

//       addNotification({
//         type: 'success',
//         title: 'AI Insights Generated',
//         message: 'Analysis is complete and insights are available.',
//       });
//     },
//     onError: (error) => {
//       console.error('AI Insights Generation Error:', error);
//       addNotification({
//         type: 'error',
//         title: 'Insights Generation Failed',
//         message: error.message || 'An unexpected error occurred.',
//       });
//     },
//   });
// };


export const useGenerateDriverInsights = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ driverId, ratingsData }) => driversApi.generateDriverInsights(driverId, ratingsData),
    onSuccess: (response, { driverId }) => {
      console.log('AI Insights Generated Response:', response);
      
      // Extract insights from response
      const insights = response.aiInsights || response.data?.aiInsights || response.data || response;
      console.log('Extracted insights:', insights);

      //bug here
      const updatedDriverData = queryClient.setQueryData(['drivers', driverId], (oldData) => {
        if (!oldData) return oldData;
        const updatedDriver = {
          ...oldData,
          aiInsights: insights,
          aiInsightsUpdatedAt: new Date().toISOString(),
        };
        console.log('Updated driver cache:', updatedDriver);
        return updatedDriver;
      });

      queryClient.setQueryData(['drivers', 'all'], (oldData) => {
        if (!oldData?.data) return oldData;
        const updatedList = {
          ...oldData,
          data: oldData.data.map(driver => 
            driver.id === driverId 
              ? { 
                  ...driver, 
                  aiInsights: insights,
                  aiInsightsUpdatedAt: new Date().toISOString(),
                }
              : driver
          )
        };
        console.log('Updated drivers list cache:', updatedList);
        return updatedList;
      });

      // Force refetch to ensure fresh data
      queryClient.invalidateQueries({ queryKey: ['drivers', driverId] });
      queryClient.invalidateQueries({ queryKey: ['drivers', 'all'] });
      queryClient.refetchQueries({ queryKey: ['drivers', driverId] });

    },
    onError: (error) => {
      console.error('AI Insights Generation Error:', error);
    },
  });
};