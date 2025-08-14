// Final API configuration - hardcoded for reliability
export const FINAL_API_CONFIG = {
  BASE_URL: 'http://192.168.0.196:8082/api',
  TIMEOUT: 15000,
  RETRY_ATTEMPTS: 3
};

console.log('=== FINAL API CONFIG LOADED ===');
console.log('BASE_URL:', FINAL_API_CONFIG.BASE_URL);
console.log('TIMEOUT:', FINAL_API_CONFIG.TIMEOUT);
console.log('================================');
