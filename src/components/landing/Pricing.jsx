"use client";

import Link from "next/link";
import { Check, ArrowRight } from "lucide-react";
import { Reveal, useSpotlight } from "./primitives";

const PLANS = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    line: "Enough to replace a paper card entirely.",
    features: [
      "One card profile with a public URL",
      "Branded QR code in your accent",
      "All 8 themes and 12 accents",
      "Headline analytics: views and scans",
      "500 MB vault and rich notes",
      "Full, minimal and contact only sharing",
    ],
    cta: "lp-btn-ghost",
  },
  {
    name: "Pro",
    price: "$5",
    period: "per month",
    line: "For people whose network is the job.",
    featured: true,
    features: [
      "Everything in Free",
      "Full analytics: devices, referrers, clicks",
      "Audience management and viewer controls",
      "Targeted link access rules",
      "10 GB vault storage",
      "Custom domain support",
    ],
    cta: "lp-btn-accent",
  },
  {
    name: "Business",
    price: "$15",
    period: "per month",
    line: "For teams handing out one identity.",
    features: [
      "Everything in Pro",
      "Up to 10 profiles on one account",
      "Team dashboard and shared analytics",
      "100 GB shared vault",
      "White label QR codes",
      "Priority support",
    ],
    cta: "lp-btn-ghost",
  },
];

function Plan({ p }) {
  const { ref, onPointerMove } = useSpotlight();
  return (
    <article
      ref={ref}
      onPointerMove={onPointerMove}
      className="lp-spot relative flex h-full flex-col rounded-[20px] border p-6 sm:p-7"
      style={
        p.featured
          ? {
              borderColor: "rgba(46,211,224,0.34)",
              background:
                "linear-gradient(180deg, rgba(46,211,224,0.08), rgba(241,239,233,0.02) 46%)",
              boxShadow:
                "0 1px 0 rgba(241,239,233,0.07) inset, 0 34px 64px -36px rgba(0,0,0,0.9)",
            }
          : { borderColor: "var(--line)", background: "var(--surface)" }
      }
    >
      {p.featured && (
        <span
          className="absolute -top-3 left-6 rounded-full border bg-[var(--ink-900)] px-2.5 py-1 text-[11px] font-medium"
          style={{ borderColor: "rgba(46,211,224,0.4)", color: "var(--accent)" }}
        >
          Most picked
        </span>
      )}

      <h3 className="text-[15px] font-semibold tracking-[-0.012em]">{p.name}</h3>
      <p className="mt-1.5 text-[13.5px] leading-relaxed text-[var(--paper-faint)]">
        {p.line}
      </p>

      <p className="mt-6 flex items-baseline gap-1.5">
        <span className="lp-display text-[44px] tracking-[-0.045em]">{p.price}</span>
        <span className="text-[13px] text-[var(--paper-faint)]">{p.period}</span>
      </p>

      <div className="my-6 h-px bg-[var(--line)]" />

      <ul className="flex-1 space-y-3">
        {p.features.map((f) => (
          <li key={f} className="flex gap-2.5">
            <Check
              size={15}
              strokeWidth={2}
              color={p.featured ? "var(--accent)" : "var(--paper-faint)"}
              className="mt-0.5 shrink-0"
            />
            <span className="text-[14px] leading-[1.5] text-[var(--paper-dim)]">
              {f}
            </span>
          </li>
        ))}
      </ul>

      <Link href="/signup" className={`lp-btn ${p.cta} group mt-8 w-full`}>
        Create your card
        <ArrowRight
          size={16}
          strokeWidth={2}
          className="transition-transform duration-200 ease-out group-hover:translate-x-0.5"
        />
      </Link>
    </article>
  );
}

export function Pricing() {
  return (
    <section
      id="pricing"
      className="relative scroll-mt-20 border-t border-[var(--line)] bg-[var(--ink-925)] px-5 py-24 sm:px-8 sm:py-32"
    >
      <div className="mx-auto max-w-[1240px]">
        <Reveal>
          <h2 className="lp-display max-w-2xl text-[clamp(2rem,4.6vw,3.2rem)]">
            Free covers most people. <span className="lp-hi">Honestly.</span>
          </h2>
          <p className="lp-measure mt-6 text-[16px] leading-[1.65] text-[var(--paper-dim)]">
            You only need a paid tier once you start caring who scanned, or once
            more than one person shares the account.
          </p>
        </Reveal>

        <div className="mt-14 grid gap-4 lg:grid-cols-3">
          {PLANS.map((p, i) => (
            <Reveal key={p.name} delay={i * 80} className="h-full">
              <Plan p={p} />
            </Reveal>
          ))}
        </div>

        <Reveal delay={120}>
          <p className="mt-8 text-[13px] leading-relaxed text-[var(--paper-faint)]">
            Prices in USD. Cancel any time. Your data is exportable and deletable
            on request.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
