"use client";

import { motion } from "framer-motion";

export function GlassCard({ children, className = "", hover = true, delay = 0, onClick }) {
  const Component = onClick ? motion.button : motion.div;
  
  return (
    <Component
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay, ease: [0.23, 1, 0.32, 1] }}
      onClick={onClick}
      whileHover={hover ? { y: -4, scale: 1.01 } : {}}
      className={`glass rounded-2xl p-6 transition-all duration-300 ${onClick ? "cursor-pointer text-left w-full" : ""} ${className}`}
    >
      {children}
    </Component>
  );
}
