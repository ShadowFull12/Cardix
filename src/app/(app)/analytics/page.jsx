"use client";

import { useState, useEffect, useMemo } from "react";
import { GlassCard } from "@/components/ui/GlassCard";
import { useAuth } from "@/contexts/AuthContext";
import { FiActivity, FiBarChart2, FiLock, FiStar, FiArrowRight, FiUser, FiEye, FiZap, FiLink, FiShield, FiSmartphone, FiMonitor } from "react-icons/fi";
import Link from "next/link";
import { motion } from "framer-motion";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell } from "recharts";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

export default function AnalyticsPage() {
  const { user } = useAuth();
  const isPro = user?.plan === "pro" || user?.plan === "business" || user?.plan === "enterprise";
  const [resolvedViewers, setResolvedViewers] = useState({});
  const [loadingViewers, setLoadingViewers] = useState(true);

  // All entries across views and scans
  const allHistory = useMemo(() => [...(user?.profileViews || []), ...(user?.scanHistory || [])], [user]);

  // Past 7 days chart data
  const past7Days = [...Array(7)].map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    return d.toISOString().split("T")[0];
  });

  const chartData = past7Days.map(date => ({
    name: new Date(date).toLocaleDateString("en-US", { weekday: "short" }),
    views: (user?.profileViews || []).filter(v => v.timestamp?.startsWith(date)).length,
    scans: (user?.scanHistory || []).filter(s => s.timestamp?.startsWith(date)).length,
  }));

  // Device breakdown
  const deviceBreakdown = useMemo(() => {
    const counts = {};
    allHistory.forEach(entry => {
      const d = entry.device || "Unknown";
      counts[d] = (counts[d] || 0) + 1;
    });
    return Object.entries(counts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 6);
  }, [allHistory]);

  const DEVICE_COLORS = ["#3b82f6", "#a855f7", "#22c55e", "#f97316", "#ec4899", "#06b6d4"];

  // Recent viewers list (dedup by uid, most recent first)
  const recentViewers = useMemo(() => {
    const seen = new Set();
    return (user?.profileViews || []).filter(v => {
      if (seen.has(v.uid)) return false;
      seen.add(v.uid);
      return true;
    }).slice(0, 8);
  }, [user?.profileViews]);

  useEffect(() => {
    if (!isPro) { setLoadingViewers(false); return; }
    const fetchViewers = async () => {
      const uids = recentViewers.map(v => v.uid).filter(u => u && u !== "anonymous");
      const resolved = {};
      for (const uid of uids) {
        try {
          const snap = await getDoc(doc(db, "users", uid));
          if (snap.exists()) resolved[uid] = snap.data();
        } catch {}
      }
      setResolvedViewers(resolved);
      setLoadingViewers(false);
    };
    fetchViewers();
  }, [recentViewers, isPro]);

  const totalViews = user?.analytics?.views || 0;
  const totalScans = user?.analytics?.scans || 0;
  const totalClicks = user?.analytics?.linkClicks || 0;

  // ── Paywall for free users ─────────────────────────────────
  if (!isPro) {
    return (
      <div className="max-w-5xl mx-auto space-y-8 relative">
        <div>
          <h1 className="text-3xl font-bold font-mono tracking-tight text-white mb-2">Detailed Analytics</h1>
          <p className="text-zinc-400">In-depth insights into your profile performance.</p>
        </div>
        <div className="relative">
          <div className="filter blur-[6px] opacity-50 pointer-events-none select-none space-y-6">
            <div className="grid grid-cols-3 gap-4">
              {["0 Views", "0 Scans", "0 Clicks"].map((s, i) => (
                <GlassCard key={i} className="p-5 text-center">
                  <p className="text-2xl font-bold text-white">{s.split(" ")[0]}</p>
                  <p className="text-xs text-zinc-500">{s.split(" ")[1]}</p>
                </GlassCard>
              ))}
            </div>
            <GlassCard className="p-6 h-72" />
            <GlassCard className="p-6 h-48" />
          </div>
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.4 }}
            className="absolute inset-0 flex items-center justify-center">
            <div className="text-center p-8 max-w-md">
              <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-tr from-blue-500/20 to-purple-500/20 border border-blue-500/30 flex items-center justify-center mb-6">
                <FiLock className="text-3xl text-blue-400" />
              </div>
              <h2 className="text-2xl font-bold font-mono mb-3">Unlock Analytics</h2>
              <p className="text-zinc-400 mb-8 leading-relaxed">Get detailed insights, viewer identities, device breakdowns, and traffic graphs with Cardix Pro.</p>
              <Link href="/pro" className="inline-flex items-center gap-2 px-8 py-3.5 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 rounded-xl font-bold transition-all shadow-xl shadow-blue-500/25">
                <FiStar /> Upgrade to Pro <FiArrowRight />
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  // ── Full Pro Analytics ─────────────────────────────────────
  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold font-mono tracking-tight text-white mb-2">Detailed Analytics</h1>
          <p className="text-zinc-400">Real-time insights into your profile performance.</p>
        </div>
        <Link href="/audience" className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600/10 border border-blue-500/30 text-blue-400 text-sm font-semibold hover:bg-blue-600/20 transition-all">
          <FiShield /> Audience Management <FiArrowRight className="text-xs" />
        </Link>
      </div>

      {/* Stat Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: "Profile Views", value: totalViews, icon: FiEye, color: "#3b82f6" },
          { label: "QR Scans", value: totalScans, icon: FiZap, color: "#a855f7" },
          { label: "Link Clicks", value: totalClicks, icon: FiLink, color: "#22c55e" },
        ].map((stat, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
            <GlassCard className="p-5 flex items-center gap-4">
              <div className="w-11 h-11 rounded-2xl flex items-center justify-center shrink-0" style={{ background: `${stat.color}18`, border: `1px solid ${stat.color}30` }}>
                <stat.icon className="text-xl" style={{ color: stat.color }} />
              </div>
              <div>
                <p className="text-2xl font-bold text-white font-mono">{stat.value.toLocaleString()}</p>
                <p className="text-xs text-zinc-500">{stat.label}</p>
              </div>
            </GlassCard>
          </motion.div>
        ))}
      </div>

      {/* Engagement Timeline */}
      <GlassCard className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <FiActivity className="text-xl text-emerald-400" />
          <h3 className="text-lg font-semibold">Engagement Timeline (Last 7 Days)</h3>
          <div className="ml-auto flex items-center gap-4 text-xs text-zinc-500">
            <span className="flex items-center gap-1.5"><span className="w-3 h-0.5 rounded bg-blue-500 inline-block" />Views</span>
            <span className="flex items-center gap-1.5"><span className="w-3 h-0.5 rounded bg-purple-500 inline-block" />Scans</span>
          </div>
        </div>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.07)" vertical={false} />
              <XAxis dataKey="name" stroke="transparent" tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 12 }} />
              <YAxis stroke="transparent" tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 12 }} allowDecimals={false} />
              <Tooltip contentStyle={{ backgroundColor: "rgba(0,0,0,0.85)", borderColor: "rgba(255,255,255,0.1)", borderRadius: "12px", fontSize: "13px" }} itemStyle={{ color: "#fff" }} />
              <Line type="monotone" dataKey="views" name="Profile Views" stroke="#3b82f6" strokeWidth={3} dot={{ r: 4, fill: "#3b82f6", strokeWidth: 0 }} activeDot={{ r: 6 }} />
              <Line type="monotone" dataKey="scans" name="QR Scans" stroke="#a855f7" strokeWidth={3} dot={{ r: 4, fill: "#a855f7", strokeWidth: 0 }} activeDot={{ r: 6 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </GlassCard>

      {/* Device Breakdown */}
      {deviceBreakdown.length > 0 && (
        <GlassCard className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <FiSmartphone className="text-xl text-orange-400" />
            <h3 className="text-lg font-semibold">Visitor Device Breakdown</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={deviceBreakdown} layout="vertical" margin={{ left: 0, right: 20 }}>
                  <XAxis type="number" hide allowDecimals={false} />
                  <YAxis type="category" dataKey="name" stroke="transparent" tick={{ fill: "rgba(255,255,255,0.5)", fontSize: 11 }} width={130} />
                  <Tooltip contentStyle={{ backgroundColor: "rgba(0,0,0,0.85)", borderColor: "rgba(255,255,255,0.1)", borderRadius: "12px" }} itemStyle={{ color: "#fff" }} />
                  <Bar dataKey="count" radius={[0, 6, 6, 0]}>
                    {deviceBreakdown.map((_, index) => (
                      <Cell key={index} fill={DEVICE_COLORS[index % DEVICE_COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-2">
              {deviceBreakdown.map((dev, i) => (
                <div key={i} className="flex items-center justify-between py-1.5 border-b border-white/5 last:border-0">
                  <span className="text-sm text-zinc-300 flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: DEVICE_COLORS[i % DEVICE_COLORS.length] }} />
                    {dev.name}
                  </span>
                  <span className="font-mono text-sm font-semibold text-white">{dev.count}</span>
                </div>
              ))}
            </div>
          </div>
        </GlassCard>
      )}

      {/* Recent Profile Viewers */}
      <GlassCard className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <FiUser className="text-xl text-cyan-400" />
            <h3 className="text-lg font-semibold">Recent Profile Viewers</h3>
          </div>
          <Link href="/audience" className="text-sm text-zinc-400 hover:text-white transition-colors flex items-center gap-1">
            Manage in Audience <FiArrowRight className="text-xs" />
          </Link>
        </div>

        {loadingViewers ? (
          <div className="flex justify-center py-10">
            <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : recentViewers.length === 0 ? (
          <div className="text-center py-10 text-zinc-500 text-sm">No profile views recorded yet. Share your link to start tracking!</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {recentViewers.map((view, i) => {
              const isAnon = view.uid === "anonymous";
              const resolved = !isAnon ? resolvedViewers[view.uid] : null;
              const name = isAnon ? "Anonymous Visitor" : (resolved?.publicData?.name || resolved?.displayName || "Cardix User");
              const avatar = resolved?.photoURL;
              return (
                <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.03] border border-white/5 hover:bg-white/[0.06] transition-colors">
                  <div className="w-9 h-9 rounded-full bg-zinc-800 flex items-center justify-center shrink-0 overflow-hidden ring-1 ring-white/10">
                    {avatar ? <img src={avatar} alt={name} className="w-full h-full object-cover" /> : (isAnon ? <FiMonitor className="text-zinc-500 text-sm" /> : <FiUser className="text-zinc-500 text-sm" />)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-white truncate">{name}</p>
                    {view.device && <p className="text-[10px] text-emerald-400/70 font-mono mt-0.5">{view.device}</p>}
                  </div>
                  <p className="text-[10px] text-zinc-600 shrink-0">{new Date(view.timestamp).toLocaleDateString()}</p>
                </div>
              );
            })}
          </div>
        )}
      </GlassCard>

      {/* Audience CTA */}
      <div className="p-5 rounded-2xl border border-blue-500/20 bg-blue-600/5 flex flex-col sm:flex-row items-center gap-4 justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center shrink-0">
            <FiShield className="text-xl text-blue-400" />
          </div>
          <div>
            <p className="font-semibold text-white">Audience Management</p>
            <p className="text-sm text-zinc-400">Restrict access to your contact details for specific viewers</p>
          </div>
        </div>
        <Link href="/audience" className="shrink-0 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold transition-colors flex items-center gap-2">
          Manage Audience <FiArrowRight />
        </Link>
      </div>
    </div>
  );
}
