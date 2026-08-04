"use client";

import { useCallback, useRef } from "react";
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";
import {
  Mail,
  Phone,
  MapPin,
  Globe,
  Github,
  Linkedin,
  Instagram,
  Twitter,
  Download,
  Bookmark,
  Share2,
} from "lucide-react";

const STROKE = 1.75;

/**
 * A live preview of the product's own card, not a screenshot mock: same section
 * order as src/components/card/PublicCard.jsx (header, contact, socials,
 * watermark), same accent-driven tinting, same privacy-mode filtering. Rendered
 * decoratively, so nothing inside is focusable and the whole subtree is hidden
 * from assistive tech. The surrounding copy carries the meaning.
 */

const PILL =
  "inline-flex items-center gap-1.5 rounded-full border border-[var(--line)] bg-[rgba(8,9,12,0.55)] px-2.5 py-1 text-[11px] font-medium text-[var(--paper-dim)]";

export function CardixCard({
  accent = "#2ed3e0",
  mode = "full",
  name = "Ifeoma Adeyemi",
  role = "Product Designer, Lagos",
  handle = "cardixx1.vercel.app/card/ifeoma",
  initials = "I",
  showQr = true,
  className = "",
}) {
  const minimal = mode === "minimal";
  const contactOnly = mode === "contact";

  return (
    <div
      className={`lp-card-face w-full ${className}`}
      aria-hidden="true"
      style={{ borderColor: `${accent}2e` }}
    >
      <div className="lp-sheen" />
      <div
        className="pointer-events-none absolute -right-20 -top-24 h-56 w-56 rounded-full"
        style={{
          background: `radial-gradient(circle, ${accent}38 0%, ${accent}10 40%, transparent 70%)`,
        }}
      />

      <div className="relative flex flex-col gap-5 p-5 sm:p-6">
        <div className="absolute right-5 top-5 flex gap-2 sm:right-6 sm:top-6">
          <span className="flex h-8 w-8 items-center justify-center rounded-full border border-[var(--line)] bg-[rgba(8,9,12,0.6)]">
            <Share2 size={13} strokeWidth={STROKE} color="var(--paper-dim)" />
          </span>
          <span
            className="flex h-8 w-8 items-center justify-center rounded-full border bg-[rgba(8,9,12,0.6)]"
            style={{ borderColor: `${accent}55` }}
          >
            <Bookmark size={13} strokeWidth={STROKE} color={accent} />
          </span>
        </div>

        {!contactOnly && (
          <div className="flex items-start gap-4">
            <div
              className="grid h-16 w-16 shrink-0 place-items-center rounded-2xl text-2xl font-semibold"
              style={{
                background: `linear-gradient(150deg, ${accent}30, ${accent}0d)`,
                color: accent,
                boxShadow: `inset 0 0 0 1px ${accent}33`,
              }}
            >
              {initials}
            </div>
            <div className="min-w-0 pr-16">
              <p className="truncate text-[19px] font-semibold tracking-[-0.02em] text-[var(--paper)]">
                {name}
              </p>
              <p
                className="mt-0.5 truncate text-[12.5px] font-medium"
                style={{ color: accent }}
              >
                {role}
              </p>
              {!minimal && (
                <p className="mt-2 text-[12px] leading-relaxed text-[var(--paper-faint)]">
                  Calm interfaces for messy problems.
                </p>
              )}
            </div>
          </div>
        )}

        {contactOnly && (
          <div className="space-y-2 pt-1">
            <p className="lp-mono text-[10px] text-[var(--paper-faint)]">
              Contact only
            </p>
            {[
              { Icon: Mail, v: "ifeoma@adeyemi.design" },
              { Icon: Phone, v: "+234 810 447 1928" },
            ].map(({ Icon, v }) => (
              <div
                key={v}
                className="flex items-center gap-3 rounded-xl border border-[var(--line)] bg-[rgba(8,9,12,0.5)] px-3 py-2.5"
              >
                <Icon size={14} strokeWidth={STROKE} color={accent} />
                <span className="text-[12.5px] text-[var(--paper-dim)]">{v}</span>
              </div>
            ))}
          </div>
        )}

        {!contactOnly && (
          <div className="flex flex-wrap items-center gap-1.5">
            <span className={PILL}>
              <Mail size={12} strokeWidth={STROKE} /> Email
            </span>
            {!minimal && (
              <span className={PILL}>
                <Phone size={12} strokeWidth={STROKE} /> Call
              </span>
            )}
            {!minimal && (
              <span className={PILL}>
                <MapPin size={12} strokeWidth={STROKE} /> Lagos, NG
              </span>
            )}
            <span className={PILL}>
              <Globe size={12} strokeWidth={STROKE} /> Website
            </span>
            <span
              className="inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-medium"
              style={{ borderColor: `${accent}45`, color: accent }}
            >
              <Download size={12} strokeWidth={STROKE} /> Save
            </span>
          </div>
        )}

        {!minimal && !contactOnly && (
          <div className="flex items-center gap-2">
            {[Twitter, Linkedin, Github, Instagram].map((Icon, i) => (
              <span
                key={i}
                className="flex h-8 w-8 items-center justify-center rounded-full border border-[var(--line)] bg-[rgba(8,9,12,0.5)]"
              >
                <Icon size={13} strokeWidth={STROKE} color="var(--paper-dim)" />
              </span>
            ))}
          </div>
        )}

        <div className="mt-1 flex items-end justify-between gap-4 border-t border-[var(--line)] pt-4">
          <p className="lp-mono truncate text-[9px] text-[var(--paper-faint)]">
            {handle}
          </p>
          {showQr && <QrPlate accent={accent} />}
        </div>
      </div>
    </div>
  );
}

/* Deterministic pseudo-QR. A real code would have to encode a URL we cannot
   promise resolves, so this is an honest silhouette with no scannable claim. */
const QR_BITS = (() => {
  const size = 11;
  const cells = [];
  let seed = 0x2ed3e0;
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      seed = (seed * 1103515245 + 12345) & 0x7fffffff;
      const finder =
        (x < 3 && y < 3) || (x > size - 4 && y < 3) || (x < 3 && y > size - 4);
      cells.push({ x, y, on: finder || (seed >> 16) % 100 > 52, finder });
    }
  }
  return { size, cells };
})();

export function QrPlate({ accent = "#2ed3e0", size = 62, scanning = false }) {
  const { size: n, cells } = QR_BITS;
  return (
    <div
      className="relative shrink-0 overflow-hidden rounded-lg border p-1.5"
      style={{
        width: size,
        height: size,
        borderColor: `${accent}33`,
        background: "rgba(8,9,12,0.7)",
      }}
    >
      <svg viewBox={`0 0 ${n} ${n}`} className="h-full w-full" role="presentation">
        {cells.map(
          (c) =>
            c.on && (
              <rect
                key={`${c.x}-${c.y}`}
                x={c.x}
                y={c.y}
                width="1"
                height="1"
                rx="0.22"
                fill={c.finder ? accent : "var(--paper)"}
                opacity={c.finder ? 0.95 : 0.72}
              />
            )
        )}
      </svg>
      {scanning && <span className="lp-scan" />}
    </div>
  );
}

/**
 * Pointer-reactive tilt. Position feeds motion values, springs interpolate them,
 * and the output is a single `transform` string so the animation is hardware
 * accelerated and keeps its velocity when the pointer changes direction. Purely
 * decorative, so it is switched off for coarse pointers and reduced motion.
 */
export function TiltFrame({ children, max = 7, disabled = false, className = "" }) {
  const ref = useRef(null);

  // Raw pointer position, 0 to 1 on each axis.
  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);

  // Springs give the tilt momentum, so it settles instead of snapping, and it
  // keeps velocity if the pointer reverses mid-move.
  const spring = { stiffness: 150, damping: 20, mass: 0.5 };
  const sx = useSpring(px, spring);
  const sy = useSpring(py, spring);

  const rotateY = useTransform(sx, [0, 1], [-max, max]);
  const rotateX = useTransform(sy, [0, 1], [max, -max]);

  // A single transform string keeps this on the compositor.
  const transform = useMotionTemplate`perspective(1400px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;

  const onPointerMove = useCallback(
    (e) => {
      const el = ref.current;
      if (!el || disabled) return;
      const r = el.getBoundingClientRect();
      const nx = (e.clientX - r.left) / r.width;
      const ny = (e.clientY - r.top) / r.height;
      px.set(nx);
      py.set(ny);
      // Feeds the specular sheen without a re-render.
      el.style.setProperty("--mx", `${nx * 100}%`);
      el.style.setProperty("--my", `${ny * 100}%`);
    },
    [disabled, px, py]
  );

  const onPointerLeave = useCallback(() => {
    px.set(0.5);
    py.set(0.5);
  }, [px, py]);

  return (
    <motion.div
      ref={ref}
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
      className={className}
      style={{
        transformStyle: "preserve-3d",
        transform: disabled ? undefined : transform,
      }}
    >
      {children}
    </motion.div>
  );
}
