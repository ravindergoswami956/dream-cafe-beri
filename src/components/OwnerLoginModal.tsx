import React, { useState } from 'react';
import {
  X,
  Lock,
  Mail,
  KeyRound,
  ShieldAlert,
  CheckCircle,
  Sparkles,
  RefreshCw,
  Eye,
  EyeOff,
} from 'lucide-react';
import { loginOwnerWithPassword } from '../lib/supabase';
import type { OwnerSession } from '../lib/supabase';

interface OwnerLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthenticated: (session: OwnerSession) => void;
}

export const OwnerLoginModal: React.FC<OwnerLoginModalProps> = ({
  isOpen,
  onClose,
  onAuthenticated,
}) => {
  const [email, setEmail] = useState('cafe47516@gmail.com');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handlePasswordLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password || loading) return;

    setLoading(true);
    setErrorMessage(null);
    setStatusMessage(null);

    const res = await loginOwnerWithPassword(email, password);
    setLoading(false);

    if (res.success && res.session) {
      setStatusMessage('Authentication successful! Opening dashboard...');
      setTimeout(() => {
        onAuthenticated(res.session!);
        onClose();
      }, 350);
    } else {
      setErrorMessage(res.error || 'Incorrect owner password. Please try again.');
    }
  };

  return (
    <div
      id="owner-login-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-md bg-[#14110E] border border-amber-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-black overflow-hidden max-h-[92vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Ambient Top Glow */}
        <div className="absolute -top-12 -left-12 w-32 h-32 bg-amber-500/20 rounded-full blur-2xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Close owner portal"
          className="absolute top-5 right-5 p-1.5 rounded-full bg-white/5 text-neutral-400 hover:text-white hover:bg-white/10 transition"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-black font-bold shadow-lg shadow-orange-500/20 shrink-0">
            <Lock className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              Owner Portal
              <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/30">
                Staff Only
              </span>
            </h3>
            <p className="text-xs text-neutral-400">
              Admin content & menu management sign in
            </p>
          </div>
        </div>

        {/* Error Notification */}
        {errorMessage && (
          <div className="mb-5 p-3.5 rounded-2xl bg-red-950/70 border border-red-500/50 text-red-200 text-xs flex items-start gap-2.5 animate-in fade-in">
            <ShieldAlert className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
            <div className="leading-snug">{errorMessage}</div>
          </div>
        )}

        {/* Success Notification */}
        {statusMessage && (
          <div className="mb-5 p-3.5 rounded-2xl bg-amber-950/60 border border-amber-500/50 text-amber-200 text-xs flex items-start gap-2.5 animate-in fade-in">
            <CheckCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <div className="leading-snug">{statusMessage}</div>
          </div>
        )}

        {/* Password Login Form */}
        <form onSubmit={handlePasswordLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-1.5">
              Authorized Owner Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="cafe47516@gmail.com"
                className="w-full pl-10 pr-4 py-3 rounded-2xl bg-black/40 border border-white/10 text-white placeholder-neutral-500 text-sm focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-1.5">
              Admin Password
            </label>
            <div className="relative">
              <KeyRound className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                autoFocus
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter owner password"
                className="w-full pl-10 pr-12 py-3 rounded-2xl bg-black/40 border border-white/10 text-white placeholder-neutral-500 text-sm focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 text-neutral-400 hover:text-white transition"
                title={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <p className="text-[11px] text-neutral-400 leading-relaxed pt-1">
            🔐 <strong>Instant Access:</strong> Direct password authentication active for registered owner administrators. No email verification code required.
          </p>

          <button
            type="submit"
            disabled={loading || !password}
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 text-black font-extrabold text-xs uppercase tracking-wider shadow-lg hover:brightness-110 active:scale-95 transition flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Verifying Password...</span>
              </>
            ) : (
              <>
                <span>Enter Admin Dashboard</span>
                <Sparkles className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Footer info */}
        <div className="mt-5 pt-4 border-t border-white/5 flex items-center justify-between text-[10px] text-neutral-400">
          <span>Target Admin: {email}</span>
          <span className="text-amber-400/80">Direct Password Mode Active</span>
        </div>
      </div>
    </div>
  );
};
