import { FC, useRef, useEffect, useImperativeHandle, forwardRef } from "react";

declare global {
  interface Window {
    SignaturePad: any;
  }
}

interface SignaturePadProps {
  width?: number;
  height?: number;
  backgroundColor?: string;
  penColor?: string;
  onBegin?: () => void;
  onEnd?: () => void;
}

export interface SignaturePadRef {
  clear: () => void;
  toDataURL: (type?: string, quality?: number) => string;
  fromDataURL: (dataURL: string) => void;
  isEmpty: () => boolean;
}

export const SignaturePad = forwardRef<SignaturePadRef, SignaturePadProps>(({
  width = 600,
  height = 300,
  backgroundColor = "rgba(255,255,255,0)",
  penColor = "black",
  onBegin,
  onEnd
}, ref) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const signaturePadRef = useRef<any>(null);

  useEffect(() => {
    const loadSignaturePad = async () => {
      if (!window.SignaturePad) {
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/signature_pad@4.1.7/dist/signature_pad.umd.min.js';
        script.onload = initSignaturePad;
        document.head.appendChild(script);
      } else {
        initSignaturePad();
      }
    };

    const initSignaturePad = () => {
      if (canvasRef.current && window.SignaturePad) {
        const canvas = canvasRef.current;
        const ratio = Math.max(window.devicePixelRatio || 1, 1);
        
        canvas.width = width * ratio;
        canvas.height = height * ratio;
        canvas.style.width = `${width}px`;
        canvas.style.height = `${height}px`;
        canvas.getContext("2d")?.scale(ratio, ratio);

        signaturePadRef.current = new window.SignaturePad(canvas, {
          backgroundColor,
          penColor,
          minWidth: 0.5,
          maxWidth: 2.5,
        });

        if (onBegin) {
          signaturePadRef.current.addEventListener('beginStroke', onBegin);
        }
        if (onEnd) {
          signaturePadRef.current.addEventListener('endStroke', onEnd);
        }
      }
    };

    loadSignaturePad();

    return () => {
      if (signaturePadRef.current) {
        signaturePadRef.current.off();
      }
    };
  }, [width, height, backgroundColor, penColor, onBegin, onEnd]);

  useImperativeHandle(ref, () => ({
    clear: () => signaturePadRef.current?.clear(),
    toDataURL: (type = "image/png", quality = 1) => signaturePadRef.current?.toDataURL(type, quality) || "",
    fromDataURL: (dataURL: string) => signaturePadRef.current?.fromDataURL(dataURL),
    isEmpty: () => signaturePadRef.current?.isEmpty() || true,
  }));

  return (
    <canvas
      ref={canvasRef}
      className="border border-gray-300 rounded-md cursor-crosshair"
    />
  );
});

SignaturePad.displayName = "SignaturePad";