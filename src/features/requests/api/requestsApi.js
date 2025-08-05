import { apiClient, ENDPOINTS } from '@/shared/api';



export const requestsApi = {
  // Get all requests with filtering
  getRequests: async (filters = {}) => {
    try {
      // Build query parameters
      const params = {};
      
      if (filters.search) {
        params.search = filters.search;
      }
      
      if (filters.status && filters.status !== 'all') {
        params.status = filters.status;
      }
      
      if (filters.priority && filters.priority !== 'all') {
        params.priority = filters.priority;
      }

      // Add pagination parameters
      if (filters.page) {
        params.page = filters.page;
      }
      
      if (filters.limit) {
        params.limit = filters.limit;
      }

      // Call your backend: GET /api/requests
      const response = await apiClient.get('/requests', { params });
      
      // Backend should return: { success: true, data: [...], pagination: { total, totalPages, currentPage, limit, hasNextPage, hasPreviousPage } }
      // Return the full response so pagination info can be extracted
      return response;
    } catch (error) {
      console.error('Error fetching requests:', error?.message || 'Unknown error');
      throw error;
    }
  },
  
  // Get single request by ID
  getRequestById: async (id) => {
    try {
      // Call your backend: GET /api/requests/:id
      const response = await apiClient.get(`/requests/${id}`);
      return response.data || response; // Adjust based on your backend response
    } catch (error) {
      console.error('Error fetching request:', error?.message || 'Unknown error');
      throw error;
    }
  },
  
  // Create new request
  createRequest: async (requestData) => {
    try {
      // Call your backend: POST /api/requests
      const response = await apiClient.post('/requests', requestData);
      return response.data || response;
    } catch (error) {
      console.error('Error creating request:', error?.message || 'Unknown error');
      throw error;
    }
  },
  
  // Update existing request
  updateRequest: async (id, updates) => {
    try {
      // Call your backend: PUT /api/requests/:id
      const response = await apiClient.put(`/requests/${id}`, updates);
      return response.data || response;
    } catch (error) {
      console.error('Error updating request:', error?.message || 'Unknown error');
      throw error;
    }
  },
  
  // Delete request (if you have this endpoint)
  deleteRequest: async (id) => {
    try {
      // Call your backend: DELETE /api/requests/:id
      const response = await apiClient.delete(`/requests/${id}`);
      return response.data || response;
    } catch (error) {
      console.error('Error deleting request:', error?.message || 'Unknown error');
      throw error;
    }
  },
};