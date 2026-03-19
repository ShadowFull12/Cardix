"use client";

import { useEffect, useRef, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";
import { GlassCard } from "@/components/ui/GlassCard";
import { FiCamera, FiX, FiZap } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function ScanPage() {
  const router = useRouter();
  const [scanning, setScanning] = useState(false);
  const [scannedResult, setScannedResult] = useState(null);
  const scannerRef = useRef(null);
  const readerRef = useRef(null);

  const startScanner = async () => {
    try {
      const html5Qr = new Html5Qrcode("qr-reader");
      readerRef.current = html5Qr;
      setScanning(true);

      await html5Qr.start(
        { facingMode: "environment" },
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
          aspectRatio: 1,
        },
        (decodedText) => {
          // Check if it's a Cardix URL
          if (decodedText.includes("/card/") || decodedText.includes("/share/")) {
            html5Qr.stop().catch(console.error);
            setScanning(false);
            setScannedResult(decodedText);

            // Extract path and navigate
            try {
              const url = new URL(decodedText);
              toast.success("QR Code scanned!");
              setTimeout(() => router.push(url.pathname), 500);
            } catch {
              // Not a valid URL, try as path
              toast.success("QR Code scanned!");
              setTimeout(() => router.push(decodedText), 500);
            }
          } else {
            toast.error("Not a Cardix QR code");
          }
        },
        () => {} // Error callback (ignore scan errors)
      );
    } catch (err) {
      console.error(err);
      toast.error("Camera access denied or unavailable");
      setScanning(false);
    }
  };

  const stopScanner = async () => {
    if (readerRef.current) {
      try {
        await readerRef.current.stop();
      } catch {
        // Already stopped
      }
      readerRef.current = null;
    }
    setScanning(false);
  };

  useEffect(() => {
    return () => {
      if (readerRef.current) {
        readerRef.current.stop().catch(() => {});
      }
    };
  }, []);

  return (
    <div className="max-w-md mx-auto flex flex-col items-center min-h-[60vh] space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold font-mono tracking-tight text-white mb-2">Scan QR Code</h1>
        <p className="text-zinc-400">Point your camera at a Cardix QR code</p>
      </div>

      <GlassCard className="w-full overflow-hidden" hover={false}>
        <div className="relative">
          {/* Scanner viewport */}
          <div
            id="qr-reader"
            ref={scannerRef}
            className={`w-full rounded-xl overflow-hidden ${scanning ? "min-h-[300px]" : "hidden"}`}
            style={{ border: "none" }}
          />

          {!scanning && !scannedResult && (
            <div className="flex flex-col items-center py-12 px-4">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="w-24 h-24 bg-gradient-to-tr from-blue-500 to-purple-500 rounded-full flex items-center justify-center mb-6 shadow-xl shadow-blue-500/25"
              >
                <FiCamera className="text-4xl text-white" />
              </motion.div>

              <button
                onClick={startScanner}
                className="flex items-center gap-2 px-8 py-3 bg-white text-black rounded-full font-semibold hover:bg-zinc-200 transition-colors shadow-xl"
              >
                <FiZap /> Start Scanning
              </button>

              <p className="text-xs text-zinc-600 mt-6 text-center">
                Camera access required. Works best on mobile devices with HTTPS.
              </p>
            </div>
          )}

          {scanning && (
            <div className="absolute top-4 right-4 z-20">
              <button
                onClick={stopScanner}
                className="p-2 bg-black/60 backdrop-blur-sm rounded-full hover:bg-black/80 transition-colors"
              >
                <FiX className="text-white" />
              </button>
            </div>
          )}

          {/* Scan overlay corners */}
          {scanning && (
            <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
              <div className="w-[250px] h-[250px] relative">
                <div className="absolute top-0 left-0 w-8 h-8 border-l-3 border-t-3 border-blue-500 rounded-tl-lg" />
                <div className="absolute top-0 right-0 w-8 h-8 border-r-3 border-t-3 border-blue-500 rounded-tr-lg" />
                <div className="absolute bottom-0 left-0 w-8 h-8 border-l-3 border-b-3 border-blue-500 rounded-bl-lg" />
                <div className="absolute bottom-0 right-0 w-8 h-8 border-r-3 border-b-3 border-blue-500 rounded-br-lg" />
                {/* Scan line animation */}
                <motion.div
                  className="absolute left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-blue-500 to-transparent"
                  animate={{ top: ["0%", "100%", "0%"] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                />
              </div>
            </div>
          )}
        </div>
      </GlassCard>

      <AnimatePresence>
        {scannedResult && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="w-full p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl text-center"
          >
            <FiCheck className="text-2xl text-emerald-400 mx-auto mb-2" />
            <p className="text-sm text-emerald-300">Redirecting to profile...</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
