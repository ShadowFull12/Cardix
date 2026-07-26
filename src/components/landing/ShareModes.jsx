"use client";

import { useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { EyeOff, Lock, Link2, ShieldCheck } from "lucide-react";
import { CardixCard } from "./CardixCard";
import { Reveal } from "./primitives";

const S = 1.75;

const MODES = [
  {
    id: "full",
    label: "Full profile",
    blurb:
      "Everything you have marked public: bio, contact pills, website and every social link you have added.",
    use: "Conferences, new clients, anyone you want to find you again.",
  },
  {
    id: "minimal",
    label: "Minimal",
    blurb:
      "Name, role and one way to reach you. No bio, no socials, no location.",
    use: "Cold intros, and rooms where you would rather stay a little private.",
  },
  {
    id: "contact",
    label: "Contact only",
    blurb:
      "Just the digits: email and phone, formatted to save straight into their phone.",
    use: "Couriers, front desks, the plumber. People who need one thing.",
  },
];

const GUARDS = [
  { Icon: EyeOff, t: "Field level privacy", d: "Hide email, phone or location independently." },
  { Icon: Link2, t: "Expiring links", d: "15, 30 or 60 minutes, then the link dies." },
  { Icon: Lock, t: "Restricted viewers", d: "Quietly downgrade one person to the minimal card." },
  { Icon: ShieldCheck, t: "Full delete", d: "Wipe the profile and the vault whenever you want." },
];

export function ShareModes() {
  const [active, setActive] = useState(0);
  const reduce = useReducedMotion();
  const tabsRef = useRef(null);

  const onKeyDown = (e) => {
    if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
    e.preventDefault();
    const next =
      e.key === "ArrowRight"
        ? (active + 1) % MODES.length
        : (active - 1 + MODES.length) % MODES.length;
    setActive(next);
    tabsRef.current?.querySelectorAll('[role="tab"]')[next]?.focus();
  };

  return (
    <section
      id="sharing"
      className="relative scroll-mt-20 overflow-hidden px-5 py-24 sm:px-8 sm:py-32"
    >
      <div
        className="lp-bloom -left-48 top-1/4 h-[580px] w-[580px]"
        aria-hidden="true"
      />
      <div className="relative mx-auto grid max-w-[1240px] items-center gap-16 lg:grid-cols-2 lg:gap-16">
        <div>
          <Reveal>
            <h2 className="lp-display text-[clamp(2rem,4.6vw,3.2rem)]">
              One card, three <span className="lp-hi">versions</span> of you.
            </h2>
            <p className="lp-measure mt-6 text-[16px] leading-[1.65] text-[var(--paper-dim)]">
              Every share link carries a mode, and the card filters itself before
              it reaches them. You do not maintain three profiles.
            </p>
          </Reveal>

          <Reveal delay={80}>
            <div
              ref={tabsRef}
              role="tablist"
              aria-label="Share modes"
              onKeyDown={onKeyDown}
              className="mt-9 inline-flex rounded-full border border-[var(--line-strong)] bg-[var(--surface)] p-1"
            >
              {MODES.map((m, i) => (
                <button
                  key={m.id}
                  role="tab"
                  type="button"
                  id={`tab-${m.id}`}
                  aria-selected={active === i}
                  aria-controls={`panel-${m.id}`}
                  tabIndex={active === i ? 0 : -1}
                  onClick={() => setActive(i)}
                  className="relative min-h-[44px] rounded-full px-4 text-[13.5px] font-medium transition-colors duration-150 active:scale-[0.97]"
                  style={{ color: active === i ? "var(--accent-ink)" : "var(--paper-dim)" }}
                >
                  {active === i && (
                    <motion.span
                      layoutId="lp-mode-pill"
                      className="absolute inset-0 rounded-full bg-[var(--accent)]"
                      transition={
                        reduce
                          ? { duration: 0 }
                          : { type: "spring", stiffness: 430, damping: 34 }
                      }
                    />
                  )}
                  <span className="relative">{m.label}</span>
                </button>
              ))}
            </div>
          </Reveal>

          <div
            id={`panel-${MODES[active].id}`}
            role="tabpanel"
            aria-labelledby={`tab-${MODES[active].id}`}
            className="mt-7 min-h-[108px]"
          >
            {/* Blur bridges the crossfade so the two copy blocks read as one
                object changing, not two objects swapping. */}
            <motion.div
              key={MODES[active].id}
              initial={{ opacity: 0, filter: reduce ? "none" : "blur(6px)" }}
              animate={{ opacity: 1, filter: "blur(0px)" }}
              transition={{ duration: reduce ? 0.15 : 0.34, ease: [0.23, 1, 0.32, 1] }}
            >
              <p className="lp-measure text-[15.5px] leading-[1.65] text-[var(--paper)]">
                {MODES[active].blurb}
              </p>
              <p className="mt-3 text-[13.5px] leading-relaxed text-[var(--paper-faint)]">
                {MODES[active].use}
              </p>
            </motion.div>
          </div>

          <div className="mt-10 grid gap-x-8 gap-y-5 border-t border-[var(--line)] pt-8 sm:grid-cols-2">
            {GUARDS.map(({ Icon, t, d }) => (
              <div key={t} className="flex gap-3">
                <Icon
                  size={16}
                  strokeWidth={S}
                  color="var(--accent)"
                  className="mt-0.5 shrink-0"
                />
                <div>
                  <p className="text-[14px] font-semibold tracking-[-0.012em]">{t}</p>
                  <p className="mt-1 text-[13px] leading-relaxed text-[var(--paper-faint)]">
                    {d}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* The deck refans, and the selected version comes forward. */}
        <Reveal delay={100} amount={0.15}>
          <div className="relative mx-auto h-[490px] w-full max-w-[430px] [perspective:1500px] sm:h-[440px]">
            {MODES.map((m, i) => {
              const offset = (i - active + MODES.length) % MODES.length;
              const front = offset === 0;
              return (
                /* CSS transition rather than a JS spring: it runs on the
                   compositor and retargets cleanly if you switch tabs
                   mid-animation, where keyframes would restart from zero. */
                <div
                  key={m.id}
                  className="absolute inset-x-0 top-6"
                  aria-hidden={!front}
                  style={{
                    zIndex: MODES.length - offset,
                    transform: `translate3d(${offset * 26}px, ${offset * 22}px, 0) rotate(${
                      reduce ? 0 : offset * 4.5
                    }deg) scale(${1 - offset * 0.035})`,
                    opacity: front ? 1 : 0.38,
                    transition: reduce
                      ? "opacity 180ms linear"
                      : "transform 460ms cubic-bezier(0.23,1,0.32,1), opacity 300ms cubic-bezier(0.23,1,0.32,1)",
                  }}
                >
                  <CardixCard accent="#2ed3e0" mode={m.id} />
                </div>
              );
            })}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
