"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { FiArrowRight, FiZap, FiGrid, FiUsers, FiShield } from "react-icons/fi";

export default function HomePage() {
  const features = [
    { icon: <FiGrid />, title: "Digital Identity Card", desc: "Create a stunning, customizable profile card that represents you." },
    { icon: <FiZap />, title: "Dynamic QR Code", desc: "One scan to share everything — your card, links, and contact info." },
    { icon: <FiUsers />, title: "Social Network", desc: "Discover and save other users' cards. Build your digital network." },
    { icon: <FiShield />, title: "Privacy First", desc: "Control exactly what's visible. Private mode, temporary links, and more." },
  ];

  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden">
      {/* Fixed background gradients */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-blue-600/15 rounded-full blur-[128px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] bg-purple-600/15 rounded-full blur-[128px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-500/5 rounded-full blur-[200px]" />
      </div>

      {/* Nav */}
      <nav className="relative z-10 flex items-center justify-between px-6 md:px-12 py-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-lg shadow-xl shadow-blue-500/25">
            C
          </div>
          <span className="text-xl font-bold font-mono tracking-tight">Cardix</span>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/login" className="text-sm text-zinc-400 hover:text-white transition-colors font-medium">
            Sign In
          </Link>
          <Link href="/signup" className="px-5 py-2.5 bg-white text-black rounded-full text-sm font-semibold hover:bg-zinc-200 transition-colors">
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative z-10 flex flex-col items-center text-center px-6 pt-20 pb-32 md:pt-32 md:pb-40">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/5 border border-white/10 rounded-full text-xs font-medium text-zinc-300 mb-8">
            <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
            Now in beta — join early
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="text-5xl md:text-7xl lg:text-8xl font-bold font-mono tracking-tighter max-w-4xl leading-[0.95]"
        >
          Your Identity,{" "}
          <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            One Scan Away
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="text-lg md:text-xl text-zinc-400 max-w-2xl mt-8 leading-relaxed"
        >
          Cardix is the next-generation digital identity platform. Create your personalized
          card, share with a QR code, and build your professional network — all in one place.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center gap-4 mt-12"
        >
          <Link
            href="/signup"
            className="group flex items-center gap-2 px-8 py-4 bg-white text-black rounded-full font-semibold text-lg hover:bg-zinc-200 transition-all shadow-2xl shadow-white/10"
          >
            Create Your Card
            <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link
            href="/login"
            className="px-8 py-4 bg-white/5 border border-white/10 text-white rounded-full font-medium text-lg hover:bg-white/10 transition-all"
          >
            Sign In
          </Link>
        </motion.div>
      </section>

      {/* Features */}
      <section className="relative z-10 px-6 md:px-12 pb-32">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 + i * 0.1 }}
              className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all group"
            >
              <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-blue-500/20 to-purple-500/20 border border-blue-500/20 flex items-center justify-center text-blue-400 text-xl mb-5 group-hover:scale-110 transition-transform">
                {f.icon}
              </div>
              <h3 className="font-semibold text-lg mb-2">{f.title}</h3>
              <p className="text-sm text-zinc-400 leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="relative z-10 px-6 pb-20">
        <div className="max-w-3xl mx-auto text-center p-12 rounded-3xl bg-gradient-to-r from-blue-600/10 to-purple-600/10 border border-white/10">
          <h2 className="text-3xl md:text-4xl font-bold font-mono tracking-tight mb-4">
            Ready to go digital?
          </h2>
          <p className="text-zinc-400 mb-8">
            Join thousands building their digital identity on Cardix.
          </p>
          <Link
            href="/signup"
            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-black rounded-full font-semibold hover:bg-zinc-200 transition-all"
          >
            Get Started Free <FiArrowRight />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/5 px-6 py-8">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-gradient-to-tr from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-xs">
              C
            </div>
            <span className="font-mono font-bold text-sm">Cardix</span>
          </div>
          <p className="text-xs text-zinc-500">&copy; 2026 Cardix. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
