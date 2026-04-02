'use client';

import { useEffect, useMemo, useState } from 'react';
import { Html5Qrcode } from 'html5-qrcode';

interface BarcodeScannerProps {
  onDetected: (barcode: string) => void;
}

export function BarcodeScanner({ onDetected }: BarcodeScannerProps) {
  const [status, setStatus] = useState('Requesting camera access...');
  const scannerId = useMemo(() => `barcode-reader-${Math.random().toString(36).slice(2)}`, []);

  useEffect(() => {
    let scanner: Html5Qrcode | null = null;
    let active = true;

    const start = async () => {
      try {
        scanner = new Html5Qrcode(scannerId);
        await scanner.start(
          { facingMode: 'environment' },
          {
            fps: 10,
            qrbox: { width: 260, height: 140 },
          },
          async (decodedText) => {
            if (!active || !scanner) return;
            setStatus(`Detected: ${decodedText}`);
            onDetected(decodedText);
            await scanner.stop();
          },
          () => {
            // Ignore decode miss noise.
          },
        );

        setStatus('Camera ready. Scan the barcode.');
      } catch {
        setStatus('Camera permission denied or unavailable. Use manual input.');
      }
    };

    void start();

    return () => {
      active = false;
      if (scanner && scanner.isScanning) {
        void scanner.stop().then(() => scanner?.clear());
      } else {
        scanner?.clear();
      }
    };
  }, [onDetected, scannerId]);

  return (
    <div className="space-y-3">
      <div id={scannerId} className="overflow-hidden rounded-2xl border border-slate-200" />
      <p className="text-sm text-slate-600">{status}</p>
    </div>
  );
}
