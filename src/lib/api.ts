// Create or update this file to handle API requests

// Determine the API base URL based on environment
const getApiBaseUrl = () => {
  // Check if we're in development mode
  if (import.meta.env.DEV) {
    console.log('Running in development mode');
    return 'http://localhost:3000';
  }
  // In production, use the Render.com URL
  console.log('Running in production mode');
  return 'https://serene-symphony-backend.onrender.com';
};

// Create a base API client
const api = {
  baseUrl: getApiBaseUrl(),
  
  async get(endpoint: string) {
    try {
      console.log(`Making GET request to: ${this.baseUrl}${endpoint}`);
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        let errorDetail;
        try {
          const errorJson = await response.json();
          errorDetail = errorJson.error || response.statusText;
        } catch {
          errorDetail = response.statusText;
        }
        console.error('API error response:', {
          status: response.status,
          statusText: response.statusText,
          error: errorDetail
        });
        throw new Error(`API call failed: ${errorDetail}`);
      }

      const data = await response.json();
      console.log(`Successful response from ${endpoint}:`, data);
      return data;
    } catch (error) {
      console.error('API call error:', {
        endpoint,
        error: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined
      });
      throw error;
    }
  },
  
  async post(endpoint: string, data: any) {
    try {
      console.log(`Making POST request to: ${this.baseUrl}${endpoint}`, {
        endpoint,
        requestData: data
      });
      
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        let errorDetail;
        try {
          const errorJson = await response.json();
          errorDetail = errorJson.error || response.statusText;
        } catch {
          errorDetail = response.statusText;
        }
        console.error('API error response:', {
          status: response.status,
          statusText: response.statusText,
          error: errorDetail
        });
        throw new Error(`API call failed: ${errorDetail}`);
      }

      const responseData = await response.json();
      console.log(`Successful response from ${endpoint}:`, responseData);
      
      // Only check for explicit failure, not missing success status
      if (responseData.status === 'error') {
        throw new Error(`API error: ${responseData.error || 'Unknown error'}`);
      }

      return responseData;
    } catch (error) {
      console.error('API call error:', {
        endpoint,
        requestData: data,
        error: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined
      });
      throw error;
    }
  },
  
  // Add other methods as needed (PUT, DELETE, etc.)
};

export default api; 