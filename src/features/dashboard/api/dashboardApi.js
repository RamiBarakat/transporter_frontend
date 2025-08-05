import { apiClient } from '@/shared/api';
import { Clock, TrendingUp, Truck, Users } from 'lucide-react';

// Icon mapping for KPI cards
const KPI_ICONS = {
  'on-time-delivery': Clock,
  'cost-variance': TrendingUp,
  'fleet-utilization': Truck,
  'driver-performance': Users,
};

export const dashboardApi = {
  getKPIData: async (dateRange) => {
    try {
      const params = {
        startDate: dateRange.startDate.toISOString().split('T')[0],
        endDate: dateRange.endDate.toISOString().split('T')[0],
      };
      
      const response = await apiClient.get('/dashboard/kpi', { params });
      
      // Add icons to KPI data (frontend requirement)
      if (response.data && Array.isArray(response.data)) {
        return response.data.map(kpi => ({
          ...kpi,
          icon: KPI_ICONS[kpi.id] || TrendingUp
        }));
      }
      
      return response;
    } catch (error) {
      if (error.response?.status === 404) {
        throw new Error('Dashboard KPI endpoint not found. Please ensure backend is running.');
      } else if (error.response?.status >= 500) {
        throw new Error('Server error while fetching KPI data. Please try again later.');
      }
      throw new Error(error.response?.data?.error?.message || 'Failed to fetch KPI data');
    }
  },

  getTrendsData: async (dateRange) => {
    try {
      const params = {
        startDate: dateRange.startDate.toISOString().split('T')[0],
        endDate: dateRange.endDate.toISOString().split('T')[0],
        granularity: 'daily'
      };
      
      const response = await apiClient.get('/dashboard/trends', { params });
      return response;
    } catch (error) {
      if (error.response?.status === 404) {
        throw new Error('Dashboard trends endpoint not found. Please ensure backend is running.');
      } else if (error.response?.status >= 500) {
        throw new Error('Server error while fetching trends data. Please try again later.');
      }
      throw new Error(error.response?.data?.error?.message || 'Failed to fetch trends data');
    }
  },

  getAIInsights: async (dateRange) => {
    try {
      const params = {
        startDate: dateRange.startDate.toISOString().split('T')[0],
        endDate: dateRange.endDate.toISOString().split('T')[0],
        limit: 10
      };
      
      const response = await apiClient.get('/dashboard/ai-insights', { params });
      return response;
    } catch (error) {
      if (error.response?.status === 404) {
        throw new Error('AI insights endpoint not found. Please ensure backend is running.');
      } else if (error.response?.status >= 500) {
        throw new Error('Server error while fetching AI insights. Please try again later.');
      }
      throw new Error(error.response?.data?.error?.message || 'Failed to fetch AI insights');
    }
  },

  getTransporterComparison: async (dateRange) => {
    try {
      const params = {
        startDate: dateRange.startDate.toISOString().split('T')[0],
        endDate: dateRange.endDate.toISOString().split('T')[0],
        sortBy: 'aiScore',
        minDeliveries: 10
      };
      
      const response = await apiClient.get('/dashboard/transporter-comparison', { params });
      return response;
    } catch (error) {
      if (error.response?.status === 404) {
        throw new Error('Transporter comparison endpoint not found. Please ensure backend is running.');
      } else if (error.response?.status >= 500) {
        throw new Error('Server error while fetching transporter data. Please try again later.');
      }
      throw new Error(error.response?.data?.error?.message || 'Failed to fetch transporter comparison data');
    }
  },

  // Future endpoints for other dashboard pages
  getPerformanceComparisonData: async (filters) => {
    try {
      const response = await apiClient.get('/dashboard/performance-comparison', { params: filters });
      return response;
    } catch (error) {
      if (error.response?.status === 404) {
        throw new Error('Performance comparison endpoint not implemented yet.');
      }
      throw new Error(error.response?.data?.error?.message || 'Failed to fetch performance comparison data');
    }
  },

  getAnomalyDetectionData: async (dateRange) => {
    try {
      const params = {
        startDate: dateRange.startDate.toISOString().split('T')[0],
        endDate: dateRange.endDate.toISOString().split('T')[0],
      };
      
      const response = await apiClient.get('/dashboard/anomalies', { params });
      return response;
    } catch (error) {
      if (error.response?.status === 404) {
        throw new Error('Anomaly detection endpoint not implemented yet.');
      }
      throw new Error(error.response?.data?.error?.message || 'Failed to fetch anomaly detection data');
    }
  },

  getPredictiveAnalytics: async (params) => {
    try {
      const response = await apiClient.get('/dashboard/predictions', { params });
      return response;
    } catch (error) {
      if (error.response?.status === 404) {
        throw new Error('Predictive analytics endpoint not implemented yet.');
      }
      throw new Error(error.response?.data?.error?.message || 'Failed to fetch predictive analytics');
    }
  }
};