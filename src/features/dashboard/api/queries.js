import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { dashboardApi } from './dashboardApi';
import { useNotificationStore } from '@/app/store';

// KPI Data Query
export const useKPIData = (dateRange, options = {}) => {
  return useQuery({
    queryKey: ['dashboard', 'kpi', dateRange],
    queryFn: () => dashboardApi.getKPIData(dateRange),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    ...options,
  });
};

// Trends Data Query
export const useTrendsData = (dateRange, options = {}) => {
  return useQuery({
    queryKey: ['dashboard', 'trends', dateRange],
    queryFn: () => dashboardApi.getTrendsData(dateRange),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    ...options,
  });
};

// AI Insights Query
export const useAIInsights = (dateRange, options = {}) => {
  return useQuery({
    queryKey: ['dashboard', 'ai-insights', dateRange],
    queryFn: () => dashboardApi.getAIInsights(dateRange),
    staleTime: 2 * 60 * 1000, // Refresh more frequently for AI insights
    gcTime: 5 * 60 * 1000,
    ...options,
  });
};

// Transporter Comparison Query
export const useTransporterComparison = (dateRange, options = {}) => {
  return useQuery({
    queryKey: ['dashboard', 'transporter-comparison', dateRange],
    queryFn: () => dashboardApi.getTransporterComparison(dateRange),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    ...options,
  });
};

// Performance Comparison Query (for dedicated performance dashboard)
export const usePerformanceComparisonData = (filters, options = {}) => {
  return useQuery({
    queryKey: ['dashboard', 'performance-comparison', filters],
    queryFn: () => dashboardApi.getPerformanceComparisonData(filters),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    enabled: !!filters,
    ...options,
  });
};

// Anomaly Detection Query (for AI insights dashboard)
export const useAnomalyDetectionData = (dateRange, options = {}) => {
  return useQuery({
    queryKey: ['dashboard', 'anomalies', dateRange],
    queryFn: () => dashboardApi.getAnomalyDetectionData(dateRange),
    staleTime: 3 * 60 * 1000,
    gcTime: 5 * 60 * 1000,
    ...options,
  });
};

// Predictive Analytics Query (for AI insights dashboard)
export const usePredictiveAnalytics = (params, options = {}) => {
  return useQuery({
    queryKey: ['dashboard', 'predictions', params],
    queryFn: () => dashboardApi.getPredictiveAnalytics(params),
    staleTime: 10 * 60 * 1000, // Predictions can be cached longer
    gcTime: 30 * 60 * 1000,
    ...options,
  });
};

// Refresh Dashboard Mutation
export const useRefreshDashboard = () => {
  const queryClient = useQueryClient();
  const { addNotification } = useNotificationStore();

  return useMutation({
    mutationFn: async (dateRange) => {
      // Invalidate all dashboard queries
      await queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      
      // Optionally refetch specific queries
      await Promise.all([
        queryClient.refetchQueries({ queryKey: ['dashboard', 'kpi', dateRange] }),
        queryClient.refetchQueries({ queryKey: ['dashboard', 'trends', dateRange] }),
        queryClient.refetchQueries({ queryKey: ['dashboard', 'ai-insights', dateRange] }),
        queryClient.refetchQueries({ queryKey: ['dashboard', 'transporter-comparison', dateRange] }),
      ]);
    },
    onSuccess: () => {
      addNotification({
        type: 'success',
        title: 'Dashboard Refreshed',
        message: 'All dashboard data has been updated successfully.',
      });
    },
    onError: (error) => {
      addNotification({
        type: 'error',
        title: 'Refresh Failed',
        message: error.message || 'Failed to refresh dashboard data. Please try again.',
      });
    },
  });
};