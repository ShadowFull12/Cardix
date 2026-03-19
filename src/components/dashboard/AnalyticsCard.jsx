"use client";

import { GlassCard } from "@/components/ui/GlassCard";

export function AnalyticsCard({ title, value, icon, trend, delay = 0 }) {
  return (
    <GlassCard delay={delay} className="flex flex-col justify-between relative overflow-hidden group">
      {/* Background Gradient Effect */}
      <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 rounded-full bg-white/5 blur-2xl group-hover:bg-white/10 transition-colors duration-500" />
      
      <div className="flex items-center justify-between mb-4 relative z-10">
        <div className="p-3 bg-white/5 rounded-xl border border-white/10">
          {icon}
        </div>
        <span className="text-xs font-medium text-zinc-500 bg-black/20 px-2.5 py-1 rounded-full border border-white/5">
          {trend}
        </span>
      </div>
      
      <div className="relative z-10">
        <h4 className="text-4xl font-bold font-mono tracking-tighter text-white mb-1">
          {value.toLocaleString()}
        </h4>
        <p className="text-sm font-medium text-zinc-400">{title}</p>
      </div>
    </GlassCard>
  );
}
