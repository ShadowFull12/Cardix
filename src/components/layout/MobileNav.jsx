"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { FiHome, FiUser, FiCamera, FiHardDrive, FiGrid } from "react-icons/fi";
import { motion } from "framer-motion";
import { useTheme } from "@/contexts/ThemeContext";

const MOBILE_NAV = [
  { name: "Home", href: "/dashboard", icon: FiHome },
  { name: "Vault", href: "/vault", icon: FiHardDrive },
  { name: "Scan", href: "/scan", icon: FiCamera, isCenter: true },
  { name: "Card", href: "/card/preview", icon: FiGrid },
  { name: "Profile", href: "/profile", icon: FiUser },
];

export function MobileNav() {
  const pathname = usePathname();
  const { accent } = useTheme();

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 px-4 pb-6 pt-2">
      <div className="glass-panel mx-auto max-w-md rounded-full px-6 py-3 flex items-center justify-between shadow-2xl border-white/20">
        {MOBILE_NAV.map((item) => {
          const isActive = pathname === item.href;
          
          if (item.isCenter) {
            return (
              <Link key={item.name} href={item.href} className="relative -top-6">
                <div className="w-14 h-14 rounded-full flex items-center justify-center text-white shadow-lg border-4 border-black"
                  style={{ background: accent, boxShadow: `0 8px 25px ${accent}40` }}
                >
                  <item.icon className="text-2xl" />
                </div>
              </Link>
            );
          }

          return (
            <Link key={item.name} href={item.href} className="flex flex-col items-center gap-1 min-w-[3rem]">
              <div className="relative p-2">
                {isActive && (
                  <motion.div
                    layoutId="mobile-active"
                    className="absolute inset-0 rounded-full"
                    style={{ background: `${accent}20` }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
                <item.icon className="text-xl relative z-10" style={isActive ? { color: accent } : { color: "#71717a" }} />
              </div>
              <span className={`text-[10px] font-medium ${isActive ? "text-white" : "text-zinc-500"}`}>
                {item.name}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
