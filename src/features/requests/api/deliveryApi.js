import { apiClient } from '@/shared/api';

export const deliveryApi = {
  logDeliveryWithDrivers: async (requestId, deliveryData) => {
    try {
      // Client-side validation before sending to backend
      if (!deliveryData.actualPickupDateTime) {
        throw new Error('Actual pickup date and time is required');
      }
      
      if (!deliveryData.actualTruckCount || deliveryData.actualTruckCount < 1) {
        throw new Error('Actual truck count must be at least 1');
      }
      
      if (!deliveryData.invoiceAmount || deliveryData.invoiceAmount < 0) {
        throw new Error('Invoice amount must be a positive number');
      }
      
      if (!deliveryData.drivers || deliveryData.drivers.length === 0) {
        throw new Error('At least one driver is required');
      }
      
      // Validate driver ratings
      for (const driver of deliveryData.drivers) {
        if (!driver.overall || driver.overall < 1) {
          throw new Error(`Overall rating is required for driver ID ${driver.driver_id}. Please rate all drivers before logging delivery.`);
        }
      }

      // Make real API call to backend
      const response = await apiClient.post(`/deliveries/${requestId}/log`, {
        actualPickupDateTime: deliveryData.actualPickupDateTime,
        actualTruckCount: deliveryData.actualTruckCount,
        invoiceAmount: deliveryData.invoiceAmount,
        deliveryNotes: deliveryData.deliveryNotes || '',
        drivers: deliveryData.drivers 
      });

      return response;
    } catch (error) {
      // Enhanced error handling
      if (error.status === 404) {
        throw new Error(`Request ${requestId} not found`);
      } else if (error.status === 400) {
        throw new Error(error.data?.message || 'Invalid delivery data provided');
      } else if (error.status >= 500) {
        throw new Error('Server error occurred while logging delivery');
      } else if (error.message.includes('Network Error')) {
        throw new Error('Unable to connect to server. Please check your connection.');
      } else {
        throw error;
      }
    }
  },

  confirmDeliveryCompletion: async (requestId) => {
    try {
      const response = await apiClient.post(`/deliveries/${requestId}/confirm`);
      return response;
    } catch (error) {
      if (error.status === 404) {
        throw new Error(`Request ${requestId} not found`);
      } else if (error.status === 409) {
        throw new Error('Delivery has already been confirmed');
      } else if (error.status === 400) {
        throw new Error('Delivery cannot be confirmed in current state');
      } else if (error.status >= 500) {
        throw new Error('Server error occurred while confirming delivery');
      } else {
        throw error;
      }
    }
  },

  updateDelivery: async (deliveryId, deliveryData) => {
    try {
      const response = await apiClient.put(`/deliveries/${deliveryId}`, deliveryData);
      return response;
    } catch (error) {
      if (error.status === 404) {
        throw new Error(`Delivery ${deliveryId} not found for request ${requestId}`);
      } else if (error.status === 400) {
        throw new Error(error.data?.message || 'Invalid delivery data provided');
      } else {
        throw error;
      }
    }
  },

  getDeliveryHistory: async (driverId) => {
    try {
      const response = await apiClient.get(`/drivers/${driverId}/deliveries`);
      return response;
    } catch (error) {
      if (error.status === 404) {
        throw new Error(`Driver ${driverId} not found`);
      } else {
        throw error;
      }
    }
  },

  getDriverPerformanceMetrics: async (driverId, timeRange = '30d') => {
    try {
      const response = await apiClient.get(`/drivers/${driverId}/performance`, {
        params: { timeRange }
      });
      return response;
    } catch (error) {
      if (error.status === 404) {
        throw new Error(`Driver ${driverId} not found`);
      } else {
        throw error;
      }
    }
  },
};