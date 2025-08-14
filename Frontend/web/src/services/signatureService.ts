export interface SignatureUploadRequest {
  fumigationId?: number | null;
  cleanupId?: number | null;
  signatureType: 'technician' | 'client';
  signatureData: string;
}

export const signatureService = {
  uploadSignature: async (request: SignatureUploadRequest) => {
    // TODO: Endpoint no implementado aún - deshabilitado temporalmente
    console.log('📝 Signature would be uploaded:', {
      fumigationId: request.fumigationId,
      cleanupId: request.cleanupId,
      signatureType: request.signatureType,
      signatureDataLength: request.signatureData.length,
      // Agregar preview del contenido de la imagen
      signatureDataPreview: request.signatureData.substring(0, 100) + '...',
      isValidDataURL: request.signatureData.startsWith('data:image/')
    });
    
    // Para ver la imagen completa en desarrollo:
    console.log('🖼️ Complete signature data (Base64):', request.signatureData);
    
    // También puedes crear una imagen temporal para verificar:
    const img = new Image();
    img.onload = () => {
      console.log('✅ Signature image loaded successfully:', {
        width: img.width,
        height: img.height,
        naturalWidth: img.naturalWidth,
        naturalHeight: img.naturalHeight
      });
    };
    img.onerror = () => {
      console.error('❌ Failed to load signature image data');
    };
    img.src = request.signatureData;
    
    // Simular respuesta exitosa para desarrollo
    return Promise.resolve({
      success: true,
      message: 'Signature saved locally (backend not ready)',
      signatureId: `temp_${Date.now()}`,
      dataReceived: {
        fumigationId: request.fumigationId,
        cleanupId: request.cleanupId,
        signatureType: request.signatureType,
        imageFormat: request.signatureData.substring(0, 30),
        sizeInBytes: new Blob([request.signatureData]).size
      }
    });
    
    // TODO: Descomentar cuando el backend esté listo
    /*
    const response = await fetch('/api/signatures', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('authToken') || ''}`
      },
      body: JSON.stringify(request)
    });
    
    if (!response.ok) {
      throw new Error(`Error uploading signature: ${response.statusText}`);
    }
    
    return response.json();
    */
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

export const generateTestSignatureData = (): string => {
  const canvas = document.createElement('canvas');
  canvas.width = 600;
  canvas.height = 300;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = 'white';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.strokeStyle = 'black';
  ctx.lineWidth = 2;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

  ctx.beginPath();
  ctx.moveTo(50, 150);
  ctx.quadraticCurveTo(100, 100, 150, 150);
  ctx.quadraticCurveTo(200, 200, 250, 150);
  ctx.quadraticCurveTo(300, 100, 350, 150);
  ctx.quadraticCurveTo(400, 200, 450, 150);
  ctx.quadraticCurveTo(500, 100, 550, 150);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(80, 180);
  ctx.lineTo(120, 200);
  ctx.lineTo(160, 180);
  ctx.lineTo(200, 200);
  ctx.lineTo(240, 180);
  ctx.stroke();

  return canvas.toDataURL('image/jpeg', 0.7);
};

export const createTestSignatureRequest = (fumigationId?: number, cleanupId?: number): SignatureUploadRequest => {
  return {
    fumigationId: fumigationId || null,
    cleanupId: cleanupId || null,
    signatureType: 'technician',
    signatureData: generateTestSignatureData()
  };
};

export const downloadTestSignatureJSON = (fumigationId?: number, cleanupId?: number) => {
  const testRequest = createTestSignatureRequest(fumigationId, cleanupId);
  
  const jsonString = JSON.stringify(testRequest, null, 2);
  
  const blob = new Blob([jsonString], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = `test-signature-request-${Date.now()}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  URL.revokeObjectURL(url);
  
  console.log('Test signature request structure:', testRequest);
  console.log('Signature data preview (first 100 chars):', testRequest.signatureData.substring(0, 100) + '...');
  
  return testRequest;
};

export const previewTestSignature = (fumigationId?: number, cleanupId?: number) => {
  const testRequest = createTestSignatureRequest(fumigationId, cleanupId);
  
  const newWindow = window.open('', '_blank');
  if (newWindow) {
    newWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Test Signature Preview</title>
          <style>
            body { 
              font-family: Arial, sans-serif; 
              margin: 20px; 
              background-color: #f5f5f5;
            }
            .container { 
              max-width: 800px; 
              margin: 0 auto; 
              background: white; 
              padding: 20px; 
              border-radius: 8px; 
              box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            }
            .signature-preview { 
              border: 2px dashed #ccc; 
              padding: 20px; 
              text-align: center; 
              margin: 20px 0;
              background-color: #fafafa;
            }
            .signature-image { 
              max-width: 100%; 
              border: 1px solid #ddd; 
              background: white;
            }
            .json-preview { 
              background: #f8f8f8; 
              padding: 15px; 
              border-radius: 4px; 
              font-family: monospace; 
              font-size: 12px; 
              white-space: pre-wrap; 
              border: 1px solid #ddd;
              max-height: 300px;
              overflow-y: auto;
            }
            .metadata { 
              background: #e3f2fd; 
              padding: 15px; 
              border-radius: 4px; 
              margin: 10px 0;
            }
            h2 { color: #1976d2; }
            h3 { color: #424242; margin-top: 25px; }
          </style>
        </head>
        <body>
          <div class="container">
            <h2>🖊️ Test Signature Request Preview</h2>
            
            <div class="metadata">
              <strong>Request Metadata:</strong><br>
              • Fumigation ID: ${testRequest.fumigationId || 'null'}<br>
              • Cleanup ID: ${testRequest.cleanupId || 'null'}<br>
              • Signature Type: ${testRequest.signatureType}<br>
              • Generated: ${new Date().toLocaleString()}<br>
              • Data URL Length: ${testRequest.signatureData.length} characters
            </div>
            
            <h3>📸 Signature Image Preview</h3>
            <div class="signature-preview">
              <img src="${testRequest.signatureData}" alt="Test Signature" class="signature-image">
            </div>
            
            <h3>📄 JSON Request Structure</h3>
            <div class="json-preview">${JSON.stringify(testRequest, null, 2)}</div>
            
            <h3>💾 Download Options</h3>
            <button onclick="downloadJSON()" style="margin: 5px; padding: 10px 15px; background: #1976d2; color: white; border: none; border-radius: 4px; cursor: pointer;">
              Download JSON File
            </button>
            <button onclick="copyToClipboard()" style="margin: 5px; padding: 10px 15px; background: #388e3c; color: white; border: none; border-radius: 4px; cursor: pointer;">
              Copy JSON to Clipboard
            </button>
          </div>
          
          <script>
            const requestData = ${JSON.stringify(testRequest)};
            
            function downloadJSON() {
              const blob = new Blob([JSON.stringify(requestData, null, 2)], { type: 'application/json' });
              const url = URL.createObjectURL(blob);
              const link = document.createElement('a');
              link.href = url;
              link.download = 'test-signature-request-${Date.now()}.json';
              link.click();
              URL.revokeObjectURL(url);
            }
            
            function copyToClipboard() {
              navigator.clipboard.writeText(JSON.stringify(requestData, null, 2)).then(() => {
                alert('JSON copied to clipboard!');
              });
            }
          </script>
        </body>
      </html>
    `);
  }
  
  return testRequest;
};

export const logSignatureStructure = (fumigationId?: number, cleanupId?: number) => {
  const testRequest = createTestSignatureRequest(fumigationId, cleanupId);
  
  console.group('🖊️ Test Signature Request Structure');
  console.log('Full Request Object:', testRequest);
  console.log('Request Size:', JSON.stringify(testRequest).length, 'characters');
  console.log('Signature Data Type:', typeof testRequest.signatureData);
  console.log('Signature Data Format:', testRequest.signatureData.substring(0, 30) + '...');
  console.log('Image Dimensions: 600x300 pixels');
  console.log('Image Format: JPEG with 70% quality');
  console.groupEnd();
  
  return testRequest;
};