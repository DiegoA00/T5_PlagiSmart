import apiClient from "./api/apiService";

export interface SignatureUploadRequest {
  fumigationId?: number | null;
  cleanupId?: number | null;
  signatureType: 'technician' | 'client';
  signatureData: string;
}

export const signatureService = {
  uploadSignature: async (request: SignatureUploadRequest) => {
    try {
      const response = await apiClient.post('/signatures', request);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Error al subir la firma");
    }
  }
};

export const optimizeSignatureForUpload = (dataURL: string): Promise<string> => {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d')!;
      
      canvas.width = 400;
      canvas.height = 200;
      
      ctx.fillStyle = 'white';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      
      const optimizedDataURL = canvas.toDataURL('image/jpeg', 0.7);
      resolve(optimizedDataURL);
    };
    img.src = dataURL;
  });
};
