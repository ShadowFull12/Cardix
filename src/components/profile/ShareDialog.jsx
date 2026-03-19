"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiShare2, FiLink, FiClock, FiMinimize2, FiMaximize2, FiX, FiCopy, FiCheck } from "react-icons/fi";
import { generateShareUrl, createTempShareLink, downloadVCard, shareProfile } from "@/lib/sharing";
import toast from "react-hot-toast";

export function ShareDialog({ isOpen, onClose, profile }) {
  const [activeTab, setActiveTab] = useState("smart");
  const [tempLink, setTempLink] = useState(null);
  const [creating, setCreating] = useState(false);
  const [copied, setCopied] = useState(null);

  if (!isOpen) return null;

  const copyToClipboard = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    toast.success("Copied to clipboard!");
    setTimeout(() => setCopied(null), 2000);
  };

  const handleTempLink = async (minutes) => {
    setCreating(true);
    try {
      const result = await createTempShareLink(profile.uid, minutes);
      setTempLink(result);
      toast.success(`Temporary link created (expires in ${minutes} min)`);
    } catch {
      toast.error("Failed to create temporary link");
    } finally {
      setCreating(false);
    }
  };

  const handleNativeShare = () => {
    shareProfile(profile.username, profile.publicData?.name || "User");
  };

  const handleDownloadContact = () => {
    downloadVCard(profile);
    toast.success("Contact card downloaded!");
  };

  const shareOptions = [
    {
      id: "full",
      label: "Full Profile",
      desc: "Share your complete public card",
      icon: <FiMaximize2 />,
      url: generateShareUrl(profile.username, "full"),
    },
    {
      id: "minimal",
      label: "Minimal",
      desc: "Just name and contact info",
      icon: <FiMinimize2 />,
      url: generateShareUrl(profile.username, "minimal"),
    },
    {
      id: "contact",
      label: "Contact Only",
      desc: "Phone and email only",
      icon: <FiLink />,
      url: generateShareUrl(profile.username, "contact"),
    },
  ];

  return (
    <AnimatePresence>
      <motion.div
        key="overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          key="dialog"
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-md glass rounded-3xl p-6 border border-white/10"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold flex items-center gap-2">
              <FiShare2 className="text-blue-400" /> Share Profile
            </h3>
            <button onClick={onClose} className="p-2 rounded-full hover:bg-white/10 transition-colors">
              <FiX />
            </button>
          </div>

          {/* Tab switcher */}
          <div className="flex gap-1 p-1 bg-white/5 rounded-full mb-6 border border-white/10">
            {[
              { id: "smart", label: "Smart Share" },
              { id: "temp", label: "Temporary" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 px-4 py-2 rounded-full text-sm font-medium transition-all
                  ${activeTab === tab.id ? "bg-white text-black" : "text-zinc-400 hover:text-white"}`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {activeTab === "smart" && (
            <div className="space-y-3">
              {shareOptions.map((opt) => (
                <div
                  key={opt.id}
                  className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-500/10 rounded-lg text-blue-400">{opt.icon}</div>
                    <div>
                      <p className="font-medium text-sm">{opt.label}</p>
                      <p className="text-xs text-zinc-500">{opt.desc}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => copyToClipboard(opt.url, opt.id)}
                    className="p-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 transition-colors"
                  >
                    {copied === opt.id ? <FiCheck className="text-green-400" /> : <FiCopy className="text-zinc-400" />}
                  </button>
                </div>
              ))}

              <div className="grid grid-cols-2 gap-3 pt-3">
                <button
                  onClick={handleNativeShare}
                  className="py-3 bg-white text-black font-semibold rounded-xl hover:bg-zinc-200 transition-colors text-sm"
                >
                  Share via...
                </button>
                <button
                  onClick={handleDownloadContact}
                  className="py-3 bg-white/5 border border-white/10 text-white font-medium rounded-xl hover:bg-white/10 transition-colors text-sm"
                >
                  Save Contact
                </button>
              </div>
            </div>
          )}

          {activeTab === "temp" && (
            <div className="space-y-4">
              <p className="text-sm text-zinc-400">
                Create a time-limited share link that auto-expires.
              </p>
              <div className="grid grid-cols-3 gap-3">
                {[15, 30, 60].map((min) => (
                  <button
                    key={min}
                    onClick={() => handleTempLink(min)}
                    disabled={creating}
                    className="py-3 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-colors text-sm font-medium flex flex-col items-center gap-1"
                  >
                    <FiClock className="text-purple-400" />
                    {min} min
                  </button>
                ))}
              </div>

              {tempLink && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 rounded-xl bg-purple-500/10 border border-purple-500/20"
                >
                  <p className="text-xs text-purple-300 mb-2">
                    Expires: {new Date(tempLink.expiresAt).toLocaleTimeString()}
                  </p>
                  <div className="flex gap-2">
                    <input
                      readOnly
                      value={tempLink.url}
                      className="flex-1 bg-black/30 border border-white/10 rounded-lg px-3 py-2 text-xs text-white"
                    />
                    <button
                      onClick={() => copyToClipboard(tempLink.url, "temp")}
                      className="px-3 py-2 bg-purple-500 text-white rounded-lg text-xs font-medium"
                    >
                      {copied === "temp" ? "Copied!" : "Copy"}
                    </button>
                  </div>
                </motion.div>
              )}
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
