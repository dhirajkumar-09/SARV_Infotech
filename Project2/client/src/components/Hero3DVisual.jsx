import React, { useState } from 'react';
import { ShieldCheck, Star, Sparkles, Zap, ShoppingBag } from 'lucide-react';

const Hero3DVisual = () => {
  const [coords, setCoords] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 20;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * -20;
    setCoords({ x, y });
  };

  const handleMouseLeave = () => {
    setCoords({ x: 0, y: 0 });
  };

  return (
    <div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative w-full max-w-lg mx-auto aspect-square flex items-center justify-center select-none"
      style={{ perspective: '1200px' }}
    >
      {/* Ambient Pulsating Glows in Background */}
      <div className="absolute w-72 h-72 rounded-full bg-indigo-500/30 blur-3xl animate-pulse-glow pointer-events-none" />
      <div className="absolute w-60 h-60 rounded-full bg-purple-500/25 blur-2xl -top-6 -right-6 animate-pulse pointer-events-none" />

      {/* 3D Floating Stage */}
      <div
        className="relative w-72 sm:w-80 h-96 sm:h-[420px] transition-transform duration-200 ease-out"
        style={{
          transformStyle: 'preserve-3d',
          transform: `rotateY(${coords.x + 12}deg) rotateX(${coords.y - 8}deg)`,
        }}
      >
        {/* Main 3D Card: Featured Luxury Headphones */}
        <div
          className="absolute inset-0 rounded-3xl bg-gradient-to-b from-white/20 to-white/5 dark:from-slate-800/80 dark:to-slate-900/80 backdrop-blur-xl border border-white/30 dark:border-slate-700/60 p-6 shadow-2xl shadow-indigo-950/40 flex flex-col justify-between overflow-hidden"
          style={{ transform: 'translateZ(0px)' }}
        >
          {/* Subtle Grid Overlay */}
          <div className="absolute inset-0 bg-[radial-gradient(#ffffff20_1px,transparent_1px)] [background-size:12px_12px] opacity-40 pointer-events-none" />

          {/* Top Row */}
          <div className="flex items-center justify-between relative z-10">
            <span className="px-3 py-1 rounded-full bg-indigo-600/90 text-white text-[11px] font-bold uppercase tracking-wider shadow-md">
              Featured 3D
            </span>
            <div className="flex items-center gap-1 text-amber-300 bg-black/30 backdrop-blur-md px-2.5 py-1 rounded-full text-xs font-bold">
              <Star className="w-3.5 h-3.5 fill-amber-300" />
              <span>4.9</span>
            </div>
          </div>

          {/* Floating Product Image with Depth */}
          <div
            className="relative my-auto flex items-center justify-center py-4"
            style={{ transform: 'translateZ(40px)' }}
          >
            <div className="relative group">
              <img
                src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80"
                alt="Sony Headphones"
                className="w-48 h-48 sm:w-52 sm:h-52 object-contain drop-shadow-[0_20px_25px_rgba(0,0,0,0.4)] animate-float"
              />
              <div className="absolute -bottom-2 inset-x-4 h-6 bg-indigo-900/40 rounded-full blur-md" />
            </div>
          </div>

          {/* Bottom Info */}
          <div className="relative z-10 space-y-1 bg-black/20 dark:bg-black/40 backdrop-blur-md p-3.5 rounded-2xl border border-white/10">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-extrabold text-white">Sony WH-1000XM5</h4>
              <span className="text-sm font-black text-indigo-300">$398.00</span>
            </div>
            <p className="text-[11px] text-indigo-100/70">Hi-Res Noise Cancelling Pro</p>
          </div>
        </div>

        {/* Floating Orb / Badge 1: 3D Express Delivery (Top-Left) */}
        <div
          className="absolute -top-6 -left-8 sm:-left-12 px-4 py-2.5 rounded-2xl bg-white/90 dark:bg-slate-800/90 backdrop-blur-md border border-white/40 dark:border-slate-700 shadow-xl flex items-center gap-2.5 animate-float"
          style={{ transform: 'translateZ(80px)' }}
        >
          <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-md">
            <Zap className="w-4 h-4 text-amber-300" />
          </div>
          <div>
            <p className="text-[10px] uppercase font-bold text-gray-400 dark:text-gray-400">Express</p>
            <p className="text-xs font-extrabold text-gray-900 dark:text-white">Free Next-Day</p>
          </div>
        </div>

        {/* Floating Orb / Badge 2: 3D Secured Badge (Bottom-Right) */}
        <div
          className="absolute -bottom-6 -right-6 sm:-right-10 px-4 py-2.5 rounded-2xl bg-white/90 dark:bg-slate-800/90 backdrop-blur-md border border-white/40 dark:border-slate-700 shadow-xl flex items-center gap-2.5 animate-float-delayed"
          style={{ transform: 'translateZ(100px)' }}
        >
          <div className="w-8 h-8 rounded-xl bg-emerald-500 text-white flex items-center justify-center shadow-md">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div>
            <p className="text-[10px] uppercase font-bold text-gray-400 dark:text-gray-400">Security</p>
            <p className="text-xs font-extrabold text-gray-900 dark:text-white">256-Bit Stripe</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero3DVisual;
