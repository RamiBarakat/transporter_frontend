import { apiClient } from '@/shared/api';

export const driversApi = {
  searchDrivers: async (searchTerm, filters = {}) => {
    try {
      const params = {};
      
      if (searchTerm && searchTerm.length >= 2) {
        params.q = searchTerm || "all";
      }
      
      if (filters.type && filters.type !== 'all') {
        params.type = filters.type;
      }

      // Add pagination parameters
      if (filters.page) {
        params.page = filters.page;
      }
      
      if (filters.limit) {
        params.limit = filters.limit;
      }
      
      const response = await apiClient.get('/drivers/', { params });
      return response;
    } catch (error) {
      if (error.status === 400) {
        throw new Error('Invalid search parameters');
      } else if (error.message.includes('Network Error')) {
        throw new Error('Unable to connect to server. Please check your connection.');
      } else {
        throw error;
      }
    }
  },

  getRecentDrivers: async (limit = 5) => {
    try {
      const response = await apiClient.get('/drivers/recent', {
        params: { limit }
      });
      return response;
    } catch (error) {
      if (error.message.includes('Network Error')) {
        throw new Error('Unable to connect to server. Please check your connection.');
      } else {
        throw error;
      }
    }
  },

  getDriverById: async (id) => {
    try {
      const response = await apiClient.get(`/drivers/${id}`);
      return response;
    } catch (error) {
      if (error.status === 404) {
        throw new Error(`Driver with ID ${id} not found`);
      } else {
        throw error;
      }
    }
  },

  createDriver: async (driverData) => {
    try {
      // Client-side validation
      if (!driverData.name || driverData.name.length < 2) {
        throw new Error('Driver name must be at least 2 characters');
      }
      
      if (!driverData.type || !['transporter', 'in_house'].includes(driverData.type)) {
        throw new Error('Invalid driver type. Must be "transporter" or "in_house"');
      }
      
      if (driverData.type === 'transporter') {
        if (!driverData.transportCompany) {
          throw new Error('Transport company is required for transporter drivers');
        }
        if (!driverData.phone) {
          throw new Error('Phone number is required for transporter drivers');
        }
      } else if (driverData.type === 'in_house') {
        if (!driverData.employeeId) {
          throw new Error('Employee ID is required for in-house drivers');
        }
        if (!driverData.department) {
          throw new Error('Department is required for in-house drivers');
        }
      }

      const response = await apiClient.post('/drivers', driverData);
      return response;
    } catch (error) {
      if (error.status === 400) {
        throw new Error(error.data?.message || 'Invalid driver data provided');
      } else if (error.status === 409) {
        throw new Error('Driver with this information already exists');
      } else if (error.message.includes('Network Error')) {
        throw new Error('Unable to connect to server. Please check your connection.');
      } else {
        throw error;
      }
    }
  },

  updateDriver: async (id, driverData) => {
    try {
      const response = await apiClient.put(`/drivers/${id}`, driverData);
      return response;
    } catch (error) {
      if (error.status === 404) {
        throw new Error(`Driver with ID ${id} not found`);
      } else if (error.status === 400) {
        throw new Error(error.data?.message || 'Invalid driver data provided');
      } else {
        throw error;
      }
    }
  },

  deleteDriver: async (id) => {
    try {
      const response = await apiClient.delete(`/drivers/${id}`);
      return response;
    } catch (error) {
      if (error.status === 404) {
        throw new Error(`Driver with ID ${id} not found`);
      } else if (error.status === 409) {
        throw new Error('Cannot delete driver with existing deliveries');
      } else {
        throw error;
      }
    }
  },

  getDriverStats: async () => {
    try {
      const response = await apiClient.get('/drivers/stats');
      return response;
    } catch (error) {
      if (error.message.includes('Network Error')) {
        throw new Error('Unable to connect to server. Please check your connection.');
      } else {
        throw error;
      }
    }
  },

  getDriverPerformance: async (id) => {
    try {
      const response = await apiClient.get(`/drivers/${id}/performance`);
      return response;
    } catch (error) {
      if (error.status === 404) {
        throw new Error(`Driver with ID ${id} not found`);
      } else {
        throw error;
      }
    }
  },

  getDriverDeliveries: async (id, params = {}) => {
    try {
      const response = await apiClient.get(`/drivers/${id}/deliveries`, { params });
      return response;
    } catch (error) {
      if (error.status === 404) {
        throw new Error(`Driver with ID ${id} not found`);
      } else {
        throw error;
      }
    }
  },

  updateDriverRating: async (driverId, deliveryId, ratingData) => {
    try {
      const response = await apiClient.post(`/drivers/${driverId}/ratings`, {
        deliveryId,
        ...ratingData
      });
      return response;
    } catch (error) {
      if (error.status === 404) {
        throw new Error(`Driver with ID ${driverId} not found`);
      } else if (error.status === 400) {
        throw new Error(error.data?.message || 'Invalid rating data provided');
      } else {
        throw error;
      }
    }
  },

  getDriverRatings: async (driverId, params = {}) => {
    try {
      const response = await apiClient.get(`/drivers/${driverId}/ratings`, { params });
      return response;
    } catch (error) {
      if (error.status === 404) {
        throw new Error(`Driver with ID ${driverId} not found`);
      } else {
        throw error;
      }
    }
  },

  generateDriverInsights: async (driverId, ratingsData) => {
    try {
      // Validate driver ID
      if (!driverId || driverId === 'undefined' || driverId === 'null') {
        throw new Error(`Invalid driver ID: ${driverId}`);
      }

      console.log('AI Insights API Call:', {
        driverId,
        driverIdType: typeof driverId,
        endpoint: `/drivers/${driverId}/insights`,
        ratingsData,
        ratingsCount: ratingsData?.length
      });
      
      const response = await apiClient.post(`/drivers/${driverId}/insights`, {
        ratingsData
      });
      
      console.log('AI Insights API Response:', {
        status: response.status,
        data: response.data,
        fullResponse: response
      });
      
      return response;
    } catch (error) {
      console.error('AI Insights API Error:', {
        error,
        status: error.response?.status,
        data: error.response?.data,
        driverId
      });

      if (error.response?.status === 404) {
        throw new Error(`Driver with ID ${driverId} not found`);
      } else if (error.response?.status === 400) {
        throw new Error(error.response?.data?.message || `Invalid driver ID: ${driverId}`);
      } else if (error.message?.includes('Invalid driver ID')) {
        throw error; // Re-throw our validation error
      } else {
        throw new Error(`Failed to generate insights: ${error.message}`);
      }
    }
  },

  updateDriverAIInsights: async (driverId, insights) => {
    try {
      const response = await apiClient.put(`/drivers/${driverId}/insights`, {
        aiInsights: insights
      });
      return response;
    } catch (error) {
      if (error.status === 404) {
        throw new Error(`Driver with ID ${driverId} not found`);
      } else {
        throw error;
      }
    }
  },
};