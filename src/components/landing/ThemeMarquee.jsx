"use client";

import { Reveal } from "./primitives";

const THEMES = [
  { name: "Modern", accent: "#2ed3e0", bg: "#0d1016" },
  { name: "Business", accent: "#7c9cff", bg: "#0b0e15" },
  { name: "Creator", accent: "#ff7ab8", bg: "#140d13" },
  { name: "Developer", accent: "#5fe38a", bg: "#0a1210" },
  { name: "Minimal", accent: "#d8d4cb", bg: "#101013" },
  { name: "Sunset", accent: "#ff9557", bg: "#150f0c" },
  { name: "Ocean", accent: "#4bb8ff", bg: "#08111a" },
  { name: "Neon", accent: "#c6ff4b", bg: "#0f1408" },
];

function ThemeChip({ name, accent, bg }) {
  return (
    <div
      className="mx-2 w-[248px] shrink-0 rounded-2xl border p-4"
      style={{ background: bg, borderColor: `${accent}26` }}
    >
      <div className="flex items-center gap-3">
        <span
          className="h-10 w-10 shrink-0 rounded-xl"
          style={{ background: `linear-gradient(150deg, ${accent}4a, ${accent}0f)` }}
        />
        <div className="min-w-0 flex-1 space-y-1.5">
          <span className="block h-2 w-3/4 rounded-full bg-[rgba(241,239,233,0.22)]" />
          <span
            className="block h-2 w-1/2 rounded-full"
            style={{ background: `${accent}66` }}
          />
        </div>
      </div>
      <div className="mt-4 flex items-center justify-between">
        <div className="flex gap-1.5">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="h-4 w-10 rounded-full border"
              style={{ borderColor: `${accent}2e`, background: "rgba(0,0,0,0.3)" }}
            />
          ))}
        </div>
        <span className="text-[11px] font-medium" style={{ color: accent }}>
          {name}
        </span>
      </div>
    </div>
  );
}

export function ThemeMarquee() {
  return (
    <section
      aria-labelledby="themes-heading"
      className="relative overflow-hidden border-t border-[var(--line)] py-24 sm:py-28"
    >
      <div className="mx-auto max-w-[1240px] px-5 sm:px-8">
        <Reveal>
          <h2
            id="themes-heading"
            className="lp-display max-w-2xl text-[clamp(2rem,4.6vw,3.2rem)]"
          >
            Eight themes, and a layout you{" "}
            <span className="lp-hi">drag into order</span>.
          </h2>
          <p className="lp-measure mt-6 text-[16px] leading-[1.65] text-[var(--paper-dim)]">
            Modern, Business, Creator, Developer, Minimal, Sunset, Ocean and Neon.
            Set an accent and your QR code recolours to match it.
          </p>
        </Reveal>
      </div>

      <div
        className="lp-marquee-wrap relative mt-14 overflow-hidden"
        aria-hidden="true"
        style={{
          maskImage:
            "linear-gradient(90deg, transparent, #000 8%, #000 92%, transparent)",
          WebkitMaskImage:
            "linear-gradient(90deg, transparent, #000 8%, #000 92%, transparent)",
        }}
      >
        <div className="lp-marquee">
          {[...THEMES, ...THEMES].map((t, i) => (
            <ThemeChip key={`${t.name}-${i}`} {...t} />
          ))}
        </div>
      </div>
    </section>
  );
}
