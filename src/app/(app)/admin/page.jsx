"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { getUserProfile, getAllUsers, updateUserProfile } from "@/lib/firestore";
import { GlassCard } from "@/components/ui/GlassCard";
import { FiUsers, FiShield, FiActivity, FiTrash2, FiSearch, FiEye, FiZap, FiLink } from "react-icons/fi";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

export default function AdminPage() {
  const { user } = useAuth();
  const router = useRouter();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [stats, setStats] = useState({ totalUsers: 0, totalViews: 0, totalScans: 0 });

  useEffect(() => {
    async function load() {
      if (!user?.uid) return;

      const profile = await getUserProfile(user.uid);
      if (profile?.role !== "admin") {
        toast.error("Access denied. Admin only.");
        router.replace("/dashboard");
        return;
      }

      const allUsers = await getAllUsers(100);
      setUsers(allUsers);

      const totalViews = allUsers.reduce((sum, u) => sum + (u.analytics?.views || 0), 0);
      const totalScans = allUsers.reduce((sum, u) => sum + (u.analytics?.scans || 0), 0);
      setStats({ totalUsers: allUsers.length, totalViews, totalScans });
      setLoading(false);
    }
    load();
  }, [user, router]);

  const filteredUsers = users.filter((u) => {
    const term = searchTerm.toLowerCase();
    return (
      u.username?.toLowerCase().includes(term) ||
      u.publicData?.name?.toLowerCase().includes(term) ||
      u.email?.toLowerCase().includes(term)
    );
  });

  const toggleVisibility = async (uid, currentVisibility) => {
    const newVisibility = currentVisibility === "public" ? "private" : "public";
    try {
      await updateUserProfile(uid, { "settings.profileVisibility": newVisibility });
      setUsers(users.map((u) => u.uid === uid 
        ? { ...u, settings: { ...u.settings, profileVisibility: newVisibility } } 
        : u
      ));
      toast.success(`Profile ${newVisibility === "public" ? "shown" : "hidden"}`);
    } catch {
      toast.error("Failed to update");
    }
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto space-y-8">
        <h1 className="text-3xl font-bold font-mono tracking-tight">Admin Panel</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-32 bg-zinc-800 animate-pulse rounded-2xl" />
          ))}
        </div>
        <div className="h-96 bg-zinc-800 animate-pulse rounded-2xl" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="flex items-center gap-3">
        <div className="p-3 bg-red-500/10 rounded-xl border border-red-500/20">
          <FiShield className="text-red-400 text-xl" />
        </div>
        <div>
          <h1 className="text-3xl font-bold font-mono tracking-tight text-white">Admin Panel</h1>
          <p className="text-zinc-400 text-sm">Manage users and monitor platform activity.</p>
        </div>
      </div>

      {/* Platform Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <GlassCard delay={0.1}>
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-500/10 rounded-xl"><FiUsers className="text-blue-400 text-xl" /></div>
            <div>
              <p className="text-3xl font-bold font-mono">{stats.totalUsers}</p>
              <p className="text-sm text-zinc-400">Total Users</p>
            </div>
          </div>
        </GlassCard>
        <GlassCard delay={0.2}>
          <div className="flex items-center gap-4">
            <div className="p-3 bg-purple-500/10 rounded-xl"><FiEye className="text-purple-400 text-xl" /></div>
            <div>
              <p className="text-3xl font-bold font-mono">{stats.totalViews.toLocaleString()}</p>
              <p className="text-sm text-zinc-400">Total Profile Views</p>
            </div>
          </div>
        </GlassCard>
        <GlassCard delay={0.3}>
          <div className="flex items-center gap-4">
            <div className="p-3 bg-emerald-500/10 rounded-xl"><FiZap className="text-emerald-400 text-xl" /></div>
            <div>
              <p className="text-3xl font-bold font-mono">{stats.totalScans.toLocaleString()}</p>
              <p className="text-sm text-zinc-400">Total QR Scans</p>
            </div>
          </div>
        </GlassCard>
      </div>

      {/* User Management */}
      <GlassCard hover={false} className="overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <FiUsers className="text-blue-400" /> User Management
          </h3>
          <div className="relative max-w-xs w-full">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search users..."
              className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-2.5 pl-10 text-sm text-white focus:ring-2 focus:ring-blue-500/50 focus:outline-none"
            />
            <FiSearch className="absolute left-3.5 top-3 text-zinc-500" />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10 text-zinc-400 text-left">
                <th className="py-3 px-4 font-medium">User</th>
                <th className="py-3 px-4 font-medium">Username</th>
                <th className="py-3 px-4 font-medium">Views</th>
                <th className="py-3 px-4 font-medium">Scans</th>
                <th className="py-3 px-4 font-medium">Visibility</th>
                <th className="py-3 px-4 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((u, i) => (
                <motion.tr
                  key={u.uid}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.03 }}
                  className="border-b border-white/5 hover:bg-white/5 transition-colors"
                >
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-zinc-700 to-zinc-600 flex items-center justify-center text-xs font-bold shrink-0 overflow-hidden">
                        {u.photoURL ? (
                          <img src={u.photoURL} alt="" className="w-full h-full object-cover" />
                        ) : (
                          u.publicData?.name?.[0] || "?"
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-white">{u.publicData?.name || "—"}</p>
                        <p className="text-xs text-zinc-500 truncate max-w-[160px]">{u.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-zinc-300">@{u.username || "—"}</td>
                  <td className="py-3 px-4 text-zinc-300">{u.analytics?.views || 0}</td>
                  <td className="py-3 px-4 text-zinc-300">{u.analytics?.scans || 0}</td>
                  <td className="py-3 px-4">
                    <span className={`text-xs px-2 py-1 rounded-full ${u.settings?.profileVisibility === "public" ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" : "bg-zinc-700 text-zinc-400 border border-zinc-600"}`}>
                      {u.settings?.profileVisibility || "public"}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => toggleVisibility(u.uid, u.settings?.profileVisibility)}
                        className="p-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-zinc-400 hover:text-white transition-colors"
                        title="Toggle Visibility"
                      >
                        <FiEye className="text-sm" />
                      </button>
                      <a
                        href={`/card/${u.username}`}
                        target="_blank"
                        className="p-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-zinc-400 hover:text-white transition-colors"
                        title="View Profile"
                      >
                        <FiLink className="text-sm" />
                      </a>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredUsers.length === 0 && (
          <div className="py-12 text-center text-zinc-500">No users found matching "{searchTerm}"</div>
        )}
      </GlassCard>
    </div>
  );
}
