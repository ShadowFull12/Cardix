"use client";

import { GlassCard } from "@/components/ui/GlassCard";
import { useAuth } from "@/contexts/AuthContext";
import { FiActivity, FiPieChart, FiBarChart2, FiLock, FiStar, FiArrowRight } from "react-icons/fi";
import Link from "next/link";
import { motion } from "framer-motion";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

export default function AnalyticsPage() {
  const { user } = useAuth();
  const isPro = user?.plan === "pro" || user?.plan === "business" || user?.plan === "enterprise";

  // Calculate past 7 days data for the chart
  const past7Days = [...Array(7)].map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    return d.toISOString().split("T")[0];
  });

  const chartData = past7Days.map(date => {
    const viewsOnDate = (user?.profileViews || []).filter(v => v.timestamp.startsWith(date)).length;
    const scansOnDate = (user?.scanHistory || []).filter(s => s.timestamp.startsWith(date)).length;
    return {
      name: new Date(date).toLocaleDateString("en-US", { weekday: "short" }),
      views: viewsOnDate,
      scans: scansOnDate
    };
  });

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
          <h3 className="text-lg font-semibold">Engagement Timeline (Last 7 Days)</h3>
        </div>
        
        <div className="h-64 w-full mt-4">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" vertical={false} />
              <XAxis dataKey="name" stroke="rgba(255,255,255,0.5)" tick={{fill: 'rgba(255,255,255,0.5)', fontSize: 12}} />
              <YAxis stroke="rgba(255,255,255,0.5)" tick={{fill: 'rgba(255,255,255,0.5)', fontSize: 12}} allowDecimals={false} />
              <Tooltip 
                contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '12px' }}
                itemStyle={{ color: '#fff' }}
              />
              <Line type="monotone" dataKey="views" name="Profile Views" stroke="#3b82f6" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6 }} />
              <Line type="monotone" dataKey="scans" name="QR Scans" stroke="#a855f7" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </GlassCard>
    </div>
  );
}
