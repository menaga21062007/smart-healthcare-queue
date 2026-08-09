import React, { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { QrCode, Scan, CheckCircle2, X } from 'lucide-react';

interface QRScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  ticketNumber?: string;
  onScanComplete?: (ticketNumber: string) => void;
  mode?: 'GENERATE' | 'SCAN';
}

export const QRScannerModal: React.FC<QRScannerModalProps> = ({
  isOpen,
  onClose,
  ticketNumber = 'E-001',
  onScanComplete,
  mode = 'GENERATE'
}) => {
  const [scanInput, setScanInput] = useState('');
  const [scannedSuccess, setScannedSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSimulatedScan = () => {
    if (!scanInput.trim()) return;
    setScannedSuccess(true);
    setTimeout(() => {
      if (onScanComplete) onScanComplete(scanInput.trim());
      setScannedSuccess(false);
      setScanInput('');
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-sm w-full p-6 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {mode === 'GENERATE' ? (
          <div className="text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300 text-xs font-semibold mb-3">
              <QrCode className="w-3.5 h-3.5" />
              <span>Digital Check-In QR Pass</span>
            </div>
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">Ticket #{ticketNumber}</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-5">
              Show this QR code at the Reception or Kiosk for fast check-in.
            </p>

            <div className="bg-white p-4 rounded-xl border border-slate-200 inline-block shadow-sm">
              <QRCodeSVG
                value={JSON.stringify({ ticketNumber, hospital: 'CareQueue Hospital System' })}
                size={180}
                level="H"
                includeMargin={true}
              />
            </div>

            <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-4">
              Encrypted pass • Verified automatically upon arrival
            </p>
          </div>
        ) : (
          <div className="text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 text-xs font-semibold mb-3">
              <Scan className="w-3.5 h-3.5" />
              <span>Reception QR Check-In Scanner</span>
            </div>

            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-4">Scan Patient QR Code</h3>

            {scannedSuccess ? (
              <div className="py-8 flex flex-col items-center justify-center text-emerald-600 dark:text-emerald-400 animate-scaleUp">
                <CheckCircle2 className="w-16 h-16 mb-2 animate-bounce" />
                <p className="font-bold">Check-In Verified!</p>
                <p className="text-xs text-slate-500">Ticket {scanInput}</p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="relative w-48 h-48 mx-auto border-2 border-dashed border-blue-500/60 rounded-xl overflow-hidden flex items-center justify-center bg-slate-950">
                  <div className="absolute inset-0 bg-blue-500/10 animate-pulse" />
                  <div className="w-full h-0.5 bg-blue-500 animate-bounce shadow-lg shadow-blue-500" />
                  <Scan className="w-12 h-12 text-blue-400/40" />
                </div>

                <div className="text-left space-y-2">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Simulate Scanner Input (Ticket #):
                  </label>
                  <input
                    type="text"
                    value={scanInput}
                    onChange={(e) => setScanInput(e.target.value)}
                    placeholder="e.g. E-001 or U-002"
                    className="w-full px-3 py-2 text-sm bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    onClick={handleSimulatedScan}
                    className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition-all shadow-md shadow-blue-500/20"
                  >
                    Confirm Check-In
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
