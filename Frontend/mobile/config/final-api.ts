// Final API configuration - hardcoded for reliability
export const FINAL_API_CONFIG = {
  BASE_URL: 'https://plagismart-backend.onrender.com/api',
  TIMEOUT: 15000,
  RETRY_ATTEMPTS: 3
};

console.log('=== FINAL API CONFIG LOADED ===');
console.log('Production API URL:', FINAL_API_CONFIG.BASE_URL);
console.log('TIMEOUT:', FINAL_API_CONFIG.TIMEOUT);
console.log('================================');
