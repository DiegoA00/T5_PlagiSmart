// Función para convertir string a base64 (compatible con React Native)
export const stringToBase64 = (str: string): string => {
  if (typeof btoa !== 'undefined') {
    return btoa(str);
  }
  
  // Implementación alternativa para React Native
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
  let output = '';
  const bytes = new Uint8Array(str.length);
  
  for (let i = 0; i < str.length; i++) {
    bytes[i] = str.charCodeAt(i);
  }
  
  let byteNum;
  let chunk;
  
  for (let i = 0; i < bytes.length; i += 3) {
    byteNum = (bytes[i] << 16) | (bytes[i + 1] << 8) | (bytes[i + 2] || 0);
    chunk = [
      chars[(byteNum >> 18) & 0x3F],
      chars[(byteNum >> 12) & 0x3F],
      chars[(byteNum >> 6) & 0x3F],
      chars[byteNum & 0x3F]
    ];
    output += chunk.join('');
  }
  
  return output;
};
