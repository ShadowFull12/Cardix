"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiBriefcase, FiUser } from "react-icons/fi";
import { updateUserProfile } from "@/lib/firestore";
import { useAuth } from "@/contexts/AuthContext";
import toast from "react-hot-toast";

export function IdentityModeSwitch({ currentMode = "personal", onModeChange }) {
  const { user } = useAuth();
  const [mode, setMode] = useState(currentMode);
  const [switching, setSwitching] = useState(false);

  const modes = [
    { id: "personal", label: "Personal", icon: FiUser, color: "from-blue-500 to-cyan-400", desc: "Social & casual" },
    { id: "work", label: "Work", icon: FiBriefcase, color: "from-purple-500 to-pink-500", desc: "Professional" },
  ];

  const handleSwitch = async (newMode) => {
    if (newMode === mode || switching) return;
    setSwitching(true);
    try {
      await updateUserProfile(user.uid, { identityMode: newMode });
      setMode(newMode);
      onModeChange?.(newMode);
      toast.success(`Switched to ${newMode === "work" ? "Work" : "Personal"} mode`);
    } catch {
      toast.error("Failed to switch mode");
    } finally {
      setSwitching(false);
    }
  };

  return (
    <div className="flex gap-3 p-1.5 bg-white/5 rounded-2xl border border-white/10">
      {modes.map((m) => {
        const isActive = mode === m.id;
        return (
          <button
            key={m.id}
            onClick={() => handleSwitch(m.id)}
            disabled={switching}
            className={`relative flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300
              ${isActive ? "text-white" : "text-zinc-500 hover:text-zinc-300"}`}
          >
            {isActive && (
              <motion.div
                layoutId="mode-bg"
                className={`absolute inset-0 bg-gradient-to-r ${m.color} rounded-xl opacity-20`}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              />
            )}
            <m.icon className="relative z-10" />
            <span className="relative z-10">{m.label}</span>
          </button>
        );
      })}
    </div>
  );
}
