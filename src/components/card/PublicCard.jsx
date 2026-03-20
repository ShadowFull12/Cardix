"use client";

import { motion } from "framer-motion";
import { 
  FiMail, FiPhone, FiGlobe, FiMapPin, 
  FiGithub, FiTwitter, FiLinkedin, FiInstagram,
  FiBookmark, FiShare2, FiDownload
} from "react-icons/fi";
import { saveCard, unsaveCard, incrementLinkClicks } from "@/lib/firestore";
import { downloadVCard } from "@/lib/sharing";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";

export function PublicCard({ profile, viewer, shareMode }) {
  const [isSaved, setIsSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (viewer && viewer.savedUsers?.includes(profile.uid)) {
      setIsSaved(true);
    }
  }, [viewer, profile.uid]);

  const handleSave = async () => {
    if (!viewer) {
      toast.error("You must be logged in to save cards");
      return;
    }
    setSaving(true);
    try {
      if (isSaved) {
        await unsaveCard(viewer.uid, profile.uid);
        setIsSaved(false);
        toast.success("Card removed from your network");
      } else {
        await saveCard(viewer.uid, profile.uid);
        setIsSaved(true);
        toast.success("Card added to your network");
      }
    } catch (error) {
      toast.error("Action failed");
    } finally {
      setSaving(false);
    }
  };

  const shareProfile = () => {
    if (navigator.share) {
      navigator.share({
        title: `${profile.publicData.name}'s Cardix Profile`,
        url: window.location.href,
      }).catch(console.error);
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Profile link copied!");
    }
  };

  const handleSaveContact = () => {
    downloadVCard(profile);
    toast.success("Contact saved! Check your downloads.");
  };

  const handleLinkClick = () => {
    if (profile?.uid) {
      incrementLinkClicks(profile.uid).catch(err => console.error("Failed to track link click", err));
    }
  };

  const ensureAbsoluteUrl = (url) => {
    if (!url) return "";
    if (url.startsWith("http://") || url.startsWith("https://")) return url;
    return `https://${url}`;
  };

  const publicData = profile.publicData || {};
  const socialLinks = publicData.socialLinks || {};
  const privacy = profile.settings?.privacy || {};
  const cardBg = profile.settings?.cardBackground || "#000000";
  const accentColor = profile.settings?.accentColor || "#3b82f6";

  // Data is stored under privateData during onboarding
  const userEmail = profile.privateData?.emails?.[0] || publicData.email || "";
  const userPhone = profile.privateData?.phones?.[0] || "";
  const userLocation = profile.privateData?.location || "";
  const userWebsite = socialLinks.website || publicData.website || "";

  // Share & Privacy modes
  const isRestricted = viewer && profile.settings?.restrictedUsers?.[viewer.uid] === true;
  const isMinimal = shareMode === "minimal" || isRestricted;
  const isContactOnly = shareMode === "contact" && !isRestricted;
  const showHeader = !isContactOnly;
  const showSocials = !isMinimal && !isContactOnly && !isRestricted;

  // Privacy-aware contact data
  const showEmail = !isRestricted && privacy.emailPublic !== false && userEmail;
  const showPhone = !isRestricted && privacy.phonePublic && userPhone;
  const showLocation = !isRestricted && privacy.locationPublic && userLocation;
  const showWebsite = !isRestricted && userWebsite;

  const layoutOrder = profile.settings?.layoutOrder || ["header", "contact", "socials"];

  const renderSection = (sectionId) => {
    switch (sectionId) {
      case "header":
        if (!showHeader) return null;
        return (
          <div className="flex flex-col sm:flex-row gap-6 items-start">
            {/* Avatar */}
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden shrink-0 ring-2 shadow-xl shadow-black/50" style={{ ringColor: `${accentColor}40` }}>
              {profile.photoURL ? (
                <img src={profile.photoURL} className="w-full h-full object-cover" alt="" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-3xl font-bold" style={{ background: `${accentColor}25`, color: accentColor }}>
                  {publicData.name?.[0] || "?"}
                </div>
              )}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0 pt-1">
              <h1 className="text-2xl sm:text-3xl font-bold font-mono tracking-tight text-white mb-1 truncate pr-16 sm:pr-0">
                {publicData.name || "Your Name"}
              </h1>
              <p className="text-sm font-medium mb-3" style={{ color: accentColor }}>
                {publicData.role || "Your Role"}
              </p>
              {!isMinimal && publicData.bio && (
                <p className="text-zinc-400 leading-relaxed text-sm line-clamp-3">
                  {publicData.bio}
                </p>
              )}
              {isRestricted && (
                <div className="mt-3 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-500/10 text-red-500 text-[10px] font-bold uppercase tracking-widest border border-red-500/20">
                  <FiLock className="w-3 h-3" /> Restricted Access
                </div>
              )}
            </div>
          </div>
        );

      case "contact":
        if (isContactOnly && !showHeader) {
          return (
            <div className="space-y-3 py-2">
              <h2 className="text-lg font-bold font-mono mb-4 text-center">Contact Info</h2>
              {showEmail && (
                <a href={`mailto:${userEmail}`} onClick={handleLinkClick} className="w-full flex items-center gap-3 p-3 rounded-xl bg-black/30 border border-white/10 hover:bg-black/50 transition-colors">
                  <FiMail className="text-blue-400" /> <span className="text-sm">{userEmail}</span>
                </a>
              )}
              {showPhone && (
                <a href={`tel:${userPhone}`} onClick={handleLinkClick} className="w-full flex items-center gap-3 p-3 rounded-xl bg-black/30 border border-white/10 hover:bg-black/50 transition-colors">
                  <FiPhone className="text-green-400" /> <span className="text-sm">{userPhone}</span>
                </a>
              )}
            </div>
          );
        }
        return (
          <div className="flex flex-wrap gap-2">
            {showEmail && (
              <a href={`mailto:${userEmail}`} onClick={handleLinkClick} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-black/40 border border-white/10 hover:bg-black/60 transition-colors">
                <FiMail className="text-zinc-400" /> {isContactOnly ? userEmail : "Email"}
              </a>
            )}
            {showPhone && (
              <a href={`tel:${userPhone}`} onClick={handleLinkClick} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-black/40 border border-white/10 hover:bg-black/60 transition-colors">
                <FiPhone className="text-zinc-400" /> {isContactOnly ? userPhone : "Call"}
              </a>
            )}
            {showLocation && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-black/40 border border-white/10">
                <FiMapPin className="text-zinc-400" /> {userLocation}
              </span>
            )}
            {showWebsite && !isContactOnly && (
              <a href={ensureAbsoluteUrl(showWebsite)} target="_blank" rel="noreferrer" onClick={handleLinkClick} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-black/40 border border-white/10 hover:bg-black/60 transition-colors">
                <FiGlobe className="text-zinc-400" /> Website
              </a>
            )}
            <button onClick={handleSaveContact} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-colors hover:bg-black/40" style={{ borderColor: `${accentColor}30`, color: accentColor }}>
              <FiDownload /> Save
            </button>
          </div>
        );

      case "socials":
        if (!showSocials || !Object.values(socialLinks).some(link => link)) return null;
        return (
          <div className="flex flex-wrap gap-2">
            {socialLinks.twitter && (
              <a href={ensureAbsoluteUrl(socialLinks.twitter)} target="_blank" rel="noreferrer" onClick={handleLinkClick} className="w-9 h-9 rounded-full bg-black/40 border border-white/10 flex items-center justify-center hover:bg-[#1DA1F2] hover:border-transparent hover:text-white transition-all">
                <FiTwitter className="text-xs" />
              </a>
            )}
            {socialLinks.linkedin && (
              <a href={ensureAbsoluteUrl(socialLinks.linkedin)} target="_blank" rel="noreferrer" onClick={handleLinkClick} className="w-9 h-9 rounded-full bg-black/40 border border-white/10 flex items-center justify-center hover:bg-[#0A66C2] hover:border-transparent hover:text-white transition-all">
                <FiLinkedin className="text-xs" />
              </a>
            )}
            {socialLinks.github && (
              <a href={ensureAbsoluteUrl(socialLinks.github)} target="_blank" rel="noreferrer" onClick={handleLinkClick} className="w-9 h-9 rounded-full bg-black/40 border border-white/10 flex items-center justify-center hover:bg-white hover:text-black hover:border-transparent transition-all">
                <FiGithub className="text-xs" />
              </a>
            )}
            {socialLinks.instagram && (
              <a href={ensureAbsoluteUrl(socialLinks.instagram)} target="_blank" rel="noreferrer" onClick={handleLinkClick} className="w-9 h-9 rounded-full bg-black/40 border border-white/10 flex items-center justify-center hover:bg-gradient-to-tr from-[#fd5949] to-[#d6249f] hover:border-transparent hover:text-white transition-all">
                <FiInstagram className="text-xs" />
              </a>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.5, type: "spring", damping: 25 }}
      className="w-full max-w-2xl mx-auto rounded-[2rem] border shadow-2xl transition-all duration-500 relative overflow-hidden"
      style={{ 
        background: `linear-gradient(145deg, ${cardBg}, ${accentColor}08)`, 
        borderColor: `${accentColor}20` 
      }}
    >
      {/* Decorative glow */}
      <div className="absolute -top-24 -right-24 w-48 h-48 rounded-full blur-[80px] pointer-events-none" style={{ background: `${accentColor}25` }} />

      {/* Top action buttons */}
      <div className="absolute top-4 right-4 z-20 flex gap-2">
        <button 
          onClick={shareProfile}
          className="w-9 h-9 rounded-full bg-black/50 border border-white/10 flex items-center justify-center hover:bg-black/70 transition-colors backdrop-blur-sm"
        >
          <FiShare2 className="text-zinc-300 text-sm" />
        </button>
        {viewer && (
          <button 
            onClick={handleSave}
            disabled={saving}
            className={`w-9 h-9 rounded-full border flex items-center justify-center transition-colors backdrop-blur-sm
              ${isSaved 
                ? "bg-black/50 text-white" 
                : "bg-black/50 hover:bg-black/70 text-zinc-300"}`}
            style={isSaved ? { borderColor: accentColor, color: accentColor } : { borderColor: "rgba(255,255,255,0.1)" }}
          >
            <FiBookmark className={`text-sm ${isSaved ? "fill-current" : ""}`} />
          </button>
        )}
      </div>

      {/* DYNAMIC CARD LAYOUT */}
      <div className="p-6 lg:p-8 flex flex-col gap-6">
        {layoutOrder.map((sectionId) => (
          <div key={sectionId} className="w-full">
            {renderSection(sectionId)}
          </div>
        ))}
      </div>

      {/* Watermark */}
      <div className="px-6 pb-4 text-center relative z-10">
        <span className="text-[9px] font-mono tracking-widest uppercase text-zinc-600">Powered by Cardix</span>
      </div>
    </motion.div>
  );
}
