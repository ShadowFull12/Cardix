"use client";

import { useEffect, useState, use } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { getUserByUsername, incrementProfileViews, addRecentlyViewed } from "@/lib/firestore";
import { PublicCard } from "@/components/card/PublicCard";

export default function PublicProfileRoute({ params }) {
  const unwrappedParams = use(params);
  const username = unwrappedParams.username;
  
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const shareMode = searchParams.get("share") || "full";
  
  const [targetUser, setTargetUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchTarget() {
      try {
        const foundUser = await getUserByUsername(username);
        if (!foundUser) {
          setError("Profile not found");
          setLoading(false);
          return;
        }

        // Logic: if viewer is the owner, redirect to vault
        if (user && user.uid === foundUser.uid) {
          router.replace("/vault");
          return;
        }

        // Track analytics & history
        if (user && user.uid !== foundUser.uid) {
          await addRecentlyViewed(user.uid, foundUser.uid);
        }
        await incrementProfileViews(foundUser.uid);

        setTargetUser(foundUser);
      } catch (err) {
        console.error(err);
        setError("Error loading profile");
      } finally {
        setLoading(false);
      }
    }

    if (!authLoading) {
      fetchTarget();
    }
  }, [username, user, authLoading, router]);

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error || !targetUser) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center text-white space-y-4">
        <div className="w-16 h-16 bg-zinc-900 rounded-full flex items-center justify-center text-zinc-500 mb-4">
          <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold font-mono">Profile Not Found</h1>
        <p className="text-zinc-500">{error || "The user you are looking for does not exist."}</p>
        <button 
          onClick={() => router.push("/")}
          className="mt-8 px-6 py-2 bg-white text-black font-medium rounded-full hover:bg-zinc-200 transition-colors"
        >
          Go Home
        </button>
      </div>
    );
  }

  // If private, don't show
  if (targetUser.settings?.profileVisibility === "private") {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center text-white space-y-4">
        <div className="w-16 h-16 bg-zinc-900 rounded-full flex items-center justify-center text-zinc-500 mb-4">
          <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold font-mono">Profile is Private</h1>
        <p className="text-zinc-500">This user's profile is currently hidden.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black selection:bg-blue-500/30 text-white relative flex justify-center py-10 px-4 md:py-20 overflow-x-hidden">
      {/* Background gradients */}
      <div className="fixed top-0 left-1/4 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[128px] pointer-events-none" />
      <div className="fixed bottom-0 right-1/4 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[128px] pointer-events-none" />

      <div className="w-full max-w-2xl relative z-10">
        <PublicCard profile={targetUser} viewer={user} shareMode={shareMode} />
      </div>
    </div>
  );
}
