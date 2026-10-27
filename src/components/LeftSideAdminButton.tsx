import React from 'react';
import { Lock, ShieldCheck, Sparkles } from 'lucide-react';

interface LeftSideAdminButtonProps {
  isOwnerLoggedIn: boolean;
  onOpenDashboard: () => void;
  onOpenOwnerLogin: () => void;
}

export const LeftSideAdminButton: React.FC<LeftSideAdminButtonProps> = ({
  isOwnerLoggedIn,
  onOpenDashboard,
  onOpenOwnerLogin,
}) => {
  return (
    <div className="fixed left-3 sm:left-5 bottom-6 z-40 select-none animate-in fade-in slide-in-from-left duration-500">
      <button
        onClick={isOwnerLoggedIn ? onOpenDashboard : onOpenOwnerLogin}
        className="group relative flex items-center gap-2.5 px-3.5 py-2.5 sm:px-4 sm:py-3 rounded-2xl bg-[#14110E]/95 hover:bg-[#1C1814] text-white border border-amber-500/40 hover:border-amber-400 shadow-2xl shadow-black/90 backdrop-blur-xl transition-all duration-300 hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-amber-400/50"
        title={isOwnerLoggedIn ? 'Open Owner Admin Dashboard' : 'Admin Login (cafe47516@gmail.com)'}
        aria-label="Admin Portal"
      >
        {/* Subtle animated aura */}
        <span className="absolute -inset-0.5 rounded-2xl bg-gradient-to-r from-orange-500/30 to-amber-500/30 blur-sm opacity-60 group-hover:opacity-100 transition duration-300 -z-10" />

        {/* Icon */}
        <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center text-black font-extrabold shadow-md shadow-orange-500/20 group-hover:rotate-6 transition-transform">
          {isOwnerLoggedIn ? (
            <ShieldCheck className="w-4 h-4 text-black stroke-[2.5]" />
          ) : (
            <Lock className="w-3.5 h-3.5 text-black stroke-[2.5]" />
          )}
        </div>

        {/* Label Text */}
        <div className="flex flex-col text-left">
          <span className="text-[11px] sm:text-xs font-black tracking-wider text-white uppercase flex items-center gap-1.5">
            {isOwnerLoggedIn ? 'Admin Panel' : 'Admin Login'}
            <span
              className={`w-2 h-2 rounded-full ${
                isOwnerLoggedIn ? 'bg-green-400 animate-pulse' : 'bg-amber-400'
              }`}
            />
          </span>
          <span className="text-[9px] sm:text-[10px] text-amber-400/80 font-medium -mt-0.5 hidden xs:inline">
            {isOwnerLoggedIn ? 'Active Mode' : 'Owner Access'}
          </span>
        </div>

        <Sparkles className="w-3 h-3 text-amber-400 opacity-60 group-hover:opacity-100 transition-opacity ml-0.5 hidden sm:block" />
      </button>
    </div>
  );
};
