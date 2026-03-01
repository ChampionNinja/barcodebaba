import { type ChangeEvent, useEffect, useRef, useState } from "react";
import {
  Html5Qrcode,
  Html5QrcodeScanner,
  Html5QrcodeScanType,
  type Html5QrcodeResult,
} from "html5-qrcode";
import { AlertCircle } from "lucide-react";

interface ScannerProps {
  onScan: (barcode: string) => void;
  isElderlyMode?: boolean;
  isBabyMode?: boolean;
}

export function Scanner({ onScan, isElderlyMode, isBabyMode }: ScannerProps) {
  const scannerRef = useRef<Html5QrcodeScanner | null>(null);
  const html5QrCodeRef = useRef<Html5Qrcode | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const scanner = new Html5QrcodeScanner(
      "reader",
      {
        fps: 10,
        qrbox: { width: 250, height: 150 },
        supportedScanTypes: [
          Html5QrcodeScanType.SCAN_TYPE_CAMERA,
        ],
        rememberLastUsedCamera: false,
        videoConstraints: {
          facingMode: "environment",
        },
      },
      false,
    );

    scannerRef.current = scanner;

    scanner.render(
      (decodedText) => {
        setFileError(null);
        scanner.pause(true);
        onScan(decodedText);
      },
      (errorMessage) => {
        if (!isMounted) return;

        const cameraStartupError =
          errorMessage.includes("NotReadableError") ||
          errorMessage.includes("NotAllowedError") ||
          errorMessage.includes("Permission") ||
          errorMessage.includes("Could not start video source");

        if (cameraStartupError) {
          setCameraError(
            "Unable to access camera. Close apps using the camera, allow browser camera permission, or enter barcode manually.",
          );
        }
      },
    );

    return () => {
      isMounted = false;
      scanner.clear().catch(() => {
        // Ignore cleanup errors when scanner is already stopped.
      });
    };
  }, [onScan]);

  useEffect(() => {
    html5QrCodeRef.current = new Html5Qrcode("file-reader");

    return () => {
      Promise.resolve(html5QrCodeRef.current?.clear()).catch(() => {
        // Ignore cleanup errors when scanner is already stopped.
      });
      html5QrCodeRef.current = null;
    };
  }, []);

  const handleFileScan = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !html5QrCodeRef.current) return;

    try {
      setFileError(null);
      const result = (await html5QrCodeRef.current.scanFile(file, true)) as
        | string
        | Html5QrcodeResult;
      const decodedText = typeof result === "string" ? result : result.decodedText;
      onScan(decodedText);
    } catch {
      setFileError("Barcode not detected in image");
    } finally {
      event.target.value = "";
    }
  };

  return (
    <div className="w-full flex flex-col items-center">
      <div
        id="reader"
        className={`w-full max-w-md rounded-2xl overflow-hidden shadow-lg border ${
          isBabyMode ? "bg-pink-50 border-pink-200 shadow-pink-200/40" : "bg-muted border-border"
        }`}
      ></div>

      <div className="mt-4 w-full max-w-md text-center">
        <label
          htmlFor="gallery-scan-input"
          className="inline-block cursor-pointer text-2xl font-medium underline underline-offset-4 transition-opacity hover:opacity-80"
        >
          Scan an Image File
        </label>
        <input id="gallery-scan-input" type="file" accept="image/*" onChange={handleFileScan} className="hidden" />
      </div>

      <div id="file-reader" className="hidden" />

      {cameraError && (
        <div className="mt-4 w-full max-w-md rounded-xl border border-red-300 bg-red-50 p-4 text-red-800 font-medium">
          {cameraError}
        </div>
      )}

      {fileError && (
        <div className="mt-4 w-full max-w-md rounded-xl border border-red-300 bg-red-50 p-4 text-red-800 font-medium">
          {fileError}
        </div>
      )}

      {isElderlyMode && (
        <div className="mt-6 flex items-start gap-3 bg-yellow-100 border-4 border-black p-4 rounded-xl text-black font-bold text-lg w-full max-w-md">
          <AlertCircle className="w-8 h-8 flex-shrink-0" />
          <p>Hold the product barcode clearly in front of the camera.</p>
        </div>
      )}

      {isBabyMode && (
        <div className="mt-6 flex items-start gap-3 bg-pink-100 border-2 border-pink-200 p-4 rounded-xl text-violet-900 font-semibold w-full max-w-md">
          <AlertCircle className="w-6 h-6 flex-shrink-0 text-pink-500" />
          <p>Hold the package still for a clear scan.</p>
        </div>
      )}
    </div>
  );
}
