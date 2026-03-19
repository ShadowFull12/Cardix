"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { 
  FiHome, FiUser, FiCamera, FiHardDrive, FiGrid,
  FiChevronUp, FiSettings, FiLogOut, FiBarChart2, FiUsers, FiShield
} from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "@/contexts/ThemeContext";
import { useAuth } from "@/contexts/AuthContext";
import { useState } from "react";

const MAIN_NAV = [
  { name: "Home", href: "/dashboard", icon: FiHome },
  { name: "Vault", href: "/vault", icon: FiHardDrive },
  { name: "Scan", href: "/scan", icon: FiCamera, isCenter: true },
  { name: "Card", href: "/card/preview", icon: FiGrid },
  { name: "Profile", href: "/profile", icon: FiUser },
];

export function MobileNav() {
  const pathname = usePathname();
  const { accent } = useTheme();
  const { logout, user } = useAuth();
  const [expanded, setExpanded] = useState(false);

  const isAdmin = user?.role === "admin";
  const isPro = user?.plan === "pro" || user?.plan === "business";

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 px-4 pb-6 pt-2 pointer-events-none">
      <div className="mx-auto max-w-md pointer-events-auto relative">
        
        {/* Expanded Menu */}
        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ opacity: 0, y: 50, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 50, scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
              className="absolute bottom-24 left-0 right-0 p-4 rounded-3xl border border-white/20 shadow-2xl overflow-hidden"
              style={{ background: "rgba(15,15,20,0.85)", backdropFilter: "blur(24px)", WebkitBackdropFilter: "blur(24px)" }}
            >
              <div className="grid grid-cols-3 gap-y-6 gap-x-2 py-2">
                <Link href="/network" onClick={() => setExpanded(false)} className="flex flex-col items-center gap-2">
                  <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-zinc-300">
                    <FiUsers className="text-xl" />
                  </div>
                  <span className="text-[10px] font-medium text-zinc-400">Network</span>
                </Link>
                
                <Link href="/analytics" onClick={() => setExpanded(false)} className="flex flex-col items-center gap-2">
                  <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-zinc-300 relative">
                    <FiBarChart2 className="text-xl" />
                    {!isPro && <div className="absolute top-0 right-0 w-2 h-2 rounded-full bg-amber-500" />}
                  </div>
                  <span className="text-[10px] font-medium text-zinc-400">Analytics</span>
                </Link>

                <Link href="/settings" onClick={() => setExpanded(false)} className="flex flex-col items-center gap-2">
                  <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-zinc-300">
                    <FiSettings className="text-xl" />
                  </div>
                  <span className="text-[10px] font-medium text-zinc-400">Settings</span>
                </Link>

                {isAdmin && (
                  <Link href="/admin" onClick={() => setExpanded(false)} className="flex flex-col items-center gap-2">
                    <div className="w-10 h-10 rounded-full bg-red-500/10 flex items-center justify-center text-red-400">
                      <FiShield className="text-xl" />
                    </div>
                    <span className="text-[10px] font-medium text-red-400">Admin</span>
                  </Link>
                )}

                <button onClick={() => { setExpanded(false); logout(); }} className="flex flex-col items-center gap-2">
                  <div className="w-10 h-10 rounded-full bg-red-500/10 flex items-center justify-center text-red-400">
                    <FiLogOut className="text-xl" />
                  </div>
                  <span className="text-[10px] font-medium text-red-400">Logout</span>
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Nav Bar */}
        <div 
          className="rounded-[2.5rem] px-6 py-3 flex items-center justify-between shadow-[0_8px_32px_rgba(0,0,0,0.5)] border border-white/20 transition-all duration-300"
          style={{ background: "rgba(20,20,25,0.75)", backdropFilter: "blur(32px)", WebkitBackdropFilter: "blur(32px)" }}
        >
          {MAIN_NAV.map((item) => {
            const isActive = pathname === item.href;
            
            if (item.isCenter) {
              return (
                <div key={item.name} className="relative -top-8 flex flex-col items-center">
                  <Link href={item.href} onClick={() => setExpanded(false)}>
                    <div className="w-16 h-16 rounded-full flex items-center justify-center text-white shadow-xl border-4 border-[#121214] z-20 relative"
                      style={{ background: accent, boxShadow: `0 8px 30px ${accent}50` }}
                    >
                      <item.icon className="text-2xl" />
                    </div>
                  </Link>
                  {/* Expand Arrow Trigger */}
                  <button 
                    onClick={() => setExpanded(!expanded)}
                    className="absolute -bottom-5 w-8 h-8 rounded-full bg-[#1a1a20] border border-white/10 flex items-center justify-center text-zinc-400 hover:text-white transition-colors z-10 shadow-lg"
                  >
                    <motion.div animate={{ rotate: expanded ? 180 : 0 }} transition={{ duration: 0.2 }}>
                      <FiChevronUp strokeWidth={3} className="text-sm" />
                    </motion.div>
                  </button>
                </div>
              );
            }

            return (
              <Link key={item.name} href={item.href} onClick={() => setExpanded(false)} className="flex flex-col items-center gap-1 min-w-[3.5rem]">
                <div className="relative p-2.5">
                  {isActive && (
                    <motion.div
                      layoutId="mobile-active"
                      className="absolute inset-0 rounded-2xl"
                      style={{ background: `${accent}25` }}
                      transition={{ type: "spring", stiffness: 400, damping: 35 }}
                    />
                  )}
                  <item.icon className="text-2xl relative z-10 transition-colors" style={isActive ? { color: accent } : { color: "#71717a" }} />
                </div>
                <span className={`text-[10px] font-medium tracking-wide ${isActive ? "text-white" : "text-zinc-500"}`}>
                  {item.name}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
