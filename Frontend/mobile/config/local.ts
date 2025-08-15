// Local development configuration
// Update this IP address when your local IP changes
// NOTE: This is only used for local development. For production, use the Render backend.
export const LOCAL_CONFIG = {
  // Your current local IP address - update this when it changes
  LOCAL_IP: '192.168.0.196',
  LOCAL_PORT: '8082',
  
  // Build the full API URL
  get API_URL() {
    return `http://${this.LOCAL_IP}:${this.LOCAL_PORT}/api`;
  }
};

console.log('Local config loaded:', LOCAL_CONFIG);
console.log('NOTE: Use this only for local development. Production uses Render backend.');
