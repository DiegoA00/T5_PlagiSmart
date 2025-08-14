import { API_CONFIG } from './api';
import { LOCAL_CONFIG } from './local';

console.log('=== CONFIGURATION TEST ===');
console.log('LOCAL_CONFIG:', LOCAL_CONFIG);
console.log('LOCAL_CONFIG.API_URL:', LOCAL_CONFIG.API_URL);
console.log('API_CONFIG:', API_CONFIG);
console.log('API_CONFIG.BASE_URL:', API_CONFIG.BASE_URL);
console.log('==========================');

export const testConfig = {
  local: LOCAL_CONFIG,
  api: API_CONFIG
};
