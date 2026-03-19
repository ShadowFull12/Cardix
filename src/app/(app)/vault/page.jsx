"use client";

import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { PersonalVault } from "@/components/vault/PersonalVault";
import { NotesEditor } from "@/components/vault/NotesEditor";
import { FiHardDrive, FiFileText } from "react-icons/fi";

export default function VaultPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("files"); // "files" | "notes"

  if (!user) return null;

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold font-mono tracking-tight text-white mb-2">My Vault</h1>
          <p className="text-zinc-400">Secure cloud storage for your files, images, and notes.</p>
        </div>
      </div>

      {/* Tab Switcher */}
      <div className="flex bg-zinc-900 rounded-xl p-1 max-w-xs border border-white/5">
        <button
          onClick={() => setActiveTab("files")}
          className={`flex-1 py-2.5 rounded-lg text-sm font-semibold flex items-center justify-center gap-2 transition-all ${
            activeTab === "files" ? "bg-zinc-800 text-white shadow" : "text-zinc-500 hover:text-white"
          }`}
        >
          <FiHardDrive /> Files
        </button>
        <button
          onClick={() => setActiveTab("notes")}
          className={`flex-1 py-2.5 rounded-lg text-sm font-semibold flex items-center justify-center gap-2 transition-all ${
            activeTab === "notes" ? "bg-zinc-800 text-white shadow" : "text-zinc-500 hover:text-white"
          }`}
        >
          <FiFileText /> Notes
        </button>
      </div>

      {activeTab === "files" && <PersonalVault />}
      {activeTab === "notes" && <NotesEditor />}
    </div>
  );
}
