"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FiMail, FiLock } from "react-icons/fi";
import toast from "react-hot-toast";
import { useAuth } from "@/contexts/AuthContext";
import { GlassCard } from "@/components/ui/GlassCard";
import { FcGoogle } from "react-icons/fc";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { login, loginWithGoogle, user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      if (user.onboardingComplete === false) {
        router.replace("/onboarding");
      } else {
        router.replace("/dashboard");
      }
    }
  }, [user, router]);

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      setLoading(true);
      await login(email, password);
      toast.success("Welcome back!");
      router.push("/dashboard");
    } catch (error) {
      toast.error(error.message || "Failed to log in");
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogleLogin() {
    try {
      setLoading(true);
      await loginWithGoogle();
      toast.success("Google login successful!");
      router.push("/dashboard");
    } catch (error) {
      toast.error(error.message || "Google login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-4 relative overflow-hidden">
      {/* Ambient background light */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-[128px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-[128px] pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-10">
          <img src="/logo.png" alt="Cardix Logo" className="w-24 h-24 mx-auto object-contain drop-shadow-[0_0_20px_rgba(59,130,246,0.3)] mb-6" />
          <h1 className="text-3xl font-bold font-mono tracking-tighter mb-2">Welcome to Cardix</h1>
          <p className="text-zinc-400">Sign in to manage your digital identity</p>
        </div>

        <GlassCard className="p-8 backdrop-blur-3xl bg-black/40 border-white/10" hover={false}>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-2">Email Address</label>
              <div className="relative">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-zinc-900/50 border border-white/10 rounded-xl px-4 py-3 pl-11 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all font-sans"
                  placeholder="you@example.com"
                />
                <FiMail className="w-5 h-5 text-zinc-500 absolute left-4 top-3.5" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-2">Password</label>
              <div className="relative">
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-zinc-900/50 border border-white/10 rounded-xl px-4 py-3 pl-11 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all font-sans"
                  placeholder="••••••••"
                />
                <FiLock className="w-5 h-5 text-zinc-500 absolute left-4 top-3.5" />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 bg-white text-black font-semibold rounded-xl hover:bg-zinc-200 transition-colors disabled:opacity-50 mt-6"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/10"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-[#09090b] text-zinc-500">Or continue with</span>
              </div>
            </div>

            <button
              onClick={handleGoogleLogin}
              type="button"
              className="mt-6 w-full flex items-center justify-center gap-3 py-3 px-4 bg-zinc-900 hover:bg-zinc-800 border border-white/10 rounded-xl transition-colors font-medium text-white"
            >
              <FcGoogle className="text-xl" />
              Google
            </button>
          </div>
        </GlassCard>

        <p className="text-center mt-8 text-zinc-400">
          Don't have an account?{" "}
          <Link href="/signup" className="text-white font-medium hover:text-blue-400 transition-colors">
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
}
