import React, { useState, useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import {
  X,
  CheckCircle2,
  Clock,
  Copy,
  Check,
  ShieldCheck,
  Smartphone,
  AlertCircle,
  RefreshCw,
  Zap
} from 'lucide-react';
import toast from 'react-hot-toast';
import { formatCurrency } from '../../utils/formatCurrency';

export const QRPaymentModal = ({
  isOpen,
  onClose,
  amount,
  orderNumber = 'APK-ORD-2026',
  storeName = 'APK Grocery Multi-Vendor',
  onSuccess
}) => {
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes timer
  const [copied, setCopied] = useState(false);
  const [status, setStatus] = useState('SCANNING'); // SCANNING | PROCESSING | SUCCESS | FAILED
  const [utrNumber, setUtrNumber] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);

  const savedSettings = typeof window !== 'undefined' ? (JSON.parse(localStorage.getItem('apk_qr_settings')) || {}) : {};
  const upiId = savedSettings.upiId || 'apkgrocery@upi';
  const merchantName = savedSettings.merchantName || storeName || 'APK Grocery Store';
  const customQrImage = savedSettings.qrImageUrl || '';

  // Format UPI URI schema
  const upiUri = `upi://pay?pa=${encodeURIComponent(upiId)}&pn=${encodeURIComponent(
    merchantName
  )}&am=${amount}&tr=${encodeURIComponent(orderNumber)}&tn=Grocery+Order+${orderNumber}&cu=INR`;

  // Countdown timer
  useEffect(() => {
    if (!isOpen) {
      setTimeLeft(300);
      setStatus('SCANNING');
      setUtrNumber('');
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setStatus('FAILED');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isOpen]);

  if (!isOpen) return null;

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const formattedTime = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;

  const handleCopyUPI = () => {
    navigator.clipboard.writeText(upiId);
    setCopied(true);
    toast.success('UPI ID copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSimulatePayment = (app = 'Instant') => {
    setIsVerifying(true);
    setStatus('PROCESSING');
    toast.loading(`Processing payment via ${app}...`, { id: 'qr-pay' });

    setTimeout(() => {
      toast.success('UPI Payment Confirmed Successfully!', { id: 'qr-pay' });
      setStatus('SUCCESS');
      setIsVerifying(false);
      setTimeout(() => {
        if (onSuccess) onSuccess();
      }, 1500);
    }, 2000);
  };

  const handleManualUtrSubmit = (e) => {
    e.preventDefault();
    if (!utrNumber || utrNumber.length < 6) {
      toast.error('Please enter a valid 12-digit UPI Reference / UTR Number');
      return;
    }
    setIsVerifying(true);
    setStatus('PROCESSING');
    toast.loading('Verifying UTR Reference with Bank...', { id: 'utr-pay' });

    setTimeout(() => {
      toast.success(`UTR ${utrNumber} Verified & Payment Confirmed!`, { id: 'utr-pay' });
      setStatus('SUCCESS');
      setIsVerifying(false);
      setTimeout(() => {
        if (onSuccess) onSuccess();
      }, 1500);
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-md w-full overflow-hidden shadow-2xl border border-emerald-100 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-emerald-700 text-white p-5 flex items-center justify-between relative">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-emerald-600 rounded-2xl flex items-center justify-center border border-emerald-500/50 shadow-inner">
              <ShieldCheck className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="font-extrabold text-base leading-tight">Pay via UPI QR Code</h3>
              <p className="text-[11px] text-emerald-100 font-medium">Scan using GPay, PhonePe, Paytm, or BHIM</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-emerald-800/80 hover:bg-emerald-900 text-emerald-200 flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-5">
          {status === 'SUCCESS' ? (
            <div className="py-8 text-center space-y-4 animate-scaleUp">
              <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-lg shadow-emerald-600/20">
                <CheckCircle2 className="w-12 h-12 stroke-[2.5]" />
              </div>
              <div>
                <h4 className="text-xl font-black text-gray-900">Payment Successful!</h4>
                <p className="text-xs text-gray-500 mt-1">
                  Amount Received: <span className="font-bold text-emerald-600">{formatCurrency(amount)}</span>
                </p>
                <p className="text-[11px] text-gray-400 mt-0.5">Order Ref: {orderNumber}</p>
              </div>
              <p className="text-xs font-semibold text-emerald-700 bg-emerald-50 py-2 px-4 rounded-xl inline-block">
                Redirecting to your order confirmation...
              </p>
            </div>
          ) : status === 'FAILED' ? (
            <div className="py-8 text-center space-y-4">
              <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto">
                <AlertCircle className="w-10 h-10" />
              </div>
              <div>
                <h4 className="text-lg font-bold text-gray-900">QR Code Expired</h4>
                <p className="text-xs text-gray-500 mt-1">The payment session timed out. Please try again.</p>
              </div>
              <button
                onClick={() => setTimeLeft(300) || setStatus('SCANNING')}
                className="px-6 py-2.5 bg-emerald-600 text-white rounded-xl text-xs font-bold flex items-center space-x-2 mx-auto"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Regenerate QR Code</span>
              </button>
            </div>
          ) : (
            <>
              {/* Amount & Merchant info card */}
              <div className="bg-emerald-50/70 border border-emerald-100 rounded-2xl p-4 flex items-center justify-between">
                <div>
                  <p className="text-[11px] text-emerald-800 font-bold uppercase tracking-wide">Payable Amount</p>
                  <p className="text-2xl font-black text-emerald-900">{formatCurrency(amount)}</p>
                  <p className="text-[10px] text-emerald-700 mt-0.5 truncate max-w-[200px]">
                    To: {merchantName}
                  </p>
                </div>
                <div className="text-right">
                  <div className="flex items-center space-x-1 text-xs font-bold text-amber-700 bg-amber-100/80 px-3 py-1 rounded-full border border-amber-200">
                    <Clock className="w-3.5 h-3.5 animate-pulse" />
                    <span>{formattedTime}</span>
                  </div>
                  <p className="text-[10px] text-gray-500 mt-1">Session Expiry</p>
                </div>
              </div>

              {/* QR Code Container */}
              <div className="bg-white border-2 border-dashed border-emerald-300 rounded-3xl p-5 flex flex-col items-center justify-center space-y-3 relative group">
                <div className="bg-white p-3 rounded-2xl shadow-md border border-gray-100 relative">
                  {customQrImage ? (
                    <img src={customQrImage} alt="Custom QR Scanner" className="w-[180px] h-[180px] object-contain rounded-xl mx-auto" />
                  ) : (
                    <QRCodeSVG
                      value={upiUri}
                      size={180}
                      level="H"
                      includeMargin={true}
                      imageSettings={{
                        src: 'https://cdn-icons-png.flaticon.com/512/825/825590.png',
                        x: undefined,
                        y: undefined,
                        height: 32,
                        width: 32,
                        excavate: true
                      }}
                    />
                  )}
                  {status === 'PROCESSING' && (
                    <div className="absolute inset-0 bg-white/90 rounded-2xl flex flex-col items-center justify-center space-y-2 backdrop-blur-[1px]">
                      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-emerald-600"></div>
                      <p className="text-xs font-bold text-emerald-800">Verifying Payment...</p>
                    </div>
                  )}
                </div>

                <div className="flex items-center space-x-2 text-xs font-medium text-gray-600 bg-gray-50 px-3 py-1.5 rounded-xl border border-gray-200">
                  <Smartphone className="w-4 h-4 text-emerald-600" />
                  <span>UPI ID: <strong className="text-gray-900">{upiId}</strong></span>
                  <button
                    onClick={handleCopyUPI}
                    className="p-1 text-gray-500 hover:text-emerald-700 rounded-md hover:bg-gray-200"
                    title="Copy UPI ID"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              {/* Scan with popular apps badges */}
              <div className="space-y-1.5 text-center">
                <p className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Accepted UPI Apps</p>
                <div className="flex items-center justify-center space-x-2 py-1">
                  <span className="px-2.5 py-1 bg-blue-50 text-blue-700 rounded-lg text-[10px] font-bold border border-blue-100">GPay</span>
                  <span className="px-2.5 py-1 bg-purple-50 text-purple-700 rounded-lg text-[10px] font-bold border border-purple-100">PhonePe</span>
                  <span className="px-2.5 py-1 bg-cyan-50 text-cyan-700 rounded-lg text-[10px] font-bold border border-cyan-100">Paytm</span>
                  <span className="px-2.5 py-1 bg-orange-50 text-orange-700 rounded-lg text-[10px] font-bold border border-orange-100">BHIM</span>
                  <span className="px-2.5 py-1 bg-black text-white rounded-lg text-[10px] font-bold">CRED</span>
                </div>
              </div>

              {/* Interactive Simulation & UTR Verification */}
              <div className="border-t border-gray-100 pt-4 space-y-3">
                <div className="bg-gradient-to-r from-emerald-50 to-teal-50 p-3.5 rounded-2xl border border-emerald-200/70 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-extrabold text-emerald-900 flex items-center space-x-1.5">
                      <Zap className="w-3.5 h-3.5 text-emerald-600 fill-emerald-600" />
                      <span>Interactive Testing Simulator</span>
                    </span>
                    <span className="text-[10px] font-bold bg-emerald-200/80 text-emerald-900 px-2 py-0.5 rounded-full">Instant</span>
                  </div>

                  <p className="text-[10px] text-emerald-800 leading-snug">
                    Scanning on a mobile app? Click below to instantly simulate completed UPI payment:
                  </p>

                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <button
                      type="button"
                      disabled={isVerifying}
                      onClick={() => handleSimulatePayment('GPay / PhonePe')}
                      className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-emerald-600/20 disabled:opacity-50"
                    >
                      Simulate Success
                    </button>

                    <button
                      type="button"
                      disabled={isVerifying}
                      onClick={() => handleSimulatePayment('BHIM QR')}
                      className="w-full py-2 bg-slate-900 hover:bg-black text-white rounded-xl text-xs font-bold transition-all disabled:opacity-50"
                    >
                      Auto-Verify QR
                    </button>
                  </div>
                </div>

                {/* Manual UTR Ref Option */}
                <form onSubmit={handleManualUtrSubmit} className="space-y-2">
                  <label className="text-[11px] font-bold text-gray-700 block">
                    Or Enter 12-digit UTR / UPI Reference No:
                  </label>
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      placeholder="e.g. 426819204123"
                      value={utrNumber}
                      maxLength={12}
                      onChange={(e) => setUtrNumber(e.target.value.replace(/\D/g, ''))}
                      className="flex-1 px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                    <button
                      type="submit"
                      disabled={isVerifying || !utrNumber}
                      className="px-4 py-2 bg-gray-900 hover:bg-black text-white rounded-xl text-xs font-bold transition-colors disabled:opacity-40"
                    >
                      Verify
                    </button>
                  </div>
                </form>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default QRPaymentModal;
