"use client";

import { motion } from "framer-motion";
import { FiCheck, FiZap, FiStar, FiShield, FiArrowRight } from "react-icons/fi";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";

const PLANS = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    description: "Everything you need to create a stunning digital identity.",
    features: [
      "1 Digital Card Profile",
      "Standard Themes & Colors",
      "Basic Analytics (Views/Scans)",
      "Branded QR Code",
      "500MB Personal Vault Storage"
    ],
    buttonText: "Current Plan",
    buttonStyle: "bg-white/10 text-zinc-400 cursor-default",
  },
  {
    name: "Pro",
    price: "$5",
    period: "per month",
    description: "Advanced tools for professionals & creators.",
    features: [
      "Everything in Free",
      "Advanced Audience Management",
      "Real-time Device Tracking & Graphs",
      "Targeted Link Access Controls",
      "10GB Personal Vault Storage",
      "Custom Domain Support"
    ],
    popular: true,
    buttonText: "Upgrade to Pro",
    buttonStyle: "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white shadow-xl shadow-blue-500/25",
  },
  {
    name: "Business",
    price: "$15",
    period: "per month",
    description: "For teams and agencies managing multiple identities.",
    features: [
      "Everything in Pro",
      "Manage up to 10 Profiles",
      "Team Dashboard & Analytics",
      "100GB Shared Vault Storage",
      "White-label QR Codes",
      "Priority 24/7 Support"
    ],
    buttonText: "Contact Sales",
    buttonStyle: "bg-white text-black hover:bg-zinc-200 shadow-xl shadow-white/10",
  }
];

export default function PricingPage() {
  const { user } = useAuth();
  const isPremium = user?.plan === "pro" || user?.plan === "business";

  return (
    <div className="max-w-6xl mx-auto py-12 px-4 relative">
      {/* Background Glows */}
      <div className="fixed top-20 left-1/4 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="fixed bottom-0 right-1/4 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="text-center mb-16 relative z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, type: "spring" }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-medium mb-6"
        >
          <FiZap /> Unleash your true potential
        </motion.div>
        
        <h1 className="text-4xl md:text-6xl font-bold font-mono tracking-tight mb-6">
          Upgrade your <span className="text-gradient hover-glow">Identity</span>
        </h1>
        <p className="text-lg text-zinc-400 max-w-2xl mx-auto">
          Choose a plan that scales with your professional network. Get more storage, premium themes, and advanced analytics.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 relative z-10 max-w-5xl mx-auto">
        {PLANS.map((plan, i) => (
          <motion.div
            key={plan.name}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            className={`relative rounded-3xl p-8 border backdrop-blur-xl flex flex-col h-full
              ${plan.popular 
                ? "bg-zinc-900/80 border-blue-500/50 shadow-2xl shadow-blue-500/10 transform md:-translate-y-4" 
                : "bg-zinc-900/40 border-white/10"}`}
          >
            {plan.popular && (
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2">
                <div className="px-4 py-1 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 text-xs font-bold flex items-center gap-1 shadow-lg">
                  <FiStar /> MOST POPULAR
                </div>
              </div>
            )}

            <div className="mb-8">
              <h3 className="text-xl font-bold font-mono mb-2">{plan.name}</h3>
              <p className="text-zinc-400 text-sm h-10">{plan.description}</p>
            </div>

            <div className="mb-8">
              <span className="text-5xl font-bold tracking-tight">{plan.price}</span>
              <span className="text-zinc-500 font-medium">/{plan.period}</span>
            </div>

            <ul className="space-y-4 mb-10 flex-1">
              {plan.features.map((feature, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <div className="mt-1 w-5 h-5 rounded-full bg-blue-500/20 flex items-center justify-center shrink-0">
                    <FiCheck className="text-blue-400 text-xs" />
                  </div>
                  <span className="text-zinc-300 text-sm">{feature}</span>
                </li>
              ))}
            </ul>

            <button
              disabled={plan.name.toLowerCase() === (user?.plan || "free") || (plan.name === "Free" && isPremium)}
              className={`w-full py-4 rounded-xl font-bold transition-all flex items-center justify-center gap-2 ${
                plan.name.toLowerCase() === (user?.plan || "free") 
                  ? "bg-white/10 text-zinc-400 cursor-default"
                  : plan.buttonStyle
              }`}
            >
              {plan.name.toLowerCase() === (user?.plan || "free") ? "Current Tier" : plan.buttonText} 
              {plan.name.toLowerCase() !== (user?.plan || "free") && plan.name !== "Free" && <FiArrowRight />}
            </button>
          </motion.div>
        ))}
      </div>

      {/* FAQ / Trust Section */}
      <div className="mt-32 max-w-3xl mx-auto text-center relative z-10">
        <FiShield className="mx-auto text-4xl text-zinc-700 mb-6" />
        <h2 className="text-2xl font-bold font-mono mb-4">Secure & Private</h2>
        <p className="text-zinc-400">
          Your personal vault and identity data are encrypted and securely stored. 
          You always own your data and can completely delete your profile at any time.
        </p>
      </div>
    </div>
  );
}
