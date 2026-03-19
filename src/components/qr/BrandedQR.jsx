"use client";

import { QRCodeSVG } from "qrcode.react";
import { useRef, useState } from "react";
import { FiDownload, FiCopy, FiCheck } from "react-icons/fi";
import toast from "react-hot-toast";

/**
 * Uses quickchart.io API for the colored QR and overlays a gradient via CSS.
 * The QR color auto-matches the user's card accent color.
 */
function hexToRgb(hex) {
  const h = hex.replace("#", "");
  return { r: parseInt(h.substring(0, 2), 16), g: parseInt(h.substring(2, 4), 16), b: parseInt(h.substring(4, 6), 16) };
}

function buildQrUrl(data, size, darkHex) {
  const clean = darkHex.replace("#", "");
  const params = new URLSearchParams({
    text: data,
    size: String(size),
    dark: clean,
    light: "000000",
    ecLevel: "H",
    margin: "2",
    format: "png",
  });
  return `https://quickchart.io/qr?${params.toString()}`;
}

export function BrandedQR({ username, size = 200, accentColor = "#3b82f6" }) {
  const [copied, setCopied] = useState(false);

  const baseUrl = typeof window !== "undefined"
    ? `${window.location.origin}/card/${username}`
    : `https://cardix.app/card/${username}`;

  const qrImageUrl = buildQrUrl(`${baseUrl}?source=qr`, size * 2, accentColor);

  const downloadQR = async () => {
    try {
      const res = await fetch(qrImageUrl);
      const blob = await res.blob();
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const padding = 48;
        canvas.width = size + padding * 2;
        canvas.height = size + padding * 2 + 60;
        const ctx = canvas.getContext("2d");

        // Background
        ctx.fillStyle = "#000000";
        ctx.beginPath();
        ctx.roundRect(0, 0, canvas.width, canvas.height, 32);
        ctx.fill();

        // Gradient border
        ctx.strokeStyle = accentColor;
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.roundRect(1.5, 1.5, canvas.width - 3, canvas.height - 3, 32);
        ctx.stroke();

        // QR image
        ctx.drawImage(img, padding, padding, size, size);

        // Branding
        ctx.fillStyle = accentColor;
        ctx.font = "bold 16px monospace";
        ctx.textAlign = "center";
        ctx.fillText("CARDIX", canvas.width / 2, size + padding + 32);
        ctx.fillStyle = "#666";
        ctx.font = "11px monospace";
        ctx.fillText(`@${username}`, canvas.width / 2, size + padding + 50);

        const link = document.createElement("a");
        link.download = `cardix-${username}-qr.png`;
        link.href = canvas.toDataURL("image/png");
        link.click();
        toast.success("QR downloaded!");
      };
      img.src = URL.createObjectURL(blob);
    } catch (err) {
      console.error(err);
      toast.error("Failed to download QR");
    }
  };

  const copyLink = () => {
    navigator.clipboard.writeText(baseUrl);
    setCopied(true);
    toast.success("Link copied!");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col items-center">
      {/* QR Card with gradient overlay */}
      <div
        className="relative p-7 rounded-3xl transition-all duration-500 group"
        style={{
          background: `linear-gradient(145deg, #000, ${accentColor}10)`,
          boxShadow: `0 0 60px ${accentColor}15`,
          border: `2px solid ${accentColor}25`,
        }}
      >
        {/* Corner accents matching accent color */}
        <div className="absolute top-4 left-4 w-5 h-5 border-l-2 border-t-2 rounded-tl-xl" style={{ borderColor: accentColor }} />
        <div className="absolute top-4 right-4 w-5 h-5 border-r-2 border-t-2 rounded-tr-xl" style={{ borderColor: accentColor }} />
        <div className="absolute bottom-4 left-4 w-5 h-5 border-l-2 border-b-2 rounded-bl-xl" style={{ borderColor: accentColor }} />
        <div className="absolute bottom-4 right-4 w-5 h-5 border-r-2 border-b-2 rounded-br-xl" style={{ borderColor: accentColor }} />

        {/* QR Image from quickchart.io */}
        <div className="relative overflow-hidden rounded-xl">
          <img
            src={qrImageUrl}
            alt="QR Code"
            width={size}
            height={size}
            className="rounded-xl"
            style={{ imageRendering: "pixelated" }}
          />
          {/* CSS gradient overlay for modern look */}
          <div
            className="absolute inset-0 pointer-events-none rounded-xl mix-blend-overlay opacity-40"
            style={{
              background: `linear-gradient(135deg, ${accentColor}60, transparent 50%, ${accentColor}30)`,
            }}
          />
        </div>

        {/* Center logo */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-11 h-11 rounded-2xl flex items-center justify-center font-bold text-sm shadow-2xl"
          style={{
            background: accentColor,
            color: "white",
            boxShadow: `0 0 20px ${accentColor}60`,
          }}
        >
          C
        </div>
      </div>

      {/* Branding */}
      <div className="mt-5 text-center">
        <p className="text-xs font-mono font-bold tracking-[0.3em] uppercase" style={{ color: accentColor }}>CARDIX</p>
        <p className="text-[10px] text-zinc-500 mt-0.5">@{username}</p>
      </div>

      {/* Actions */}
      <div className="flex gap-3 mt-5">
        <button
          onClick={downloadQR}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium border border-white/10 bg-white/5 hover:bg-white/10 transition-colors"
        >
          <FiDownload /> Download
        </button>
        <button
          onClick={copyLink}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium border transition-colors"
          style={{ borderColor: `${accentColor}30`, color: accentColor }}
        >
          {copied ? <><FiCheck /> Copied</> : <><FiCopy /> Copy Link</>}
        </button>
      </div>
      <p className="text-[9px] text-zinc-700 mt-3">QR powered by quickchart.io</p>
    </div>
  );
}
