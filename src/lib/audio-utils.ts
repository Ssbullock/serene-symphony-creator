/**
 * Audio utilities for handling meditation audio URLs consistently across the app
 */

// Base URL for the backend API
const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export const audioUtils = {
  /**
   * Convert relative path to full URL
   */
  getFullUrl: (path: string): string => {
    // If it's already a full URL, return as is
    if (path.startsWith('http')) {
      return path;
    }
    
    // Ensure path starts with /
    const normalizedPath = path.startsWith('/') ? path : `/${path}`;
    return `${BASE_URL}${normalizedPath}`;
  },

  /**
   * Get background version of URL
   */
  getBackgroundUrl: (url: string): string => {
    return url.includes('_with_bg.mp3') 
      ? url 
      : url.replace('.mp3', '_with_bg.mp3');
  },

  /**
   * Get relative path for storage
   */
  getStoragePath: (sessionId: string, withBackground = false): string => {
    return `/meditations/${sessionId}${withBackground ? '_with_bg' : ''}.mp3`;
  }
}; 