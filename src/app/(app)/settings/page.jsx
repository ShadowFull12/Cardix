"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { getUserProfile, updateUserProfile } from "@/lib/firestore";
import { GlassCard } from "@/components/ui/GlassCard";
import { FiSettings, FiLogOut, FiMoon, FiGlobe, FiStar, FiArrowRight, FiZap, FiEye, FiEyeOff } from "react-icons/fi";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import Link from "next/link";

const TIER_INFO = {
  free: { name: "Free", color: "text-zinc-400", bg: "bg-zinc-800", border: "border-zinc-700", storage: "500 MB" },
  pro: { name: "Pro", color: "text-amber-400", bg: "bg-amber-500/10", border: "border-amber-500/30", storage: "10 GB" },
  business: { name: "Business", color: "text-blue-400", bg: "bg-blue-500/10", border: "border-blue-500/30", storage: "100 GB" },
};

export default function SettingsPage() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const currentPlan = user?.plan || "free";
  const tier = TIER_INFO[currentPlan] || TIER_INFO.free;

  const [privacy, setPrivacy] = useState({
    emailPublic: true,
    phonePublic: false,
    locationPublic: false,
  });
  const [savingPrivacy, setSavingPrivacy] = useState(false);

  // Load privacy settings from profile
  useEffect(() => {
    async function load() {
      if (!user?.uid) return;
      const profile = await getUserProfile(user.uid);
      if (profile?.settings?.privacy) {
        setPrivacy(prev => ({ ...prev, ...profile.settings.privacy }));
      }
    }
    load();
  }, [user]);

  const togglePrivacy = async (key) => {
    const updated = { ...privacy, [key]: !privacy[key] };
    setPrivacy(updated);
    setSavingPrivacy(true);
    try {
      const profile = await getUserProfile(user.uid);
      await updateUserProfile(user.uid, {
        settings: {
          ...profile.settings,
          privacy: updated,
        },
      });
      toast.success(`${key === "emailPublic" ? "Email" : key === "phonePublic" ? "Phone" : "Location"} visibility updated`);
    } catch {
      toast.error("Failed to update privacy setting");
    } finally {
      setSavingPrivacy(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      toast.success("Logged out successfully");
      router.push("/login");
    } catch {
      toast.error("Failed to log out");
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold font-mono tracking-tight text-white mb-2">Settings</h1>
        <p className="text-zinc-400">Manage your account preferences.</p>
      </div>

      {/* Current Plan */}
      <GlassCard hover={false}>
        <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
          <FiZap className="text-amber-400" /> Subscription
        </h3>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl border bg-black/30" style={{ borderColor: tier.border.includes("amber") ? "#f59e0b30" : tier.border.includes("blue") ? "#3b82f630" : "#3f3f4630" }}>
          <div className="flex items-center gap-4">
            <div className={`w-12 h-12 rounded-xl ${tier.bg} border ${tier.border} flex items-center justify-center`}>
              <FiStar className={`text-lg ${tier.color}`} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <p className={`font-bold text-lg ${tier.color}`}>{tier.name}</p>
                <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded ${tier.bg} ${tier.color} border ${tier.border}`}>Current</span>
              </div>
              <p className="text-xs text-zinc-500 mt-0.5">{tier.storage} vault storage • {currentPlan === "free" ? "Basic" : "Advanced"} analytics</p>
            </div>
          </div>
          {currentPlan === "free" && (
            <Link href="/pro" className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 rounded-xl font-semibold text-sm transition-all shadow-lg shadow-blue-500/25 shrink-0">
              <FiStar /> Upgrade <FiArrowRight />
            </Link>
          )}
        </div>
      </GlassCard>

      {/* Privacy Controls */}
      <GlassCard hover={false}>
        <h3 className="font-semibold text-lg mb-2 flex items-center gap-2">
          <FiEye className="text-emerald-400" /> Card Privacy
        </h3>
        <p className="text-sm text-zinc-500 mb-5">Choose which contact info is publicly visible on your card.</p>
        <div className="space-y-1">
          {[
            { key: "emailPublic", label: "Email Address", desc: "Show your email on your public card" },
            { key: "phonePublic", label: "Phone Number", desc: "Show your phone number on your public card" },
            { key: "locationPublic", label: "Location", desc: "Show your location on your public card" },
          ].map(item => (
            <div key={item.key} className="flex items-center justify-between py-3 border-b border-white/5 last:border-0">
              <div>
                <p className="text-sm font-medium text-white">{item.label}</p>
                <p className="text-xs text-zinc-500">{item.desc}</p>
              </div>
              <button
                onClick={() => togglePrivacy(item.key)}
                disabled={savingPrivacy}
                className={`relative w-12 h-7 rounded-full transition-colors duration-200 ${privacy[item.key] ? "bg-emerald-500" : "bg-zinc-700"}`}
              >
                <div
                  className={`absolute top-0.5 w-6 h-6 rounded-full bg-white shadow-md transition-transform duration-200 ${privacy[item.key] ? "translate-x-5" : "translate-x-0.5"}`}
                />
              </button>
            </div>
          ))}
        </div>
      </GlassCard>

      <GlassCard hover={false}>
        <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
          <FiSettings className="text-blue-400" /> Account
        </h3>
        <div className="space-y-4 text-sm">
          <div className="flex justify-between items-center py-3 border-b border-white/5">
            <span className="text-zinc-400">Email</span>
            <span>{user?.email}</span>
          </div>
          <div className="flex justify-between items-center py-3 border-b border-white/5">
            <span className="text-zinc-400">Display Name</span>
            <span>{user?.displayName || "Not set"}</span>
          </div>
          <div className="flex justify-between items-center py-3 border-b border-white/5">
            <span className="text-zinc-400">Username</span>
            <span className="text-zinc-300">@{user?.username || "—"}</span>
          </div>
        </div>
      </GlassCard>

      <GlassCard hover={false}>
        <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
          <FiMoon className="text-purple-400" /> Appearance
        </h3>
        <div className="flex justify-between items-center py-3 text-sm">
          <span className="text-zinc-400">Theme</span>
          <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-xs">Dark Mode (Default)</span>
        </div>
      </GlassCard>

      <div className="pt-4">
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-red-500/10 text-red-400 border border-red-500/20 rounded-xl hover:bg-red-500/20 transition-colors font-medium"
        >
          <FiLogOut /> Sign Out
        </button>
      </div>
    </div>
  );
}
