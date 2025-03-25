// Create or update this file to handle API requests

// Determine the API base URL based on environment
const getApiBaseUrl = () => {
  // Check if we're in development mode
  if (import.meta.env.DEV) {
    return 'http://localhost:3000';
  }
  // In production, use the Render.com URL
  return 'https://serene-symphony-backend.onrender.com';
};

// Create a base API client
const api = {
  baseUrl: getApiBaseUrl(),
  
  async get(endpoint: string) {
    const response = await fetch(`${this.baseUrl}${endpoint}`);
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    return response.json();
  },
  
  async post(endpoint: string, data: any) {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `API error: ${response.status}`);
    }
    
    return response.json();
  },
  
  // Add other methods as needed (PUT, DELETE, etc.)
};

export default api; 