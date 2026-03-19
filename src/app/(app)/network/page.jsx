"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { getUserProfile, getUserByUsername } from "@/lib/firestore";
import { GlassCard } from "@/components/ui/GlassCard";
import { FiBookmark, FiClock, FiUser } from "react-icons/fi";
import Link from "next/link";
import { motion } from "framer-motion";

export default function NetworkPage() {
  const { user } = useAuth();
  const [savedProfiles, setSavedProfiles] = useState([]);
  const [recentProfiles, setRecentProfiles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadNetwork() {
      if (!user?.uid) return;
      
      const currentUserDoc = await getUserProfile(user.uid);
      if (!currentUserDoc) return;

      const savedIds = currentUserDoc.savedUsers || [];
      const recentIds = currentUserDoc.recentlyViewed || [];

      // Fetch full profile data for these IDs
      // Note: In a production app, this should be a bulk fetch or paginated query. 
      // For this demo, we fetch individually. Note that Firebase "in" query allows max 10.
      
      const fetchProfiles = async (ids) => {
        const promises = ids.slice(0, 10).map(id => getUserProfile(id));
        const results = await Promise.all(promises);
        return results.filter(p => p !== null);
      };

      const [savedData, recentData] = await Promise.all([
        fetchProfiles(savedIds),
        fetchProfiles(recentIds)
      ]);

      setSavedProfiles(savedData);
      setRecentProfiles(recentData);
      setLoading(false);
    }
    loadNetwork();
  }, [user]);

  const renderProfileList = (profiles, emptyMessage, icon) => {
    if (loading) {
      return (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-20 bg-zinc-800 animate-pulse rounded-2xl" />
          ))}
        </div>
      );
    }

    if (profiles.length === 0) {
      return (
        <div className="py-12 text-center text-zinc-500 border border-dashed border-white/10 rounded-2xl bg-white/5">
          {icon}
          <p>{emptyMessage}</p>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {profiles.map((profile, i) => (
          <Link key={profile.uid || i} href={`/card/${profile.username}`}>
            <GlassCard delay={i * 0.1} hover={true} className="flex items-center gap-4 p-4 !w-full">
              <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-zinc-700 to-zinc-600 overflow-hidden flex items-center justify-center shrink-0">
                {profile.photoURL ? (
                  <img src={profile.photoURL} alt={profile.publicData?.name} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-white font-bold">{profile.publicData?.name?.[0] || "?"}</span>
                )}
              </div>
              <div className="overflow-hidden">
                <h4 className="font-semibold truncate">{profile.publicData?.name || profile.username}</h4>
                <p className="text-xs text-zinc-400 truncate">{profile.publicData?.role || "Cardix User"}</p>
              </div>
            </GlassCard>
          </Link>
        ))}
      </div>
    );
  };

  return (
    <div className="max-w-5xl mx-auto space-y-12">
      <div>
        <h1 className="text-3xl font-bold font-mono tracking-tight text-white mb-2">My Network</h1>
        <p className="text-zinc-400">Manage your saved contacts and view history.</p>
      </div>

      <section>
        <div className="flex items-center gap-2 mb-6">
          <FiBookmark className="text-blue-400 text-xl" />
          <h2 className="text-xl font-semibold">Saved Cards</h2>
        </div>
        {renderProfileList(
          savedProfiles, 
          "You haven't saved any cards yet. Explore Discover to find connections.",
          <FiBookmark className="text-3xl mx-auto mb-2 opacity-50" />
        )}
      </section>

      <section>
        <div className="flex items-center gap-2 mb-6">
          <FiClock className="text-purple-400 text-xl" />
          <h2 className="text-xl font-semibold">Recently Viewed</h2>
        </div>
        {renderProfileList(
          recentProfiles, 
          "No viewing history. Scan some QR codes!",
          <FiClock className="text-3xl mx-auto mb-2 opacity-50" />
        )}
      </section>
    </div>
  );
}
