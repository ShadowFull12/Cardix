"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { getUserProfile } from "@/lib/firestore";
import { GlassCard } from "@/components/ui/GlassCard";
import { AnalyticsCard } from "@/components/dashboard/AnalyticsCard";
import { QRDisplay } from "@/components/dashboard/QRDisplay";
import { ShareDialog } from "@/components/profile/ShareDialog";
import { ProfileSkeleton } from "@/components/ui/SkeletonLoader";
import { FiEdit3, FiShare2, FiEye, FiZap, FiLink, FiUser, FiHardDrive, FiGrid, FiStar, FiArrowRight, FiShield } from "react-icons/fi";
import Link from "next/link";

export default function Dashboard() {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [shareOpen, setShareOpen] = useState(false);

  useEffect(() => {
    async function loadData() {
      if (user?.uid) {
        const data = await getUserProfile(user.uid);
        setProfile(data);
      }
      setLoading(false);
    }
    loadData();
  }, [user]);

  if (loading || !profile) {
    return (
      <div className="max-w-4xl mx-auto space-y-8">
        <h1 className="text-3xl font-bold font-mono tracking-tight">Dashboard</h1>
        <ProfileSkeleton />
      </div>
    );
  }

  const analytics = profile.analytics || { views: 0, scans: 0, linkClicks: 0 };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Header with Identity Mode */}
      <div className="flex flex-col gap-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold font-mono tracking-tight text-white mb-2">
              Welcome back, {profile.publicData?.name || "User"}
            </h1>
            <p className="text-zinc-400">Here&apos;s what&apos;s happening with your Cardix today.</p>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/profile">
              <button className="flex items-center gap-2 px-4 py-2 bg-zinc-900 hover:bg-zinc-800 border border-white/10 rounded-xl transition-colors font-medium text-sm">
                <FiEdit3 /> Edit Profile
              </button>
            </Link>
            <button
              onClick={() => setShareOpen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 rounded-xl transition-all font-medium text-sm shadow-lg shadow-blue-500/25"
            >
              <FiShare2 /> Share Card
            </button>
          </div>
        </div>
      </div>

      {/* Analytics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <AnalyticsCard
          title="Profile Views"
          value={analytics.views}
          icon={<FiEye className="text-blue-400" />}
          trend="+12% this week"
          delay={0.1}
        />
        <AnalyticsCard
          title="QR Scans"
          value={analytics.scans}
          icon={<FiZap className="text-purple-400" />}
          trend="+5% this week"
          delay={0.2}
        />
        <AnalyticsCard
          title="Link Clicks"
          value={analytics.linkClicks}
          icon={<FiLink className="text-emerald-400" />}
          trend="+8% this week"
          delay={0.3}
        />
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Link href="/vault" className="group">
          <div className="p-4 rounded-xl bg-zinc-900/50 border border-white/5 hover:border-blue-500/30 hover:bg-blue-500/5 transition-all text-center">
            <FiHardDrive className="mx-auto text-xl text-blue-400 mb-2 group-hover:scale-110 transition-transform" />
            <p className="text-sm font-medium">My Vault</p>
          </div>
        </Link>
        <Link href="/card/preview" className="group">
          <div className="p-4 rounded-xl bg-zinc-900/50 border border-white/5 hover:border-purple-500/30 hover:bg-purple-500/5 transition-all text-center">
            <FiGrid className="mx-auto text-xl text-purple-400 mb-2 group-hover:scale-110 transition-transform" />
            <p className="text-sm font-medium">Card Editor</p>
          </div>
        </Link>
        <Link href="/profile" className="group">
          <div className="p-4 rounded-xl bg-zinc-900/50 border border-white/5 hover:border-emerald-500/30 hover:bg-emerald-500/5 transition-all text-center">
            <FiUser className="mx-auto text-xl text-emerald-400 mb-2 group-hover:scale-110 transition-transform" />
            <p className="text-sm font-medium">Edit Profile</p>
          </div>
        </Link>
        {user?.plan === "pro" || user?.plan === "business" || user?.plan === "enterprise" ? (
          <Link href="/audience" className="group">
            <div className="p-4 rounded-xl bg-zinc-900/50 border border-white/5 hover:border-blue-500/30 hover:bg-blue-500/5 transition-all text-center">
              <FiShield className="mx-auto text-xl text-blue-400 mb-2 group-hover:scale-110 transition-transform" />
              <p className="text-sm font-medium">Audience</p>
            </div>
          </Link>
        ) : (
          <Link href="/pro" className="group">
            <div className="p-4 rounded-xl bg-zinc-900/50 border border-white/5 hover:border-amber-500/30 hover:bg-amber-500/5 transition-all text-center">
              <FiStar className="mx-auto text-xl text-amber-400 mb-2 group-hover:scale-110 transition-transform" />
              <p className="text-sm font-medium">Go Pro</p>
            </div>
          </Link>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* QR Section */}
        <div className="lg:col-span-1">
          <QRDisplay username={profile.username} />
        </div>

        {/* Recent Activity */}
        <div className="lg:col-span-2 space-y-6">
          <GlassCard className="h-full" delay={0.4}>
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-semibold text-lg flex items-center gap-2">
                <FiZap className="text-blue-400" /> Recent Scans
              </h3>
              <Link href="/analytics" className="text-sm text-zinc-400 hover:text-white transition-colors">
                View All
              </Link>
            </div>

            {profile.scanHistory?.length > 0 ? (
              <div className="space-y-4">
                {profile.scanHistory.slice(0, 5).map((scan, i) => (
                  <div key={i} className="flex flex-col sm:flex-row sm:items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5 gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center shrink-0">
                        <FiUser className="text-zinc-400" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium truncate">
                          {scan.uid === "anonymous" 
                            ? ((user?.plan === "pro" || user?.plan === "business" || user?.plan === "enterprise") && scan.device ? `Anonymous (${scan.device})` : "Anonymous Visitor")
                            : ((user?.plan === "pro" || user?.plan === "business" || user?.plan === "enterprise") ? "Identified User (See Audience)" : "Hidden Profile Scan")
                          }
                        </p>
                        <p className="text-xs text-zinc-500">
                          {new Date(scan.timestamp).toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <Link href="/analytics" className="shrink-0">
                      <button className="w-full sm:w-auto px-4 py-1.5 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 text-xs font-semibold rounded-lg transition-colors border border-blue-500/20">
                        View Details
                      </button>
                    </Link>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-48 text-center px-4">
                <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4 border border-white/10">
                  <FiZap className="text-2xl text-zinc-600" />
                </div>
                <p className="text-zinc-400 text-sm">No recent scans.</p>
                <p className="text-zinc-500 text-xs mt-1">Share your QR code to get started!</p>
              </div>
            )}
          </GlassCard>
        </div>
      </div>

      {/* Share Dialog */}
      <ShareDialog
        isOpen={shareOpen}
        onClose={() => setShareOpen(false)}
        profile={profile}
      />
    </div>
  );
}
