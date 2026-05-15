'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { QRCodeCanvas } from 'qrcode.react';
import { useState, useEffect, useRef } from 'react';

interface QRCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const QRCodeModal = ({ isOpen, onClose }: QRCodeModalProps) => {
  const [campaignUrl] = useState(() => 
    process.env.NEXT_PUBLIC_CAMPAIGN_URL || 'https://propertyjarrealty.com/campaign'
  );
  const qrRef = useRef<HTMLDivElement>(null);

  const downloadQRCode = () => {
    const canvas = qrRef.current?.querySelector('canvas');
    if (canvas) {
      const url = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = url;
      link.download = 'propertyjar-campaign-qr.png';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-charcoal/60 backdrop-blur-sm"
          />
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="relative bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl text-center"
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-gray-400 hover:text-charcoal transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            </button>

            <h3 className="text-2xl font-bold text-charcoal mb-2">Campaign QR</h3>
            <p className="text-gray-500 mb-8 text-sm">Scan or download this code to access our exclusive campaign.</p>
            
            <div ref={qrRef} className="bg-off-white p-6 rounded-2xl inline-block mb-8 shadow-inner">
              {campaignUrl && (
                <QRCodeCanvas
                  value={campaignUrl}
                  size={200}
                  level="H"
                  includeMargin={false}
                  imageSettings={{
                    src: "/favicon.ico",
                    x: undefined,
                    y: undefined,
                    height: 40,
                    width: 40,
                    excavate: true,
                  }}
                />
              )}
            </div>

            <div className="space-y-4">
              <button 
                onClick={downloadQRCode}
                className="w-full bg-brand text-white py-3 rounded-xl font-bold hover:bg-brand-hover transition-all shadow-lg active:scale-95 flex items-center justify-center gap-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                Download QR Image
              </button>
              
              <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-xl border border-gray-100 overflow-hidden">
                <span className="text-[10px] text-gray-400 truncate flex-1 text-left">{campaignUrl}</span>
                <button 
                  onClick={() => navigator.clipboard.writeText(campaignUrl)}
                  className="text-brand font-bold text-xs hover:text-brand-hover"
                >
                  Copy
                </button>
              </div>
              <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">PropertyJar Realty Digital Share</p>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default QRCodeModal;
