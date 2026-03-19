"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { getUserProfile, updateUserProfile } from "@/lib/firestore";
import { PublicCard } from "@/components/card/PublicCard";
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, TouchSensor, useSensor, useSensors } from "@dnd-kit/core";
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { FiMenu, FiCheck, FiRefreshCw, FiArrowLeft, FiLayout, FiDroplet } from "react-icons/fi";
import Link from "next/link";
import toast from "react-hot-toast";

// Draggable item component
function SortableItem({ id, title, icon }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 10 : 1,
    opacity: isDragging ? 0.8 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex items-center gap-3 p-4 rounded-xl border mb-3 transition-colors ${
        isDragging ? "bg-zinc-800 border-blue-500 shadow-xl" : "bg-zinc-900 border-white/10 hover:bg-zinc-800/80"
      }`}
    >
      <div 
        {...attributes} 
        {...listeners}
        className="cursor-grab active:cursor-grabbing p-1 text-zinc-500 hover:text-white"
      >
        <FiMenu />
      </div>
      <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-zinc-400">
        {icon}
      </div>
      <span className="font-medium text-sm">{title}</span>
    </div>
  );
}

const SECTION_MAP = {
  header: { title: "Profile Header", icon: "👤" },
  contact: { title: "Contact Buttons", icon: "✉️" },
  socials: { title: "Social Links", icon: "🌐" },
};

const ACCENT_COLORS = [
  "#3b82f6", "#8b5cf6", "#ec4899", "#ef4444",
  "#f97316", "#eab308", "#22c55e", "#06b6d4",
  "#6366f1", "#d946ef", "#f43f5e", "#14b8a6",
];

export default function CardPreview() {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState("layout"); // "layout" | "design"
  const [items, setItems] = useState(["header", "contact", "socials"]);
  const [accentColor, setAccentColor] = useState("#3b82f6");
  const [cardBg, setCardBg] = useState("#000000");

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 200, tolerance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  useEffect(() => {
    async function loadData() {
      if (user?.uid) {
        const data = await getUserProfile(user.uid);
        setProfile(data);
        if (data.settings?.layoutOrder) setItems(data.settings.layoutOrder);
        if (data.settings?.accentColor) setAccentColor(data.settings.accentColor);
        if (data.settings?.cardBackground) setCardBg(data.settings.cardBackground);
      }
      setLoading(false);
    }
    loadData();
  }, [user]);

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      setItems((items) => {
        const oldIndex = items.indexOf(active.id);
        const newIndex = items.indexOf(over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateUserProfile(user.uid, {
        settings: {
          ...profile.settings,
          layoutOrder: items,
          accentColor,
          cardBackground: cardBg
        }
      });
      toast.success("Card layout saved!");
      
      // Update local profile state to re-render PublicCard
      setProfile(prev => ({
        ...prev,
        settings: {
          ...prev.settings,
          layoutOrder: items,
          accentColor,
          cardBackground: cardBg
        }
      }));
    } catch (err) {
      console.error(err);
      toast.error("Failed to save layout");
    } finally {
      setSaving(false);
    }
  };

  if (loading || !profile) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // Live preview version of profile using current drag state and colors
  const previewProfile = {
    ...profile,
    settings: {
      ...profile.settings,
      layoutOrder: items,
      accentColor,
      cardBackground: cardBg
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <Link href="/dashboard" className="text-zinc-400 hover:text-white flex items-center gap-2 mb-2 text-sm transition-colors">
            <FiArrowLeft /> Back to Dashboard
          </Link>
          <h1 className="text-3xl font-bold font-mono tracking-tight text-white mb-1">Card Builder</h1>
          <p className="text-zinc-400">Drag and drop sections to customize your public card.</p>
        </div>
        
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-6 py-2.5 bg-white text-black hover:bg-zinc-200 rounded-xl font-semibold transition-colors disabled:opacity-50 shadow-xl shadow-white/10"
        >
          {saving ? <FiRefreshCw className="animate-spin" /> : <FiCheck />}
          <span>{saving ? "Saving..." : "Save Layout"}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start pt-4">
        
        {/* Left Side: Builder Panels */}
        <div className="lg:col-span-5 bg-black border border-white/5 rounded-3xl p-6 lg:sticky lg:top-8 shadow-2xl">
          
          <div className="flex bg-zinc-900 rounded-xl p-1 mb-6 border border-white/5">
            <button
              onClick={() => setActiveTab("layout")}
              className={`flex-1 py-2.5 rounded-lg text-sm font-semibold flex items-center justify-center gap-2 transition-all ${
                activeTab === "layout" ? "bg-zinc-800 text-white shadow" : "text-zinc-500 hover:text-white"
              }`}
            >
              <FiLayout /> Layout
            </button>
            <button
              onClick={() => setActiveTab("design")}
              className={`flex-1 py-2.5 rounded-lg text-sm font-semibold flex items-center justify-center gap-2 transition-all ${
                activeTab === "design" ? "bg-zinc-800 text-white shadow" : "text-zinc-500 hover:text-white"
              }`}
            >
              <FiDroplet /> Design
            </button>
          </div>
          
          {activeTab === "layout" && (
            <div className="space-y-4 animate-in fade-in zoom-in-95 duration-200">
              <h3 className="font-semibold text-zinc-300">Section Order</h3>
              <DndContext 
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
              >
                <SortableContext items={items} strategy={verticalListSortingStrategy}>
                  {items.map(id => (
                    <SortableItem key={id} id={id} title={SECTION_MAP[id]?.title || id} icon={SECTION_MAP[id]?.icon || "🔹"} />
                  ))}
                </SortableContext>
              </DndContext>
            </div>
          )}

          {activeTab === "design" && (
            <div className="space-y-8 animate-in fade-in zoom-in-95 duration-200">
              {/* Accent Color */}
              <div>
                <label className="text-sm font-semibold text-zinc-300 mb-3 block">Accent Color</label>
                <div className="flex flex-wrap gap-2.5">
                  {ACCENT_COLORS.map((c) => (
                    <button
                      key={c}
                      onClick={() => setAccentColor(c)}
                      className={`w-9 h-9 rounded-full transition-all duration-200 border-2 hover:scale-110
                        ${accentColor === c ? "border-white scale-110 ring-2 ring-white/20" : "border-transparent"}`}
                      style={{ background: c }}
                    />
                  ))}
                  <label className="relative w-9 h-9 rounded-full overflow-hidden border-2 border-dashed border-zinc-600 cursor-pointer hover:border-zinc-400 transition-colors flex items-center justify-center">
                    <span className="text-xs text-zinc-500">+</span>
                    <input type="color" value={accentColor} onChange={(e) => setAccentColor(e.target.value)} className="absolute inset-0 opacity-0 cursor-pointer" />
                  </label>
                </div>
              </div>

              {/* Card Background */}
              <div className="pt-2">
                <label className="text-sm font-semibold text-zinc-300 mb-3 block">Card Background</label>
                <div className="flex gap-2.5">
                  {["#000000", "#09090b", "#18181b", "#1c1917", "#0c0a09", "#0f172a"].map((c) => (
                    <button
                      key={c}
                      onClick={() => setCardBg(c)}
                      className={`w-10 h-10 rounded-xl transition-all duration-200 border-2 shadow-inner
                        ${cardBg === c ? "border-white scale-105" : "border-zinc-700 hover:border-zinc-500"}`}
                      style={{ background: c }}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}

          <div className="mt-8 p-4 bg-blue-500/5 border border-blue-500/20 rounded-xl flex gap-3 text-blue-400">
            <span className="text-lg">✨</span>
            <p className="text-sm">
              Changes are reflected live in the preview. Don't forget to save when you're done!
            </p>
          </div>
        </div>

        {/* Right Side: Live Card Preview */}
        <div className="lg:col-span-7 flex justify-center">
          <div className="w-full max-w-md pointer-events-none scale-95 md:scale-100 origin-top">
            <div className="mb-4 text-center">
              <span className="text-xs uppercase tracking-widest font-mono text-zinc-500 bg-zinc-900 px-3 py-1 rounded-full border border-zinc-800">Live Preview</span>
            </div>
            {/* Pass viewer=null so "Save Card" button is hidden in preview */}
            <PublicCard profile={previewProfile} viewer={null} />
          </div>
        </div>

      </div>
    </div>
  );
}
