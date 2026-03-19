"use client";

import { Sidebar } from "./Sidebar";
import { MobileNav } from "./MobileNav";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/contexts/ThemeContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export function AppShell({ children }) {
  const { user, loading } = useAuth();
  const { accent } = useTheme();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.replace('/login');
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="w-8 h-8 border-4 rounded-full animate-spin" style={{ borderColor: accent, borderTopColor: "transparent" }}></div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-black text-white" style={{ "--selection-color": `${accent}4D` }}>
      {/* Background glows using accent color */}
      <div className="fixed top-0 left-1/4 w-96 h-96 rounded-full blur-[128px] pointer-events-none" style={{ background: `${accent}15` }} />
      <div className="fixed bottom-0 right-1/4 w-96 h-96 rounded-full blur-[128px] pointer-events-none" style={{ background: `${accent}10` }} />

      <Sidebar />
      <main className="flex-1 md:ml-64 relative z-10 pb-24 md:pb-0 min-h-screen">
        <div className="max-w-6xl mx-auto p-4 md:p-8 lg:p-10 min-h-full">
          {children}
        </div>
      </main>
      <MobileNav />
    </div>
  );
}
