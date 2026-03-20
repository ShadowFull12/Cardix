"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { FiMonitor, FiUser, FiLock, FiUnlock, FiSmartphone } from "react-icons/fi";
import Link from "next/link";
import toast from "react-hot-toast";

export default function AudiencePage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("views"); // "views" or "scans"
  const [resolvedUsers, setResolvedUsers] = useState({});
  const [loading, setLoading] = useState(true);

  const isPro = ["pro", "business", "enterprise"].includes(user?.plan);
  const dataList = activeTab === "views" ? (user?.profileViews || []) : (user?.scanHistory || []);
  const restrictedUsers = user?.settings?.restrictedUsers || {};

  useEffect(() => {
    if (!user) return;
    const fetchUsers = async () => {
      const uniqueUids = [...new Set(dataList.map(item => item.uid).filter(uid => uid !== "anonymous"))];
      const newResolved = { ...resolvedUsers };
      let fetchedAny = false;

      for (const uid of uniqueUids) {
        if (!newResolved[uid]) {
          try {
            const snap = await getDoc(doc(db, "users", uid));
            if (snap.exists()) {
              newResolved[uid] = snap.data();
              fetchedAny = true;
            }
          } catch (err) {
            console.error("Failed to resolve user:", err);
          }
        }
      }

      if (fetchedAny) {
        setResolvedUsers(newResolved);
      }
      setLoading(false);
    };

    fetchUsers();
  }, [dataList, user]);

  const toggleRestriction = async (targetUid) => {
    if (!targetUid || targetUid === "anonymous") return;
    try {
      const currentRestricted = { ...restrictedUsers };
      if (currentRestricted[targetUid]) {
         delete currentRestricted[targetUid];
      } else {
         currentRestricted[targetUid] = true;
      }

      await updateDoc(doc(db, "users", user.uid), {
        "settings.restrictedUsers": currentRestricted
      });
      toast.success(currentRestricted[targetUid] ? "User restricted" : "User allowed");
    } catch (err) {
      console.error(err);
      toast.error("Failed to update restrictions");
    }
  };

  if (!isPro) {
    return (
      <div className="p-4 md:p-8 max-w-4xl mx-auto flex flex-col items-center justify-center min-h-[60vh] text-center">
        <div className="w-16 h-16 bg-blue-500/20 text-blue-500 rounded-full flex items-center justify-center mb-6">
          <FiLock className="text-3xl" />
        </div>
        <h1 className="text-3xl font-bold font-mono text-white mb-4">Audience Management</h1>
        <p className="text-zinc-400 max-w-md mb-8">
          Upgrade to Pro to unlock detailed visitor history, device tracking, and granular access controls for your profile.
        </p>
        <Link href="/pro" className="px-6 py-3 bg-blue-600 text-white font-medium rounded-full hover:bg-blue-700 transition shadow-[0_0_20px_rgba(37,99,235,0.3)]">
          Upgrade to Pro
        </Link>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-3xl font-bold font-mono tracking-tight text-white mb-2">Audience Management</h1>
        <p className="text-zinc-400">Track who is viewing your Cardix and manage their access to your private links.</p>
      </div>

      <div className="flex gap-4 border-b border-white/10 pb-4">
        <button
          onClick={() => { setActiveTab("views"); setLoading(true); }}
          className={`px-5 py-2 rounded-full text-sm font-semibold transition-all ${activeTab === "views" ? "bg-white text-black shadow-[0_0_15px_rgba(255,255,255,0.3)]" : "bg-white/5 text-zinc-400 hover:bg-white/10 hover:text-white"}`}
        >
          Profile Views
        </button>
        <button
          onClick={() => { setActiveTab("scans"); setLoading(true); }}
          className={`px-5 py-2 rounded-full text-sm font-semibold transition-all ${activeTab === "scans" ? "bg-white text-black shadow-[0_0_15px_rgba(255,255,255,0.3)]" : "bg-white/5 text-zinc-400 hover:bg-white/10 hover:text-white"}`}
        >
          QR Scans
        </button>
      </div>

      <div className="space-y-4">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 text-blue-500">
            <div className="w-8 h-8 border-4 border-current border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-4 text-sm font-medium text-zinc-400">Resolving profiles...</p>
          </div>
        ) : dataList.length === 0 ? (
          <div className="text-center py-16 border border-dashed border-white/10 rounded-3xl text-zinc-500 flex flex-col items-center">
            <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center mb-4">
              <FiUser className="text-xl" />
            </div>
            <p className="font-medium text-white mb-1">No {activeTab} recorded yet</p>
            <p className="text-sm">Share your card more to build your audience!</p>
          </div>
        ) : (
          dataList.map((entry, idx) => {
            const isAnon = entry.uid === "anonymous";
            const profile = isAnon ? null : resolvedUsers[entry.uid];
            const isRestricted = restrictedUsers[entry.uid] === true;
            
            return (
              <div key={idx} className="flex flex-col sm:flex-row items-center justify-between p-4 bg-black/40 border border-white/5 rounded-2xl gap-4 hover:bg-white/[0.02] hover:border-white/10 transition-all duration-300">
                <div className="flex items-center gap-4 w-full sm:w-auto">
                  <div className="w-12 h-12 rounded-full bg-zinc-800 flex items-center justify-center shrink-0 overflow-hidden ring-1 ring-white/10">
                    {profile?.photoURL ? (
                      <img src={profile.photoURL} alt="Avatar" className="w-full h-full object-cover" />
                    ) : isAnon ? (
                      <FiMonitor className="text-zinc-500" />
                    ) : (
                      <FiUser className="text-zinc-500" />
                    )}
                  </div>
                  <div className="flex flex-col">
                    <span className="font-semibold text-white">
                      {isAnon ? "Anonymous Visitor" : (profile?.publicData?.name || "Unknown User")}
                    </span>
                    <span className="text-xs text-zinc-500 flex items-center gap-1.5 mt-0.5">
                      {new Date(entry.timestamp).toLocaleString()}
                    </span>
                    {entry.device && (
                      <span className="text-[10px] text-emerald-400/80 font-mono flex items-center gap-1 mt-1 bg-emerald-400/10 px-2 py-0.5 rounded-full w-max">
                        <FiSmartphone className="inline" /> {entry.device}
                      </span>
                    )}
                  </div>
                </div>
                
                {!isAnon && (
                  <button
                    onClick={() => toggleRestriction(entry.uid)}
                    className={`shrink-0 px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all ${isRestricted ? "bg-red-500/10 text-red-500 hover:bg-red-500/20 border border-red-500/20 shadow-[0_0_15px_rgba(239,68,68,0.15)]" : "bg-white/5 text-zinc-300 hover:bg-white/10 border border-white/10" }`}
                  >
                    {isRestricted ? <><FiLock /> Restricted Access</> : <><FiUnlock /> Full Access</>}
                  </button>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
