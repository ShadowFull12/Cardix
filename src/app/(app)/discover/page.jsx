"use client";

import { useState, useEffect } from "react";
import { getDiscoverProfiles, searchUsers } from "@/lib/firestore";
import { GlassCard } from "@/components/ui/GlassCard";
import { FiSearch, FiTrendingUp } from "react-icons/fi";
import Link from "next/link";
import { motion } from "framer-motion";

export default function DiscoverPage() {
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    async function loadTrending() {
      const data = await getDiscoverProfiles(12);
      setProfiles(data);
      setLoading(false);
    }
    loadTrending();
  }, []);

  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (searchTerm.length >= 2) {
        setIsSearching(true);
        const results = await searchUsers(searchTerm);
        setProfiles(results);
        setIsSearching(false);
      } else if (searchTerm.length === 0) {
        setIsSearching(true);
        const data = await getDiscoverProfiles(12);
        setProfiles(data);
        setIsSearching(false);
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold font-mono tracking-tight text-white mb-2">Discover</h1>
        <p className="text-zinc-400">Find new connections and explore trending profiles.</p>
      </div>

      {/* Search Bar */}
      <div className="relative max-w-2xl">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search by username..."
          className="w-full bg-zinc-900/50 border border-white/10 rounded-2xl px-6 py-4 pl-14 text-white text-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all font-sans"
        />
        <FiSearch className="absolute left-5 top-4.5 text-xl text-zinc-500" />
      </div>

      <div className="flex items-center gap-2 mb-4">
        <FiTrendingUp className="text-blue-400" />
        <h2 className="text-xl font-semibold">{searchTerm ? "Search Results" : "Trending Profiles"}</h2>
      </div>

      {(loading || isSearching) ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="animate-pulse bg-zinc-800 rounded-2xl h-64" />
          ))}
        </div>
      ) : profiles.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {profiles.map((profile, i) => (
            <Link key={profile.id} href={`/card/${profile.username}`}>
              <GlassCard delay={i * 0.05} hover={true} className="flex flex-col items-center text-center group">
                <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 p-1 mb-4">
                  <div className="w-full h-full rounded-full bg-black overflow-hidden flex items-center justify-center">
                    {profile.photoURL ? (
                      <img src={profile.photoURL} alt={profile.publicData?.name} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-xl font-bold font-mono text-white">
                        {profile.publicData?.name?.[0] || "?"}
                      </span>
                    )}
                  </div>
                </div>
                <h3 className="font-semibold text-lg truncate w-full group-hover:text-blue-400 transition-colors">
                  {profile.publicData?.name || profile.username}
                </h3>
                <p className="text-sm text-zinc-400 truncate w-full mb-3">
                  {profile.publicData?.role || "@" + profile.username}
                </p>
                <div className="mt-auto pt-4 flex w-full justify-between items-center border-t border-white/5 text-xs text-zinc-500">
                  <span>{profile.analytics?.views || 0} views</span>
                  <span>View Card &rarr;</span>
                </div>
              </GlassCard>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 text-zinc-500">
          <FiSearch className="text-4xl mx-auto mb-4 opacity-50" />
          <p>No profiles found matching "{searchTerm}"</p>
        </div>
      )}
    </div>
  );
}
