"use client";

import { useState, useEffect } from "react";
import { GlassCard } from "@/components/ui/GlassCard";
import { BrandedQR } from "@/components/qr/BrandedQR";
import { useAuth } from "@/contexts/AuthContext";
import { getUserProfile } from "@/lib/firestore";

export function QRDisplay({ username }) {
  const { user } = useAuth();
  const [accentColor, setAccentColor] = useState("#3b82f6");

  useEffect(() => {
    async function loadColor() {
      if (user?.uid) {
        const profile = await getUserProfile(user.uid);
        if (profile?.settings?.accentColor) {
          setAccentColor(profile.settings.accentColor);
        }
      }
    }
    loadColor();
  }, [user]);

  return (
    <GlassCard className="flex flex-col items-center p-8" style={{ background: `linear-gradient(to bottom, ${accentColor}08, transparent)` }}>
      <h3 className="text-lg font-semibold mb-6 w-full text-center">Your QR Identity</h3>
      <BrandedQR
        username={username}
        size={180}
        accentColor={accentColor}
      />
    </GlassCard>
  );
}
