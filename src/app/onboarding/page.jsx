"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { updateUserProfile } from "@/lib/firestore";
import { useRouter } from "next/navigation";
import { FiArrowRight, FiArrowLeft, FiCamera, FiCheck, FiUpload } from "react-icons/fi";
import toast from "react-hot-toast";

/** Compress a base64 image to a given max dimension */
function compressImage(base64, maxSize = 256) {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      let w = img.width, h = img.height;
      if (w > h) { h = (maxSize * h) / w; w = maxSize; }
      else { w = (maxSize * w) / h; h = maxSize; }
      canvas.width = w;
      canvas.height = h;
      canvas.getContext("2d").drawImage(img, 0, 0, w, h);
      resolve(canvas.toDataURL("image/webp", 0.8));
    };
    img.src = base64;
  });
}

const TEMPLATES = [
  { id: "default", name: "Modern", desc: "Clean dark glassmorphism", accent: "#3b82f6", preview: "from-blue-500/20 to-purple-500/20" },
  { id: "business", name: "Business", desc: "Professional & polished", accent: "#71717a", preview: "from-zinc-700/30 to-zinc-900/30" },
  { id: "creator", name: "Creator", desc: "Vibrant & expressive", accent: "#d946ef", preview: "from-fuchsia-500/20 to-pink-500/20" },
  { id: "developer", name: "Developer", desc: "Terminal-inspired", accent: "#22c55e", preview: "from-green-500/20 to-emerald-500/20" },
  { id: "minimal", name: "Minimal", desc: "Less is more", accent: "#ffffff", preview: "from-white/5 to-white/10" },
  { id: "sunset", name: "Sunset", desc: "Warm, golden tones", accent: "#f97316", preview: "from-orange-500/20 to-amber-500/20" },
  { id: "ocean", name: "Ocean", desc: "Deep sea vibes", accent: "#06b6d4", preview: "from-cyan-500/20 to-blue-500/20" },
  { id: "neon", name: "Neon", desc: "Electric nightlife", accent: "#a855f7", preview: "from-purple-500/20 to-pink-500/20" },
];

const ACCENT_COLORS = [
  "#3b82f6", "#8b5cf6", "#ec4899", "#ef4444",
  "#f97316", "#eab308", "#22c55e", "#06b6d4",
  "#6366f1", "#d946ef", "#f43f5e", "#14b8a6",
];

const STEPS = ["Welcome", "Template", "Customize", "Profile", "Preview"];

export default function OnboardingPage() {
  const { user } = useAuth();
  const router = useRouter();
  const fileInputRef = useRef(null);

  const [step, setStep] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  const [avatar, setAvatar] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [template, setTemplate] = useState("default");
  const [accentColor, setAccentColor] = useState("#3b82f6");
  const [cardBg, setCardBg] = useState("#000000");
  const [formData, setFormData] = useState({
    name: user?.displayName || "",
    role: "",
    bio: "",
    email: user?.email || "",
    phone: "",
    twitter: "",
    linkedin: "",
    github: "",
    instagram: "",
    website: "",
  });

  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setAvatar(file);
    const reader = new FileReader();
    reader.onloadend = () => setAvatarPreview(reader.result);
    reader.readAsDataURL(file);
  };

  const handleFinish = async () => {
    if (!user?.uid) return;
    setSaving(true);

    try {
      // Use the base64 preview directly (already read by FileReader)
      let photoURL = avatarPreview || user.photoURL || "";

      // Compress if it's a new upload (base64 images can be large)
      if (avatar && avatarPreview) {
        photoURL = await compressImage(avatarPreview, 256);
      }

      const username = formData.name.toLowerCase().replace(/[^a-z0-9]/g, "") + Math.random().toString(36).substring(2, 6);

      await updateUserProfile(user.uid, {
        username,
        photoURL,
        onboardingComplete: true,
        identityMode: "personal",
        publicData: {
          name: formData.name,
          role: formData.role,
          bio: formData.bio,
          socialLinks: {
            twitter: formData.twitter,
            linkedin: formData.linkedin,
            github: formData.github,
            instagram: formData.instagram,
            website: formData.website,
          },
        },
        privateData: {
          emails: [formData.email],
          phones: formData.phone ? [formData.phone] : [],
        },
        settings: {
          template,
          accentColor,
          cardBackground: cardBg,
          profileVisibility: "public",
        },
        analytics: { views: 0, scans: 0, linkClicks: 0 },
        savedUsers: [],
        recentlyViewed: [],
        scanHistory: [],
      });

      toast.success("Your Cardix is ready! 🎉");
      router.push("/dashboard");
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong. Try again.");
    } finally {
      setSaving(false);
    }
  };

  const next = () => setStep((s) => Math.min(s + 1, STEPS.length - 1));
  const prev = () => setStep((s) => Math.max(s - 1, 0));

  const slideVariants = {
    enter: (dir) => ({ x: dir > 0 ? 300 : -300, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir) => ({ x: dir > 0 ? -300 : 300, opacity: 0 }),
  };

  const [direction, setDirection] = useState(1);
  const goNext = () => { setDirection(1); next(); };
  const goPrev = () => { setDirection(-1); prev(); };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full blur-[128px]" style={{ background: `${accentColor}15` }} />
        <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] bg-purple-600/10 rounded-full blur-[128px]" />
      </div>

      {/* Progress Bar */}
      <div className="fixed top-0 left-0 right-0 h-1 bg-zinc-900 z-50">
        <motion.div
          className="h-full rounded-r-full"
          style={{ background: `linear-gradient(to right, ${accentColor}, #a855f7)` }}
          animate={{ width: `${((step + 1) / STEPS.length) * 100}%` }}
          transition={{ duration: 0.5 }}
        />
      </div>

      {/* Step indicator */}
      <div className="relative z-10 flex items-center gap-2 mb-8">
        {STEPS.map((s, i) => (
          <div key={s} className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300
              ${i < step ? "bg-emerald-500 text-white" : i === step ? "border-2 text-white" : "bg-zinc-800 text-zinc-500"}`}
              style={i === step ? { borderColor: accentColor } : {}}
            >
              {i < step ? <FiCheck /> : i + 1}
            </div>
            {i < STEPS.length - 1 && <div className={`w-8 h-0.5 ${i < step ? "bg-emerald-500" : "bg-zinc-800"}`} />}
          </div>
        ))}
      </div>

      {/* Step Content */}
      <div className="relative z-10 w-full max-w-2xl">
        <AnimatePresence custom={direction} mode="wait">
          <motion.div
            key={step}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.3 }}
          >
            {/* STEP 0: Welcome */}
            {step === 0 && (
              <div className="text-center space-y-8">
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", delay: 0.2 }}>
                  <img src="/logo.png" alt="Cardix Logo" className="w-32 h-32 mx-auto object-contain drop-shadow-[0_0_30px_rgba(59,130,246,0.5)]" />
                </motion.div>
                <h1 className="text-4xl md:text-5xl font-bold font-mono tracking-tight">
                  Welcome to <span className="text-gradient">Cardix</span>
                </h1>
                <p className="text-lg text-zinc-400 max-w-md mx-auto">
                  Let&apos;s set up your digital identity in just a few steps.
                </p>

                {/* Avatar Upload */}
                <div className="flex flex-col items-center gap-4">
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="relative w-28 h-28 rounded-full bg-zinc-900 border-2 border-dashed border-zinc-700 hover:border-blue-500/50 flex items-center justify-center overflow-hidden group transition-all"
                  >
                    {avatarPreview ? (
                      <img src={avatarPreview} alt="Avatar" className="w-full h-full object-cover" />
                    ) : (
                      <div className="flex flex-col items-center gap-1 text-zinc-500 group-hover:text-blue-400 transition-colors">
                        <FiCamera className="text-2xl" />
                        <span className="text-xs">Add Photo</span>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                      <FiUpload className="text-white text-xl" />
                    </div>
                  </button>
                  <input ref={fileInputRef} type="file" accept="image/*" onChange={handleAvatarChange} className="hidden" />
                  <p className="text-xs text-zinc-500">Upload a profile photo (optional)</p>
                </div>
              </div>
            )}

            {/* STEP 1: Template */}
            {step === 1 && (
              <div className="space-y-6">
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold font-mono">Choose Your Style</h2>
                  <p className="text-zinc-400 mt-2">Pick a template that represents you</p>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {TEMPLATES.map((t) => (
                    <button
                      key={t.id}
                      onClick={() => { setTemplate(t.id); setAccentColor(t.accent); }}
                      className={`relative group rounded-2xl p-4 text-left transition-all duration-300 border
                        ${template === t.id
                          ? "border-white/30 bg-white/10 scale-105 shadow-xl"
                          : "border-white/5 bg-white/5 hover:bg-white/10 hover:border-white/10"}`}
                    >
                      {template === t.id && (
                        <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center">
                          <FiCheck className="text-xs" />
                        </div>
                      )}
                      <div className={`w-full h-20 rounded-xl bg-gradient-to-br ${t.preview} border border-white/5 mb-3`} />
                      <p className="font-semibold text-sm">{t.name}</p>
                      <p className="text-xs text-zinc-500">{t.desc}</p>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* STEP 2: Customize */}
            {step === 2 && (
              <div className="space-y-8">
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold font-mono">Customize Your Card</h2>
                  <p className="text-zinc-400 mt-2">Fine-tune colors and accents</p>
                </div>

                {/* Live Preview Mini Card */}
                <div className="mx-auto w-64 rounded-2xl p-5 border border-white/10 transition-all duration-500" style={{ background: `linear-gradient(135deg, ${cardBg}, ${accentColor}15)`, borderColor: `${accentColor}30` }}>
                  <div className="w-14 h-14 rounded-full mb-3 overflow-hidden" style={{ background: `linear-gradient(135deg, ${accentColor}, ${accentColor}80)` }}>
                    {avatarPreview && <img src={avatarPreview} className="w-full h-full object-cover" alt="" />}
                  </div>
                  <div className="h-3 w-24 rounded-full mb-2" style={{ background: accentColor }} />
                  <div className="h-2 w-32 bg-zinc-700 rounded-full mb-1" />
                  <div className="h-2 w-20 bg-zinc-800 rounded-full" />
                </div>

                {/* Accent Color */}
                <div>
                  <label className="text-sm font-medium text-zinc-300 mb-3 block">Accent Color</label>
                  <div className="flex flex-wrap gap-3">
                    {ACCENT_COLORS.map((c) => (
                      <button
                        key={c}
                        onClick={() => setAccentColor(c)}
                        className={`w-10 h-10 rounded-full transition-all duration-200 border-2 hover:scale-110
                          ${accentColor === c ? "border-white scale-110 ring-2 ring-white/20" : "border-transparent"}`}
                        style={{ background: c }}
                      />
                    ))}
                    <label className="relative w-10 h-10 rounded-full overflow-hidden border-2 border-dashed border-zinc-600 cursor-pointer hover:border-zinc-400 transition-colors flex items-center justify-center">
                      <span className="text-xs text-zinc-500">+</span>
                      <input type="color" value={accentColor} onChange={(e) => setAccentColor(e.target.value)} className="absolute inset-0 opacity-0 cursor-pointer" />
                    </label>
                  </div>
                </div>

                {/* Card Background */}
                <div>
                  <label className="text-sm font-medium text-zinc-300 mb-3 block">Card Background</label>
                  <div className="flex gap-3">
                    {["#000000", "#09090b", "#18181b", "#1c1917", "#0c0a09", "#0f172a"].map((c) => (
                      <button
                        key={c}
                        onClick={() => setCardBg(c)}
                        className={`w-10 h-10 rounded-full transition-all duration-200 border-2
                          ${cardBg === c ? "border-white scale-110" : "border-zinc-700"}`}
                        style={{ background: c }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* STEP 3: Profile Info */}
            {step === 3 && (
              <div className="space-y-6">
                <div className="text-center mb-6">
                  <h2 className="text-3xl font-bold font-mono">Fill Your Card</h2>
                  <p className="text-zinc-400 mt-2">Add details to your identity</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { key: "name", label: "Full Name", placeholder: "John Doe", full: true },
                    { key: "role", label: "Title / Role", placeholder: "Software Engineer" },
                    { key: "email", label: "Email", placeholder: "you@example.com" },
                    { key: "phone", label: "Phone", placeholder: "+1 234 567 890" },
                    { key: "bio", label: "Bio", placeholder: "A short intro about you...", full: true },
                    { key: "twitter", label: "Twitter URL", placeholder: "https://twitter.com/you" },
                    { key: "linkedin", label: "LinkedIn URL", placeholder: "https://linkedin.com/in/you" },
                    { key: "github", label: "GitHub URL", placeholder: "https://github.com/you" },
                    { key: "instagram", label: "Instagram URL", placeholder: "https://instagram.com/you" },
                    { key: "website", label: "Website", placeholder: "https://yoursite.com" },
                  ].map((field) => (
                    <div key={field.key} className={field.full ? "md:col-span-2" : ""}>
                      <label className="block text-xs font-medium text-zinc-400 mb-1.5">{field.label}</label>
                      {field.key === "bio" ? (
                        <textarea
                          value={formData[field.key]}
                          onChange={(e) => setFormData({ ...formData, [field.key]: e.target.value })}
                          placeholder={field.placeholder}
                          rows={3}
                          className="w-full bg-zinc-900/50 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:ring-2 focus:ring-blue-500/50 focus:outline-none resize-none"
                        />
                      ) : (
                        <input
                          type="text"
                          value={formData[field.key]}
                          onChange={(e) => setFormData({ ...formData, [field.key]: e.target.value })}
                          placeholder={field.placeholder}
                          className="w-full bg-zinc-900/50 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:ring-2 focus:ring-blue-500/50 focus:outline-none"
                        />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* STEP 4: Preview */}
            {step === 4 && (
              <div className="space-y-8">
                <div className="text-center mb-4">
                  <h2 className="text-3xl font-bold font-mono">Your Card Preview</h2>
                  <p className="text-zinc-400 mt-2">Here&apos;s how your Cardix will look</p>
                </div>

                {/* Full Preview Card */}
                <div
                  className="mx-auto max-w-sm rounded-[2rem] p-6 border transition-all duration-500"
                  style={{ background: `linear-gradient(145deg, ${cardBg}, ${accentColor}10)`, borderColor: `${accentColor}25` }}
                >
                  <div className="flex items-start gap-4 mb-6">
                    <div className="w-20 h-20 rounded-full overflow-hidden shrink-0 ring-2" style={{ ringColor: accentColor }}>
                      {avatarPreview ? (
                        <img src={avatarPreview} className="w-full h-full object-cover" alt="" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-2xl font-bold" style={{ background: `${accentColor}30`, color: accentColor }}>
                          {formData.name?.[0] || "?"}
                        </div>
                      )}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold">{formData.name || "Your Name"}</h3>
                      <p className="text-sm" style={{ color: accentColor }}>{formData.role || "Your Role"}</p>
                    </div>
                  </div>
                  {formData.bio && <p className="text-sm text-zinc-400 mb-6">{formData.bio}</p>}
                  <div className="flex gap-2 flex-wrap">
                    {formData.email && (
                      <span className="px-3 py-1.5 rounded-full text-xs border border-white/10 bg-white/5">✉ Email</span>
                    )}
                    {formData.phone && (
                      <span className="px-3 py-1.5 rounded-full text-xs border border-white/10 bg-white/5">📱 Phone</span>
                    )}
                    {formData.twitter && (
                      <span className="px-3 py-1.5 rounded-full text-xs border border-white/10 bg-white/5">𝕏 Twitter</span>
                    )}
                    {formData.linkedin && (
                      <span className="px-3 py-1.5 rounded-full text-xs border border-white/10 bg-white/5">💼 LinkedIn</span>
                    )}
                    {formData.github && (
                      <span className="px-3 py-1.5 rounded-full text-xs border border-white/10 bg-white/5">⌨ GitHub</span>
                    )}
                  </div>
                  <div className="mt-6 pt-4 border-t border-white/5 text-center">
                    <span className="text-[10px] text-zinc-600 font-mono uppercase tracking-widest">Powered by Cardix</span>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation */}
      <div className="relative z-10 flex items-center gap-4 mt-10">
        {step > 0 && (
          <button
            onClick={goPrev}
            className="flex items-center gap-2 px-6 py-3 bg-zinc-900 border border-white/10 rounded-full font-medium hover:bg-zinc-800 transition-colors"
          >
            <FiArrowLeft /> Back
          </button>
        )}
        {step < STEPS.length - 1 ? (
          <button
            onClick={goNext}
            className="flex items-center gap-2 px-8 py-3 bg-white text-black rounded-full font-semibold hover:bg-zinc-200 transition-colors shadow-xl shadow-white/10"
          >
            Continue <FiArrowRight />
          </button>
        ) : (
          <button
            onClick={handleFinish}
            disabled={saving || !formData.name}
            className="flex items-center gap-2 px-8 py-3 rounded-full font-semibold transition-all shadow-xl disabled:opacity-50"
            style={{ background: accentColor, color: cardBg === "#000000" ? "white" : "black" }}
          >
            {saving ? (
              <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Creating...</>
            ) : (
              <><FiCheck /> Publish My Cardix</>
            )}
          </button>
        )}
      </div>
    </div>
  );
}
