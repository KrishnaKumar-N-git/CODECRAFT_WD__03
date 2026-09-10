import React, { useState, useEffect } from 'react';
import { QrCode, Save, ShieldCheck, Image as ImageIcon } from 'lucide-react';
import toast from 'react-hot-toast';
import { QRCodeSVG } from 'qrcode.react';

export const QRPaymentSettings = () => {
  const [upiId, setUpiId] = useState('apkgrocery@upi');
  const [merchantName, setMerchantName] = useState('APK Grocery Store');
  const [qrImageUrl, setQrImageUrl] = useState('');
  const [sessionTimeoutMinutes, setSessionTimeoutMinutes] = useState(5);
  const [enableSimulatedPayments, setEnableSimulatedPayments] = useState(true);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('apk_qr_settings')) || {};
    if (saved.upiId) setUpiId(saved.upiId);
    if (saved.merchantName) setMerchantName(saved.merchantName);
    if (saved.qrImageUrl) setQrImageUrl(saved.qrImageUrl);
    if (saved.sessionTimeoutMinutes) setSessionTimeoutMinutes(saved.sessionTimeoutMinutes);
    if (saved.enableSimulatedPayments !== undefined) setEnableSimulatedPayments(saved.enableSimulatedPayments);
  }, []);

  const handleSave = (e) => {
    e.preventDefault();
    const payload = {
      upiId,
      merchantName,
      qrImageUrl,
      sessionTimeoutMinutes,
      enableSimulatedPayments
    };
    localStorage.setItem('apk_qr_settings', JSON.stringify(payload));
    toast.success('Online UPI QR Payment Settings Saved & Updated Live!');
  };

  const previewUri = `upi://pay?pa=${encodeURIComponent(upiId)}&pn=${encodeURIComponent(
    merchantName
  )}&am=499&tr=APK-DEMO-PREVIEW&cu=INR`;

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
        <h1 className="text-2xl font-black text-gray-900 tracking-tight flex items-center gap-2">
          <QrCode className="w-7 h-7 text-purple-600" />
          <span>UPI QR Code Payment Gateway Settings</span>
        </h1>
        <p className="text-xs text-gray-500 mt-0.5">
          Edit UPI ID, merchant name, and custom QR scanner images directly for live customer checkout scanning
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left: Configuration Form */}
        <form onSubmit={handleSave} className="md:col-span-2 bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-5">
          <h3 className="text-sm font-extrabold text-gray-900 border-b border-gray-100 pb-3">Editable Gateway Parameters</h3>

          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-700">Primary VPA / UPI ID *</label>
            <input
              type="text"
              required
              value={upiId}
              onChange={(e) => setUpiId(e.target.value)}
              placeholder="e.g. apkgrocery@upi"
              className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-xs font-mono font-bold text-gray-900 focus:ring-2 focus:ring-purple-500 focus:outline-none"
            />
            <p className="text-[10px] text-gray-400">All customer payments will be routed directly to this UPI address.</p>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-700">Merchant Business Name *</label>
            <input
              type="text"
              required
              value={merchantName}
              onChange={(e) => setMerchantName(e.target.value)}
              placeholder="e.g. APK Super Kirana"
              className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold text-gray-900 focus:ring-2 focus:ring-purple-500 focus:outline-none"
            />
            <p className="text-[10px] text-gray-400">Shown in customer's GPay, PhonePe, or BHIM app after scanning.</p>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-700">Custom Static QR Image URL (Optional)</label>
            <div className="relative">
              <input
                type="url"
                value={qrImageUrl}
                onChange={(e) => setQrImageUrl(e.target.value)}
                placeholder="https://example.com/my-shop-qr-code.png"
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold text-gray-900 pl-10 focus:ring-2 focus:ring-purple-500 focus:outline-none"
              />
              <ImageIcon className="w-4 h-4 text-gray-400 absolute left-3 top-3.5" />
            </div>
            <p className="text-[10px] text-gray-400">Leave blank to use automatically generated dynamic UPI QR Code.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-700">QR Expiry Timer (Minutes)</label>
              <input
                type="number"
                min="1"
                max="30"
                value={sessionTimeoutMinutes}
                onChange={(e) => setSessionTimeoutMinutes(Number(e.target.value))}
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold text-gray-900 focus:ring-2 focus:ring-purple-500 focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-700">Testing Simulator</label>
              <div className="flex items-center space-x-2 pt-2">
                <input
                  type="checkbox"
                  id="simCheck"
                  checked={enableSimulatedPayments}
                  onChange={(e) => setEnableSimulatedPayments(e.target.checked)}
                  className="w-4 h-4 text-purple-600 rounded"
                />
                <label htmlFor="simCheck" className="text-xs font-semibold text-gray-800">
                  Allow Instant Payment Simulation
                </label>
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-4 bg-purple-600 hover:bg-purple-700 text-white rounded-2xl text-xs font-black uppercase tracking-wider transition-all shadow-xl shadow-purple-600/30 flex items-center justify-center space-x-2"
          >
            <Save className="w-4 h-4" />
            <span>Save & Apply QR Settings Live</span>
          </button>
        </form>

        {/* Right: Live Preview Box */}
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-4 text-center flex flex-col items-center justify-center">
          <h3 className="text-xs font-extrabold uppercase tracking-wider text-gray-400">Live QR Preview</h3>
          <div className="p-4 bg-gray-50 rounded-2xl border border-dashed border-purple-200 inline-block">
            {qrImageUrl ? (
              <img src={qrImageUrl} alt="Custom QR" className="w-36 h-36 object-contain mx-auto" />
            ) : (
              <QRCodeSVG value={previewUri} size={150} level="H" includeMargin={true} />
            )}
          </div>
          <div className="text-xs space-y-0.5">
            <p className="font-extrabold text-gray-900">{merchantName}</p>
            <p className="text-[10px] font-mono text-purple-700 font-bold">{upiId}</p>
            <p className="text-[10px] text-gray-400 mt-1">Sample Amount: ₹499</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QRPaymentSettings;
