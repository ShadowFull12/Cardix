"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import { getTemporaryShare, getUserProfile } from "@/lib/firestore";
import { PublicCard } from "@/components/card/PublicCard";
import { useAuth } from "@/contexts/AuthContext";

export default function TempSharePage({ params }) {
  const unwrappedParams = use(params);
  const shareId = unwrappedParams.shareId;

  const { user } = useAuth();
  const router = useRouter();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [expired, setExpired] = useState(false);

  useEffect(() => {
    async function load() {
      const shareData = await getTemporaryShare(shareId);
      if (!shareData) {
        setExpired(true);
        setLoading(false);
        return;
      }

      const userProfile = await getUserProfile(shareData.uid);
      if (!userProfile) {
        setExpired(true);
        setLoading(false);
        return;
      }

      setProfile(userProfile);
      setLoading(false);
    }
    load();
  }, [shareId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (expired) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center text-white space-y-4">
        <div className="w-16 h-16 bg-zinc-900 rounded-full flex items-center justify-center text-zinc-500 mb-4">
          <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold font-mono">Link Expired</h1>
        <p className="text-zinc-500">This temporary share link is no longer valid.</p>
        <button
          onClick={() => router.push("/")}
          className="mt-8 px-6 py-2 bg-white text-black font-medium rounded-full hover:bg-zinc-200 transition-colors"
        >
          Go Home
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black selection:bg-blue-500/30 text-white relative flex justify-center py-10 px-4 md:py-20 overflow-x-hidden">
      <div className="fixed top-0 left-1/4 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[128px] pointer-events-none" />
      <div className="fixed bottom-0 right-1/4 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[128px] pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        {/* Temporary badge */}
        <div className="mb-4 text-center">
          <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded-full text-xs font-medium">
            ⏱ Temporary Link
          </span>
        </div>
        <PublicCard profile={profile} viewer={user} />
      </div>
    </div>
  );
}
