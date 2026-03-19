"use client";

import { GlassCard } from "@/components/ui/GlassCard";
import { useAuth } from "@/contexts/AuthContext";
import { FiActivity, FiPieChart, FiBarChart2, FiLock, FiStar, FiArrowRight } from "react-icons/fi";
import Link from "next/link";
import { motion } from "framer-motion";

export default function AnalyticsPage() {
  const { user } = useAuth();
  const isPro = user?.plan === "pro" || user?.plan === "business";

  // Paywall overlay for free users
  if (!isPro) {
    return (
      <div className="max-w-5xl mx-auto space-y-8 relative">
        <div>
          <h1 className="text-3xl font-bold font-mono tracking-tight text-white mb-2">Detailed Analytics</h1>
          <p className="text-zinc-400">In-depth insights into your profile performance.</p>
        </div>

        {/* Blurred preview */}
        <div className="relative">
          <div className="filter blur-[6px] opacity-50 pointer-events-none select-none">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <GlassCard className="h-64 flex flex-col items-center justify-center text-center">
                <FiPieChart className="text-4xl text-blue-400 mb-4" />
                <h3 className="font-semibold text-lg mb-2">Audience Demographics</h3>
                <p className="text-sm text-zinc-500">Age, location, and device breakdown</p>
              </GlassCard>
              <GlassCard className="h-64 flex flex-col items-center justify-center text-center">
                <FiBarChart2 className="text-4xl text-purple-400 mb-4" />
                <h3 className="font-semibold text-lg mb-2">Traffic Sources</h3>
                <p className="text-sm text-zinc-500">See where your visitors come from</p>
              </GlassCard>
            </div>
            <GlassCard className="p-8 mt-6">
              <div className="h-48 w-full border-b border-l border-white/10 flex items-end justify-between px-2 pt-4">
                {[40, 60, 30, 80, 50, 90, 70].map((h, i) => (
                  <div key={i} className="w-[10%] bg-blue-500/30 rounded-t-sm" style={{ height: `${h}%` }} />
                ))}
              </div>
            </GlassCard>
          </div>

          {/* Paywall overlay */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, type: "spring" }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <div className="text-center p-8 max-w-md">
              <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-tr from-blue-500/20 to-purple-500/20 border border-blue-500/30 flex items-center justify-center mb-6">
                <FiLock className="text-3xl text-blue-400" />
              </div>
              <h2 className="text-2xl font-bold font-mono mb-3">Unlock Analytics</h2>
              <p className="text-zinc-400 mb-8 leading-relaxed">
                Get detailed insights into your profile views, audience demographics, traffic sources, 
                and engagement trends with Cardix Pro.
              </p>
              <Link
                href="/pro"
                className="inline-flex items-center gap-2 px-8 py-3.5 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 rounded-xl font-bold transition-all shadow-xl shadow-blue-500/25"
              >
                <FiStar /> Upgrade to Pro <FiArrowRight />
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  // Full analytics for Pro users
  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold font-mono tracking-tight text-white mb-2">Detailed Analytics</h1>
        <p className="text-zinc-400">In-depth insights into your profile performance.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <GlassCard className="h-64 flex flex-col items-center justify-center text-center">
          <FiPieChart className="text-4xl text-blue-400 mb-4 opacity-50" />
          <h3 className="font-semibold text-lg mb-2">Audience Demographics</h3>
          <p className="text-sm text-zinc-500">Coming soon in Cardix Pro</p>
        </GlassCard>
        
        <GlassCard className="h-64 flex flex-col items-center justify-center text-center">
          <FiBarChart2 className="text-4xl text-purple-400 mb-4 opacity-50" />
          <h3 className="font-semibold text-lg mb-2">Traffic Sources</h3>
          <p className="text-sm text-zinc-500">Coming soon in Cardix Pro</p>
        </GlassCard>
      </div>

      <GlassCard className="p-8">
        <div className="flex items-center gap-3 mb-6">
          <FiActivity className="text-xl text-emerald-400" />
          <h3 className="text-lg font-semibold">Engagement Timeline</h3>
        </div>
        <div className="h-48 w-full border-b border-l border-white/10 flex items-end justify-between px-2 pt-4">
          {[40, 60, 30, 80, 50, 90, 70].map((h, i) => (
            <div key={i} className="w-[10%] bg-blue-500/20 hover:bg-blue-500/40 transition-colors rounded-t-sm" style={{ height: `${h}%` }}></div>
          ))}
        </div>
        <div className="flex justify-between w-full text-xs text-zinc-500 mt-2 px-2">
          <span>Mon</span>
          <span>Tue</span>
          <span>Wed</span>
          <span>Thu</span>
          <span>Fri</span>
          <span>Sat</span>
          <span>Sun</span>
        </div>
      </GlassCard>
    </div>
  );
}
