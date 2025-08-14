import { LOCAL_CONFIG } from './local';

// API Configuration for different environments
const getApiBaseUrl = () => {
  // Check if we're in development mode
  if (__DEV__) {
    // Use environment variable if available, otherwise use local IP
    const envUrl = process.env.EXPO_PUBLIC_API_URL;
    if (envUrl) {
      return envUrl;
    }
    
    // Use local configuration
    return LOCAL_CONFIG.API_URL;
  }
  
  // Production URL
  return 'https://your-production-api.com/api';
};

export const API_CONFIG = {
  BASE_URL: getApiBaseUrl(),
  TIMEOUT: 10000, // 10 seconds
  RETRY_ATTEMPTS: 3,
};

console.log('API Configuration loaded:', {
  BASE_URL: API_CONFIG.BASE_URL,
  IS_DEV: __DEV__,
  ENV_URL: process.env.EXPO_PUBLIC_API_URL,
});
