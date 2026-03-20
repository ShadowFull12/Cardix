"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { 
  FiHome, FiUser, FiGrid, FiHardDrive, FiSettings, FiLogOut,
  FiBarChart2, FiUsers, FiShield, FiStar, FiCamera, FiLock
} from "react-icons/fi";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/contexts/ThemeContext";

const NAV_ITEMS = [
  { name: "Dashboard", href: "/dashboard", icon: FiHome },
  { name: "My Vault", href: "/vault", icon: FiHardDrive },
  { name: "Scan QR", href: "/scan", icon: FiCamera },
  { name: "My Profile", href: "/profile", icon: FiUser },
  { name: "Card Editor", href: "/card/preview", icon: FiGrid },
  { name: "My Network", href: "/network", icon: FiUsers },
  { name: "Analytics", href: "/analytics", icon: FiBarChart2, proOnly: true },
  { name: "Audience", href: "/audience", icon: FiShield, proOnly: true },
];

export function Sidebar() {
  const pathname = usePathname();
  const { logout, user } = useAuth();
  const { accent } = useTheme();

  const isAdmin = user?.role === "admin";
  const isPro = user?.plan === "pro" || user?.plan === "business";

  return (
    <aside className="hidden md:flex flex-col w-64 h-screen fixed left-0 top-0 border-r border-white/10 p-6 z-50" style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(40px)", WebkitBackdropFilter: "blur(40px)" }}>
      <div className="flex items-center gap-3 mb-10">
        <img src="/logo.png" alt="Cardix Logo" className="w-10 h-10 object-contain" />
        <span className="text-2xl font-bold font-mono tracking-tight text-white">Cardix</span>
      </div>

      <nav className="flex-1 space-y-1">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href || (item.href === "/card/preview" && pathname.startsWith("/card/"));
          return (
            <Link key={item.name} href={item.href}>
              <div
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group relative
                ${isActive ? "text-white" : "text-zinc-400 hover:text-white hover:bg-white/5"}`}
              >
                {isActive && (
                  <motion.div
                    layoutId="active-nav"
                    className="absolute inset-0 rounded-xl"
                    style={{ background: `${accent}18`, border: `1px solid ${accent}25` }}
                    initial={false}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
                <item.icon className="text-lg z-10" style={isActive ? { color: accent } : {}} />
                <span className="font-medium z-10 flex-1">{item.name}</span>
                {item.proOnly && !isPro && (
                  <FiLock className="text-xs text-zinc-600 z-10" />
                )}
              </div>
            </Link>
          );
        })}

        {/* Upgrade CTA */}
        {!isPro && (
          <Link href="/pro">
            <div className="flex items-center gap-3 px-4 py-3 rounded-xl border text-sm font-medium transition-all mt-4"
              style={{ background: `${accent}08`, borderColor: `${accent}20`, color: accent }}
            >
              <FiStar className="text-lg" />
              <span>Upgrade to Pro</span>
            </div>
          </Link>
        )}

        {isAdmin && (
          <Link href="/admin">
            <div
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group relative mt-2
              ${pathname === "/admin" ? "text-white bg-red-500/10 border border-red-500/20" : "text-zinc-400 hover:text-red-400 hover:bg-red-500/5"}`}
            >
              <FiShield className={`text-lg ${pathname === "/admin" ? "text-red-400" : ""}`} />
              <span className="font-medium">Admin</span>
            </div>
          </Link>
        )}
      </nav>

      <div className="mt-auto space-y-2 pt-6 border-t border-white/10">
        <div className="flex items-center gap-3 px-4 py-3 mb-2 bg-black/20 rounded-xl">
          <div className="relative w-10 h-10 shrink-0">
            <div className="w-10 h-10 rounded-full bg-zinc-800 overflow-hidden">
              {user?.photoURL ? (
                <img src={user.photoURL} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-sm font-bold" style={{ background: `${accent}30`, color: accent }}>
                  {user?.displayName?.[0] || user?.email?.[0] || "?"}
                </div>
              )}
            </div>
            {isPro && (
              <div className="absolute -bottom-0.5 -right-0.5 w-5 h-5 rounded-full bg-gradient-to-tr from-amber-400 to-yellow-500 flex items-center justify-center border-2 border-black shadow-lg">
                <FiStar className="text-[8px] text-black" />
              </div>
            )}
          </div>
          <div className="overflow-hidden">
            <div className="flex items-center gap-1.5">
              <p className="text-sm font-medium text-white truncate">{user?.displayName || "User"}</p>
              {isPro && (
                <span className="text-[9px] uppercase font-bold px-1.5 py-0.5 rounded bg-gradient-to-r from-amber-400/20 to-yellow-400/20 text-amber-400 border border-amber-400/30">PRO</span>
              )}
            </div>
            <p className="text-xs text-zinc-500 truncate">@{user?.username || "loading..."}</p>
          </div>
        </div>

        <Link href="/settings">
          <div className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-zinc-400 hover:text-white hover:bg-white/5 transition-colors">
            <FiSettings className="text-lg" />
            <span className="font-medium text-sm">Settings</span>
          </div>
        </Link>
        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-zinc-400 hover:text-red-400 hover:bg-red-500/10 transition-colors text-left"
        >
          <FiLogOut className="text-lg" />
          <span className="font-medium text-sm">Log out</span>
        </button>
      </div>
    </aside>
  );
}
