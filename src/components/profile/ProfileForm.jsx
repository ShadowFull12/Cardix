"use client";

import { useState } from "react";
import { GlassCard } from "@/components/ui/GlassCard";
import { FiSave, FiUser, FiMail, FiPhone, FiGlobe, FiBriefcase, FiMapPin, FiTwitter, FiLinkedin, FiGithub, FiInstagram } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";

export function ProfileForm({ initialData, onSave, saving, authEmail }) {
  const [formData, setFormData] = useState({
    username: initialData.username || "",
    publicData: {
      name: initialData.publicData?.name || "",
      bio: initialData.publicData?.bio || "",
      role: initialData.publicData?.role || "",
      socialLinks: initialData.publicData?.socialLinks || { twitter: "", linkedin: "", github: "", instagram: "" },
      portfolioLinks: initialData.publicData?.portfolioLinks || [],
    },
    privateData: {
      phones: initialData.privateData?.phones || [""],
      emails: initialData.privateData?.emails || [authEmail],
      address: initialData.privateData?.address || "",
      notes: initialData.privateData?.notes || "",
    },
    settings: {
      profileVisibility: initialData.settings?.profileVisibility || "public",
      theme: initialData.settings?.theme || "dark",
      template: initialData.settings?.template || "default",
    }
  });

  const [activeTab, setActiveTab] = useState("public");

  const handleChange = (section, field, value) => {
    if (!section) {
      setFormData({ ...formData, [field]: value });
    } else {
      setFormData({
        ...formData,
        [section]: { ...formData[section], [field]: value }
      });
    }
  };

  const handleSocialChange = (platform, value) => {
    setFormData({
      ...formData,
      publicData: {
        ...formData.publicData,
        socialLinks: { ...formData.publicData.socialLinks, [platform]: value }
      }
    });
  };

  const handleArrayChange = (section, field, index, value) => {
    const arr = [...formData[section][field]];
    arr[index] = value;
    handleChange(section, field, arr);
  };

  const addArrayItem = (section, field) => {
    handleChange(section, field, [...formData[section][field], ""]);
  };

  const removeArrayItem = (section, field, index) => {
    const arr = formData[section][field].filter((_, i) => i !== index);
    handleChange(section, field, arr);
  };

  const onSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  const tabs = [
    { id: "public", label: "Public Profile", icon: <FiGlobe /> },
    { id: "private", label: "Private Details", icon: <FiUser /> },
    { id: "social", label: "Social Links", icon: <FiTwitter /> },
    { id: "settings", label: "Settings", icon: <FiSave /> }, // Reuse save icon for gear visual similarity or use lucide
  ];

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div className="flex gap-2 p-1 bg-white/5 rounded-full border border-white/10 overflow-x-auto no-scrollbar">
        {tabs.map(tab => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-medium transition-all flex-1 justify-center min-w-[140px]
              ${activeTab === tab.id 
                ? "bg-white text-black shadow-lg" 
                : "text-zinc-400 hover:text-white hover:bg-white/5"}`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      <GlassCard className="p-8" hover={false}>
        <AnimatePresence mode="wait">
          {activeTab === "public" && (
            <motion.div
              key="public"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <h3 className="text-xl font-semibold mb-6">Public Information</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-zinc-400 mb-2">Display Name</label>
                  <div className="relative">
                    <input
                      type="text"
                      value={formData.publicData.name}
                      onChange={(e) => handleChange("publicData", "name", e.target.value)}
                      className="w-full bg-zinc-900/50 border border-white/10 rounded-xl px-4 py-3 pl-10 text-white focus:ring-2 focus:ring-blue-500/50"
                    />
                    <FiUser className="absolute left-3.5 top-3.5 text-zinc-500" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-zinc-400 mb-2">Role / Title</label>
                  <div className="relative">
                    <input
                      type="text"
                      value={formData.publicData.role}
                      onChange={(e) => handleChange("publicData", "role", e.target.value)}
                      className="w-full bg-zinc-900/50 border border-white/10 rounded-xl px-4 py-3 pl-10 text-white focus:ring-2 focus:ring-blue-500/50"
                      placeholder="e.g. Software Engineer, Designer"
                    />
                    <FiBriefcase className="absolute left-3.5 top-3.5 text-zinc-500" />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-2">Username (Unique URL)</label>
                <div className="flex bg-zinc-900/50 border border-white/10 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-blue-500/50">
                  <div className="px-4 py-3 bg-white/5 text-zinc-500 border-r border-white/10 flex items-center">
                    cardix.app/card/
                  </div>
                  <input
                    type="text"
                    value={formData.username}
                    onChange={(e) => handleChange(null, "username", e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, ''))}
                    className="flex-1 bg-transparent px-4 py-3 text-white focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-2">Bio</label>
                <textarea
                  value={formData.publicData.bio}
                  onChange={(e) => handleChange("publicData", "bio", e.target.value)}
                  className="w-full bg-zinc-900/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-blue-500/50 h-32 resize-none"
                  placeholder="Tell people about yourself..."
                />
              </div>
            </motion.div>
          )}

          {activeTab === "private" && (
            <motion.div
              key="private"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-xl font-semibold">Private Details</h3>
                  <p className="text-sm text-zinc-400">This information is only visible to you or when explicitly shared.</p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-2 flex items-center justify-between">
                  Phone Numbers
                  <button type="button" onClick={() => addArrayItem("privateData", "phones")} className="text-blue-400 text-xs hover:text-blue-300">+ Add another</button>
                </label>
                <div className="space-y-3">
                  {formData.privateData.phones.map((phone, i) => (
                    <div key={i} className="flex gap-2">
                      <div className="relative flex-1">
                        <input
                          type="tel"
                          value={phone}
                          onChange={(e) => handleArrayChange("privateData", "phones", i, e.target.value)}
                          className="w-full bg-zinc-900/50 border border-white/10 rounded-xl px-4 py-3 pl-10 text-white focus:ring-2 focus:ring-blue-500/50"
                          placeholder="+1 (555) 000-0000"
                        />
                        <FiPhone className="absolute left-3.5 top-3.5 text-zinc-500" />
                      </div>
                      {formData.privateData.phones.length > 1 && (
                        <button type="button" onClick={() => removeArrayItem("privateData", "phones", i)} className="px-4 bg-red-500/10 text-red-500 rounded-xl hover:bg-red-500/20">X</button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-2 flex items-center justify-between">
                  Email Addresses
                  <button type="button" onClick={() => addArrayItem("privateData", "emails")} className="text-blue-400 text-xs hover:text-blue-300">+ Add another</button>
                </label>
                <div className="space-y-3">
                  {formData.privateData.emails.map((email, i) => (
                    <div key={i} className="flex gap-2">
                      <div className="relative flex-1">
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => handleArrayChange("privateData", "emails", i, e.target.value)}
                          className="w-full bg-zinc-900/50 border border-white/10 rounded-xl px-4 py-3 pl-10 text-white focus:ring-2 focus:ring-blue-500/50"
                        />
                        <FiMail className="absolute left-3.5 top-3.5 text-zinc-500" />
                      </div>
                      {formData.privateData.emails.length > 1 && (
                        <button type="button" onClick={() => removeArrayItem("privateData", "emails", i)} className="px-4 bg-red-500/10 text-red-500 rounded-xl hover:bg-red-500/20">X</button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-2">Address</label>
                <div className="relative">
                  <input
                    type="text"
                    value={formData.privateData.address}
                    onChange={(e) => handleChange("privateData", "address", e.target.value)}
                    className="w-full bg-zinc-900/50 border border-white/10 rounded-xl px-4 py-3 pl-10 text-white focus:ring-2 focus:ring-blue-500/50"
                    placeholder="123 Main St, City, Country"
                  />
                  <FiMapPin className="absolute left-3.5 top-3.5 text-zinc-500" />
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === "social" && (
            <motion.div
              key="social"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <h3 className="text-xl font-semibold mb-6">Social Links</h3>
              
              <div className="space-y-4">
                {[
                  { id: "twitter", icon: <FiTwitter />, label: "Twitter (X) URL", placeholder: "https://twitter.com/username" },
                  { id: "linkedin", icon: <FiLinkedin />, label: "LinkedIn URL", placeholder: "https://linkedin.com/in/username" },
                  { id: "github", icon: <FiGithub />, label: "GitHub URL", placeholder: "https://github.com/username" },
                  { id: "instagram", icon: <FiInstagram />, label: "Instagram URL", placeholder: "https://instagram.com/username" },
                ].map((social) => (
                  <div key={social.id}>
                    <label className="block text-sm font-medium text-zinc-400 mb-2">{social.label}</label>
                    <div className="relative">
                      <input
                        type="url"
                        value={formData.publicData.socialLinks[social.id] || ""}
                        onChange={(e) => handleSocialChange(social.id, e.target.value)}
                        className="w-full bg-zinc-900/50 border border-white/10 rounded-xl px-4 py-3 pl-10 text-white focus:ring-2 focus:ring-blue-500/50"
                        placeholder={social.placeholder}
                      />
                      <div className="absolute left-3.5 top-3.5 text-zinc-500">{social.icon}</div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === "settings" && (
            <motion.div
              key="settings"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <h3 className="text-xl font-semibold mb-6">Card Settings</h3>
              
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-3">Profile Visibility</label>
                <div className="flex gap-4">
                  <label className={`flex-1 p-4 rounded-xl border flex items-center justify-between cursor-pointer transition-colors ${formData.settings.profileVisibility === 'public' ? 'border-blue-500 bg-blue-500/10' : 'border-white/10 bg-white/5 hover:bg-white/10'}`}>
                    <div className="flex items-center gap-3">
                      <FiGlobe className={formData.settings.profileVisibility === 'public' ? 'text-blue-500' : 'text-zinc-500'} />
                      <span className="font-medium">Public</span>
                    </div>
                    <input 
                      type="radio" 
                      name="visibility" 
                      value="public"
                      checked={formData.settings.profileVisibility === 'public'}
                      onChange={() => handleChange('settings', 'profileVisibility', 'public')}
                      className="hidden" 
                    />
                    <div className={`w-4 h-4 rounded-full border ${formData.settings.profileVisibility === 'public' ? 'border-4 border-blue-500 bg-white' : 'border-zinc-500'}`} />
                  </label>

                  <label className={`flex-1 p-4 rounded-xl border flex items-center justify-between cursor-pointer transition-colors ${formData.settings.profileVisibility === 'private' ? 'border-purple-500 bg-purple-500/10' : 'border-white/10 bg-white/5 hover:bg-white/10'}`}>
                    <div className="flex items-center gap-3">
                      <Lock className={formData.settings.profileVisibility === 'private' ? 'text-purple-500' : 'text-zinc-500'} />
                      <span className="font-medium">Private</span>
                    </div>
                    <input 
                      type="radio" 
                      name="visibility" 
                      value="private"
                      checked={formData.settings.profileVisibility === 'private'}
                      onChange={() => handleChange('settings', 'profileVisibility', 'private')}
                      className="hidden" 
                    />
                    <div className={`w-4 h-4 rounded-full border ${formData.settings.profileVisibility === 'private' ? 'border-4 border-purple-500 bg-white' : 'border-zinc-500'}`} />
                  </label>
                </div>
                <p className="text-xs text-zinc-500 mt-2">Private profiles won't appear in Discover or search results.</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-3">Card Template</label>
                <select
                  value={formData.settings.template}
                  onChange={(e) => handleChange("settings", "template", e.target.value)}
                  className="w-full bg-zinc-900/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-blue-500/50 appearance-none"
                >
                  <option value="default">Default Modern</option>
                  <option value="business">Business Professional</option>
                  <option value="creator">Content Creator</option>
                  <option value="developer">Developer minimal</option>
                </select>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="mt-10 pt-6 border-t border-white/10 flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 py-3 px-8 bg-white text-black font-semibold rounded-xl hover:bg-zinc-200 transition-colors disabled:opacity-50"
          >
            {saving ? (
              <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
            ) : (
              <FiSave />
            )}
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </GlassCard>
    </form>
  );
}

// Temporary import placeholder for Lock icon used in rendering
import { Lock } from "lucide-react";
