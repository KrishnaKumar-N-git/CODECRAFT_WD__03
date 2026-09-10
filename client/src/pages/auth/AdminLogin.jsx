import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import {
  ShieldCheck,
  Lock,
  Mail,
  ArrowLeft,
  Key,
  Eye,
  EyeOff,
  CheckCircle2,
  Sparkles
} from 'lucide-react';
import toast from 'react-hot-toast';

export const AdminLogin = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  // Mode: LOGIN | FORGOT_EMAIL | FORGOT_OTP | RESET_PASSWORD
  const [mode, setMode] = useState('LOGIN');

  // Login form state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // Password Recovery state
  const [recoveryEmail, setRecoveryEmail] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);

  // Handle Admin Login with Email & Password
  const handleAdminLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Please enter administrator credentials');
      return;
    }
    try {
      setLoading(true);
      await login({ email, password, isAdminLogin: true });
      toast.success('Super Admin Authenticated!');
      navigate('/admin-secret-access/dashboard', { replace: true });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Admin authentication failed');
    } finally {
      setLoading(false);
    }
  };

  // Step 1: Send OTP to Registered Admin Email
  const handleSendOTP = async (e) => {
    e.preventDefault();
    if (!recoveryEmail) {
      toast.error('Please enter your registered email address');
      return;
    }
    try {
      setLoading(true);
      const res = await api.post('/auth/forgot-password', { email: recoveryEmail });
      const receivedOtp = res.data.data?.otp;
      setGeneratedOtp(receivedOtp || '');
      toast.success(`Verification OTP code generated: ${receivedOtp}`, { duration: 8000 });
      setMode('FORGOT_OTP');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to send verification code');
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Verify OTP Code
  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    if (!otpCode || otpCode.length < 6) {
      toast.error('Please enter the 6-digit verification code');
      return;
    }
    try {
      setLoading(true);
      await api.post('/auth/verify-otp', { email: recoveryEmail, otp: otpCode });
      toast.success('OTP Verified! Enter your new password.');
      setMode('RESET_PASSWORD');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Invalid or expired OTP code');
    } finally {
      setLoading(false);
    }
  };

  // Step 3: Save New Password
  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (!newPassword || newPassword.length < 6) {
      toast.error('New password must be at least 6 characters long');
      return;
    }
    if (newPassword !== confirmNewPassword) {
      toast.error('Passwords do not match');
      return;
    }

    try {
      setLoading(true);
      await api.post('/auth/reset-password', {
        email: recoveryEmail,
        otp: otpCode,
        newPassword
      });
      toast.success('Password updated! You can now log in with your new password.', { duration: 5000 });
      setEmail(recoveryEmail);
      setPassword('');
      setMode('LOGIN');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to reset password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-6 bg-slate-900 p-8 rounded-3xl border border-purple-900/50 shadow-2xl text-white relative">
        {/* Header Logo */}
        <div className="text-center space-y-2">
          <div className="w-16 h-16 bg-purple-600 rounded-3xl flex items-center justify-center text-white mx-auto shadow-lg shadow-purple-600/40">
            <ShieldCheck className="w-9 h-9" />
          </div>
          <h2 className="text-2xl font-black tracking-tight">Super Admin Portal</h2>
          <p className="text-xs text-purple-200 font-medium">
            {mode === 'LOGIN' && 'Enter your Registered Admin Email & Password to Log In'}
            {mode === 'FORGOT_EMAIL' && 'Step 1 — Email Verification for Password Reset'}
            {mode === 'FORGOT_OTP' && 'Step 2 — 6-Digit OTP Code Verification'}
            {mode === 'RESET_PASSWORD' && 'Step 3 — Save New Password'}
          </p>
        </div>

        {/* 1. ADMIN LOGIN FORM */}
        {mode === 'LOGIN' && (
          <form className="space-y-4" onSubmit={handleAdminLogin}>
            <div>
              <label className="block text-xs font-bold text-gray-300 mb-1">Administrator Email *</label>
              <div className="relative">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter administrator email..."
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-10 pr-4 py-3 text-xs text-white focus:outline-none focus:ring-2 focus:ring-purple-500 font-medium"
                />
                <Mail className="w-4 h-4 text-purple-400 absolute left-3.5 top-3.5" />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-bold text-gray-300">Password *</label>
                <button
                  type="button"
                  onClick={() => {
                    setRecoveryEmail(email);
                    setMode('FORGOT_EMAIL');
                  }}
                  className="text-[11px] font-bold text-purple-400 hover:text-purple-300 transition-colors"
                >
                  Forgot Password?
                </button>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter administrator password..."
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-10 pr-10 py-3 text-xs text-white focus:outline-none focus:ring-2 focus:ring-purple-500 font-medium"
                />
                <Lock className="w-4 h-4 text-purple-400 absolute left-3.5 top-3.5" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-3.5 text-gray-400 hover:text-white"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-purple-600 hover:bg-purple-700 text-white rounded-2xl text-xs font-black uppercase tracking-wider transition-all shadow-xl shadow-purple-600/30 flex items-center justify-center space-x-2 disabled:opacity-50"
            >
              <Key className="w-4 h-4" />
              <span>{loading ? 'Authenticating...' : 'Log In to Admin Portal'}</span>
            </button>
          </form>
        )}

        {/* 2. STEP 1 — EMAIL VERIFICATION FOR FORGOT PASSWORD */}
        {mode === 'FORGOT_EMAIL' && (
          <form className="space-y-4" onSubmit={handleSendOTP}>
            <div className="bg-purple-950/60 p-3.5 rounded-2xl border border-purple-800/40 text-xs text-purple-200 leading-relaxed">
              <strong>Step 1 — Email Verification:</strong> Enter your registered Admin email address and click "Send Verification OTP".
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-300 mb-1">Registered Admin Email *</label>
              <div className="relative">
                <input
                  type="email"
                  required
                  value={recoveryEmail}
                  onChange={(e) => setRecoveryEmail(e.target.value)}
                  placeholder="Enter your registered Admin email..."
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-10 pr-4 py-3 text-xs text-white focus:outline-none focus:ring-2 focus:ring-purple-500 font-medium"
                />
                <Mail className="w-4 h-4 text-purple-400 absolute left-3.5 top-3.5" />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-purple-600 hover:bg-purple-700 text-white rounded-2xl text-xs font-black uppercase tracking-wider transition-all shadow-xl shadow-purple-600/30 flex items-center justify-center space-x-2 disabled:opacity-50"
            >
              <Sparkles className="w-4 h-4" />
              <span>{loading ? 'Sending OTP...' : 'Send Verification OTP'}</span>
            </button>

            <button
              type="button"
              onClick={() => setMode('LOGIN')}
              className="w-full text-center text-xs font-bold text-gray-400 hover:text-white pt-2 block"
            >
              Cancel & Back to Admin Login
            </button>
          </form>
        )}

        {/* 3. STEP 2 — 6-DIGIT OTP CODE VERIFICATION */}
        {mode === 'FORGOT_OTP' && (
          <form className="space-y-4" onSubmit={handleVerifyOTP}>
            <div className="bg-emerald-950/60 p-3.5 rounded-2xl border border-emerald-800/40 text-xs text-emerald-200 leading-relaxed space-y-1">
              <p className="font-bold">✓ Step 2 — OTP Code Verification</p>
              <p className="text-[11px] text-emerald-300">
                Enter the 6-digit verification code sent to <strong className="text-white">{recoveryEmail}</strong>.
              </p>
              {generatedOtp && (
                <div className="mt-2 pt-2 border-t border-emerald-800/50 flex items-center justify-between bg-black/40 px-3 py-1.5 rounded-xl font-mono">
                  <span className="text-[11px] text-gray-300">Received OTP Code:</span>
                  <button
                    type="button"
                    onClick={() => setOtpCode(generatedOtp)}
                    className="text-xs font-black text-amber-300 hover:underline"
                  >
                    {generatedOtp} (Click to Autofill)
                  </button>
                </div>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-300 mb-1">Enter 6-Digit Verification Code *</label>
              <div className="relative">
                <input
                  type="text"
                  required
                  maxLength={6}
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                  placeholder="e.g. 842910"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-center text-lg font-mono font-black tracking-widest text-amber-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-purple-600 hover:bg-purple-700 text-white rounded-2xl text-xs font-black uppercase tracking-wider transition-all shadow-xl shadow-purple-600/30 flex items-center justify-center space-x-2 disabled:opacity-50"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{loading ? 'Verifying OTP...' : 'Verify OTP Code'}</span>
            </button>

            <button
              type="button"
              onClick={() => setMode('FORGOT_EMAIL')}
              className="w-full text-center text-xs font-bold text-gray-400 hover:text-white pt-2 block"
            >
              Resend Code to Registered Email
            </button>
          </form>
        )}

        {/* 4. STEP 3 — SAVE NEW PASSWORD & LOGIN */}
        {mode === 'RESET_PASSWORD' && (
          <form className="space-y-4" onSubmit={handleResetPassword}>
            <div className="bg-purple-950/60 p-3.5 rounded-2xl border border-purple-800/40 text-xs text-purple-200">
              <strong>Step 3 — New Password:</strong> Enter your new password and click "Save New Password & Log In".
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-300 mb-1">New Password *</label>
              <div className="relative">
                <input
                  type={showNewPassword ? 'text' : 'password'}
                  required
                  minLength={6}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new password (Min 6 chars)..."
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-10 pr-10 py-3 text-xs text-white focus:outline-none focus:ring-2 focus:ring-purple-500 font-medium"
                />
                <Lock className="w-4 h-4 text-purple-400 absolute left-3.5 top-3.5" />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-3.5 top-3.5 text-gray-400 hover:text-white"
                >
                  {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-300 mb-1">Confirm New Password *</label>
              <div className="relative">
                <input
                  type="password"
                  required
                  minLength={6}
                  value={confirmNewPassword}
                  onChange={(e) => setConfirmNewPassword(e.target.value)}
                  placeholder="Re-type new password..."
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-10 pr-4 py-3 text-xs text-white focus:outline-none focus:ring-2 focus:ring-purple-500 font-medium"
                />
                <Lock className="w-4 h-4 text-purple-400 absolute left-3.5 top-3.5" />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl text-xs font-black uppercase tracking-wider transition-all shadow-xl shadow-emerald-600/30 flex items-center justify-center space-x-2 disabled:opacity-50"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{loading ? 'Saving Password...' : 'Save New Password & Log In'}</span>
            </button>
          </form>
        )}

        <div className="pt-4 border-t border-slate-800 text-center">
          <button
            type="button"
            onClick={() => navigate('/')}
            className="inline-flex items-center space-x-1.5 text-xs text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Storefront</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
