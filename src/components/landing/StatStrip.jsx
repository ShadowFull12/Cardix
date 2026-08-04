"use client";

import { CountUp, Reveal } from "./primitives";

/* Every figure here is checkable inside the product. No invented precision. */
const STATS = [
  { to: 8, pad: 2, label: "card themes" },
  { to: 12, pad: 2, label: "accent colours" },
  { to: 3, pad: 2, label: "share modes" },
  { to: 500, suffix: " MB", label: "free vault storage" },
];

export function StatStrip() {
  return (
    <section
      aria-label="Cardixx at a glance"
      className="border-y border-[var(--line)] bg-[var(--ink-925)]"
    >
      <div className="mx-auto grid max-w-[1240px] grid-cols-2 gap-y-8 px-5 py-12 sm:px-8 lg:grid-cols-4 lg:gap-y-0 lg:py-14">
        {STATS.map((s, i) => (
          <Reveal
            key={s.label}
            delay={i * 60}
            className={
              i === 0
                ? "lg:pr-10"
                : "border-l border-[var(--line)] pl-6 sm:pl-10 lg:pr-10"
            }
          >
            <p className="lp-display text-[clamp(2.1rem,5vw,3.1rem)] tracking-[-0.04em]">
              <CountUp to={s.to} pad={s.pad} suffix={s.suffix} />
            </p>
            <p className="mt-2 text-[13.5px] text-[var(--paper-faint)]">
              {s.label}
            </p>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
